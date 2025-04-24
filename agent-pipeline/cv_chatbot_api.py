import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from byaldi import RAGMultiModalModel
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
from qwen_vl_utils import process_vision_info
from pdf2image import convert_from_path
from typing import List
import shutil
import torch
import logging
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from transformers import AutoProcessor, Gemma3ForConditionalGeneration

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HF_TOKEN = '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'

device = torch.device("cuda")
RAG = RAGMultiModalModel.from_pretrained("vidore/colpali-v1.2", verbose=1, device=device,index_root=".financial_data")






model_id = "google/gemma-3-4b-it"

model = Gemma3ForConditionalGeneration.from_pretrained(
    model_id, device_map="auto",torch_dtype=torch.bfloat16
)
processor = AutoProcessor.from_pretrained(model_id)




global index_values
index_values = None 

INDEX_NAME = "psi_pdf"
DOCS_DIR = "docs_pdf/"
INDEX_DIR = ".financial_data"  # Byaldi's default index storage directory


if os.path.exists(INDEX_DIR):
    try:
        shutil.rmtree(INDEX_DIR)  # Delete the directory and its contents
        print(f"Directory '{INDEX_DIR}' deleted successfully.")
    except OSError as e:
        print(f"Error deleting directory '{INDEX_DIR}': {e}")


os.makedirs(DOCS_DIR, exist_ok=True)
#os.makedirs(INDEX_DIR, exist_ok=True)


INDEXED_FILES = set()
if os.path.exists(DOCS_DIR):
    INDEXED_FILES.update(f for f in os.listdir(DOCS_DIR) if os.path.isfile(os.path.join(DOCS_DIR, f)))

class QueryRequest(BaseModel):
    query: str
    k: int = 1


@app.post("/upload/")
async def index_documents(files: List[UploadFile] = File(...)):
    try:
        global index_values
        new_files = []
        new_file_paths = []
        
        # Save new files and track them
        for file in files:
            if file.filename not in INDEXED_FILES:
                file_path = os.path.join(DOCS_DIR, file.filename)
                logger.info(f"Saving PDF to: {file_path}")
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
                if not os.path.exists(file_path):
                    raise FileNotFoundError(f"Failed to save PDF: {file_path}")
                new_files.append(file.filename)
                new_file_paths.append(file_path)
                INDEXED_FILES.add(file.filename)
                logger.info(f"Added {file.filename} to indexed files")

        if new_files:
            logger.info(f"New PDFs to index: {new_files}")
            # Check if index already exists in .byaldi/psi_pdf
            index_path = os.path.join(INDEX_DIR, INDEX_NAME)
            index_exists = os.path.exists(index_path)
            logger.info(f"Index exists at {index_path}: {index_exists}")
            
            if index_exists:
                logger.info(f"Adding to existing index with paths: {new_file_paths}")
                for file_path in new_file_paths:
                    index_values=RAG.add_to_index(
                        input_item=file_path,
                        store_collection_with_index=True,
                        doc_id=None,
                        metadata=None
                    )
            else:
                logger.info(f"Creating new index with directory: {DOCS_DIR}")
                index_values=RAG.index(
                    input_path=DOCS_DIR,
                    index_name=INDEX_NAME,
                    store_collection_with_index=True,
                    overwrite=True
                )

            return {"message": f"Successfully indexed {len(new_files)} new PDFs. Total indexed: {len(INDEXED_FILES)}"}
        else:
            return {"message": "No new PDFs to index"}

    except Exception as e:
        logger.error(f"Indexing error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Indexing failed: {str(e)}")


class QueryRequest(BaseModel):
    query: str


@app.post("/process_query/")
async def search_documents(request: QueryRequest):
    try:
        global index_values
        query = request.query
        index_name = INDEX_NAME
        if index_values:
            pass
        else:
            index_values = RAG.index(
                input_path="docs_pdf/",
                index_name=index_name,
                store_collection_with_index=True,
                overwrite=True,
            )
        # Get top 3 results
        results = RAG.search(query, k=2)
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
                    {"type": "image", "image": image_list[1]},
                    #{"type": "image", "image": image_list[2]},
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
        generated_ids = model.generate(**inputs, max_new_tokens=512)
        generated_ids_trimmed = [
            out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
        ]
        output_text = processor.batch_decode(
            generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
        )
 
        return {
            "query": query,
            "results": result_info,  # Info about all 3 images used
            "output_text": output_text[0] if output_text else "No output generated"
        }
    except Exception as e:
        logger.error(f"Search error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")




##########################################################################################

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8700)




