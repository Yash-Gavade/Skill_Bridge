from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

from langchain.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.embeddings import SentenceTransformerEmbeddings
import chromadb
from chromadb.utils import embedding_functions
from smolagents import LiteLLMModel, CodeAgent, Tool
from byaldi import RAGMultiModalModel
import os
import json
import torch
from fastapi.middleware.cors import CORSMiddleware
from pdf2image import convert_from_path
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
from qwen_vl_utils import process_vision_info

global RAG
# Set the Gemini API key
os.environ["GEMINI_API_KEY"] = "AIzaSyCvotGQ6n_gPCEnTe-iPGQDos8-tH4vzMI"  # Replace with your actual API key

# Initialize the language model
model_agent = LiteLLMModel(model_id="gemini/gemini-1.5-flash")




# model_id = "google/gemma-3-4b-it"
# model = Gemma3ForConditionalGeneration.from_pretrained(
#     model_id, device_map="auto",torch_dtype=torch.bfloat16
# )
# processor = AutoProcessor.from_pretrained(model_id)

model = Qwen2VLForConditionalGeneration.from_pretrained(
     "Qwen/Qwen2-VL-2B-Instruct",
    torch_dtype=torch.bfloat16,
     attn_implementation="flash_attention_2",
     device_map="auto" )


#processor = AutoProcessor.from_pretrained("Qwen/Qwen2-VL-2B-Instruct", trust_remote_code=True)

min_pixels = 256*28*28
max_pixels = 1280*28*28
processor = AutoProcessor.from_pretrained("Qwen/Qwen2-VL-2B-Instruct", min_pixels=min_pixels, max_pixels=max_pixels)



global index_values
index_values = None 




# Initialize the RAG model
try:
    RAG = RAGMultiModalModel.from_pretrained("vidore/colqwen2-v1.0")
    index_values=RAG.index(
        input_path="docs/",  # Ensure this directory exists or adjust the path
        index_name="cv",
        store_collection_with_index=False,
        overwrite=True,
    )
except Exception as e:
    print(f"Error initializing RAG model: {e}")
    RAG = None

# Define the ChromaRetrieverTool
class ChromaRetrieverTool(Tool):
    name = "chroma_retriever"
    description = "Uses semantic search to retrieve parts of the documentation relevant to your query."
    inputs = {
        "query": {
            "type": "string",
            "description": "The query to perform. Should be semantically close to the target documents.",
        }
    }
    output_type = "string"

    def __init__(self, collection: chromadb.Collection, **kwargs):
        super().__init__(**kwargs)
        self.collection = collection

    def forward(self, query: str) -> str:
        assert isinstance(query, str), "Your search query must be a string"
        results = self.collection.query(query_texts=[query], n_results=4)
        retrieved_docs = results["documents"][0]
        return "\nRetrieved documents:\n" + "".join(
            [f"\n\n===== Document {str(i)} =====\n" + doc for i, doc in enumerate(retrieved_docs)]
        )

# Define the Project Profiler Agent
class ProjectProfilerAgent(CodeAgent):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def run(self, document_analysis_query: str):
        """Analyzes project-related documents based on a query to extract detailed requirements.

        Args:
            document_analysis_query: A query that guides the agent to find project descriptions
                                        or related information within the loaded documents.

        Returns:
            A structured project profile with weighted criteria (string format).
        """
        retrieved_context = self.tools["chroma_retriever"].forward(document_analysis_query)  # Use the retriever tool by name

        analysis_prompt = f"""You are an expert project analyst. Based on the following document excerpts, identify and extract detailed project requirements, experience levels, industry knowledge, domain expertise, Language , Certifications, location preferences, budget constraints, project duration, and team composition. Output in the same structured project profile given below:
        Project Profile:
            1. project_name - Title or name of the project
            2. total_time - Total time line for project (in working days)  
            3. total_num_consultants - Total number of consultants required 
            4. company_name - Name of the company
            5. project_description - Describe the project in short 
            6. a. Consultant_no : Consultant 1 (The numeric no should come with word "consultant")
                Role : What is the role of the consultant
                Skills :
                Years of Experience :
                Level Of Consultant : (Buisness Analyst / Associate / Consultant / Associate Consultant / Senior Associate Consultant / Project Leader / Engagement Manager / Manager / Senior Manager / Associate Principal / Principal)
                Industry Knowledge:
                Domain Expertise:
                Certification:
                Budget Constraints:
                Location Preference:
                Language : (Spoken language in the project)
                IsPartTime : True/False

        Document Excerpts:
        {retrieved_context}

        Based on the information above, what are the key project requirements and their relative importance?"""

        return super().run(analysis_prompt)

# Define the Query Summarizer Agent
class QuerySummarizerAgent(CodeAgent):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def run(self, project_profile):
        """Analyzes the json value and generate a summarized query.

        Args:
            project_profile: The structured project profile string.

        Returns:
            A dictionary where keys are consultant IDs and values are search queries.
        """
        analysis_prompt = f"""
            ## Goal:
            Extract details for each consultant from the provided ```{project_profile}```, generate a targeted search query based on their skills and experience.

            ## Steps:

            1. **Parse Project Profile:**
               - Assume the provided text can be parsed to identify individual consultant requirements. Look for sections starting with "Consultant" followed by a number.

            2. **Extract Consultant Details:**
               - For each consultant section, extract the values for "Skills", "Years of Experience", "Level Of Consultant", "Industry Knowledge", and "Domain Expertise". If a field is not present, use "Not specified".

            3. **Construct Search Query:**
               - For each consultant, create a search query combining the extracted details in the following format:
                 ```
                 Skills: [Skills], Experience: [Years of Experience], Level: [Level Of Consultant], Industry Knowledge: [Industry Knowledge], Domain Expertise: [Domain Expertise]
                 ```

            ## Output:
    Return a valid Python dictionary object only. Keys must be consultant identifiers (e.g., "Consultant 1", "Consultant 2") and values must be their respective search query strings in the format defined above.

    {{
        "Consultant 1": "Skills: ..., Experience: ..., Level: ..., Industry Knowledge: ..., Domain Expertise: ...",
        "Consultant 2": "Skills: ..., Experience: ..., Level: ..., Industry Knowledge: ..., Domain Expertise: ...",
        ...
    }}

    Do not include any additional text before or after the dictionary.
    Do not wrap the output with triple backticks or any other formatting.
    Strictly verify that the output is a valid Python dictionary before returning the response.
    Respond only with the dictionary."""

        return super().run(analysis_prompt)

def extract_and_search(consultant_queries: Dict[str, str]):
    global RAG
    # print("final json output from agent -->>",consultant_queries )

    results = {}
    try:
        if RAG is None:
            for consultant_id in consultant_queries:
                results[consultant_id] = "RAG model not initialized."
            return results

        for consultant_id, query in consultant_queries.items():
            try:
                search_result = RAG.search(query, k=1)
                if search_result and search_result[0]:  # Check if there are results
                    results[consultant_id] = search_result[0].content if hasattr(search_result[0], 'content') else str(search_result[0])
                else:
                    results[consultant_id] = "No results found."
            except Exception as e:
                print(f"Error: Search failed for {consultant_id} with query '{query}': {e}")
                results[consultant_id] = f"Search failed: {e}"
        # print("results -->>",results)
        return results
    except:
        print("Error in extract")



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchResults(BaseModel):
    results: Dict[str, Any]
    project_autofill: Dict[str, Any]

@app.post("/process_pdf/", response_model=SearchResults)
async def process_pdf(file: UploadFile = File(...)):
    global RAG
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only PDF files are allowed.")

    try:
        contents = await file.read()
        with open("/tmp/uploaded_document.pdf", "wb") as f:
            f.write(contents)

        # Load and split the document
        loader = PyPDFLoader("/tmp/uploaded_document.pdf")
        pages = loader.load()
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
        )
        splitted_docs = splitter.split_documents(pages)

        # Initialize ChromaDB in-memory for this request
        embedding_model_name = "all-MiniLM-L6-v2"
        embed_model = SentenceTransformerEmbeddings(model_name=embedding_model_name)
        default_ef = embedding_functions.DefaultEmbeddingFunction()
        chroma_client = chromadb.Client()
        collection = chroma_client.get_or_create_collection(
            "project_requirement", embedding_function=default_ef
        )

        # Add documents to ChromaDB
        texts = [doc.page_content for doc in splitted_docs]
        metadatas = [doc.metadata for doc in splitted_docs]
        collection.add(
            embeddings=embed_model.embed_documents(texts),
            documents=texts,
            metadatas=metadatas,
            ids=[f"doc_{i}" for i in range(len(splitted_docs))],
        )

        # Instantiate the ChromaDB Retriever Tool
        chroma_retriever_tool = ChromaRetrieverTool(collection=collection)

        # Instantiate the Project Profiler Agent
        project_profiler_agent = ProjectProfilerAgent(
            tools=[chroma_retriever_tool], model=model_agent, max_steps=8
        )

        # Example usage of the Project Profiler Agent
        analysis_query = "Identify any descriptions of projects, initiatives, or work that needs specific skills, expertise, or resources mentioned in this document."
        project_profile_string = project_profiler_agent.run(document_analysis_query=analysis_query)
      
        # Instantiate the Query Summarizer Agent
        cv_profiler_agent = QuerySummarizerAgent(
            tools=[], model=model_agent, max_steps=8
        )

        # Get the consultant queries
        consultant_queries_string = cv_profiler_agent.run(project_profile_string)

        



        consultant_queries={}
        try:
            consultant_queries = json.loads(consultant_queries_string)
            search_results = extract_and_search(consultant_queries)
            print(type(search_results))
            print(type(project_profile_string))
            return {"results": search_results,"peoject_autofill":project_profile_string}
        except:
            search_results = extract_and_search(consultant_queries_string)
            print(type(search_results))
            print(type(project_profile_string))
            
            return {"results": search_results,"project_autofill":project_profile_string}
        

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




class QueryRequest(BaseModel):
    query: str


@app.post("/process_query/")
async def search_documents(request: QueryRequest):
    try:
        global index_values
        query = request.query
        # index_name = INDEX_NAME
        # if index_values:
        #     pass
        # else:
        #     index_values = RAG.index(
        #         input_path="docs_pdf/",
        #         index_name=index_name,
        #         store_collection_with_index=True,
        #         overwrite=True,
        #     )
        # Get top 3 results
        results = RAG.search(query, k=1)
        # Collect all three images
        image_list = []
        result_info = []
        for result in results:
            page_num = result["page_num"]
            pdf_num = result["doc_id"]
            path_file = index_values.get(pdf_num)
            images = convert_from_path(path_file)
            image_index = page_num - 1
            image_list.append(images[image_index])
            # Store info for return value
            result_info.append({
                "page_num": page_num,
                "pdf_num": str(path_file) + "  " + str(pdf_num)
            })
        # Process with Qwen2 using all three images
        
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "image", "image": image_list[0]},
                    {"type": "text", "text": query},
                ],
            }
        ]
        text = processor.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )
 
        image_inputs, video_inputs = process_vision_info(messages)
        inputs = processor(
            text=[text],
            images=image_inputs,
            videos=video_inputs,
            padding=True,
            return_tensors="pt",
        )
 
        inputs = inputs.to("cuda")
 
        # Generate the response
        generated_ids = model.generate(**inputs, max_new_tokens=128)
        generated_ids_trimmed = [
            out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
        ]
        output_text = processor.batch_decode(
            generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
        )
 
        return {
            # "query": query,
            # "results": result_info,  # Info about all 3 images used
            "output_text": output_text[0] if output_text else "No output generated"
        }
    except Exception as e:
        logger.error(f"Search error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)