import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useProjectsStore, ProjectPhase, ConsultantRole, type Consultant } from "@/store/projectsStore";
import axios from "axios";

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockProjectData = {
  name: "Enterprise CRM Migration",
  company: "Acme Industries",
  description: "Migration of legacy CRM system to modern cloud-based solution with enhanced reporting capabilities and mobile access.",
  duration: "12 weeks",
  consultantRoles: [
    { title: "Data Migration Specialist", count: 0 },
    { title: "Frontend Engineer", count: 0 },
    { title: "Technical Architect", count: 0 },
    { title: "Integration Specialist", count: 0 }
  ] as ConsultantRole[]
};

// Consultant name mapping for more realistic names
const consultantNames = [
  "John Smith",
  "Emma Johnson",
  "Michael Brown",
  "Sarah Davis",
  "David Wilson",
  "Jennifer Martinez",
  "Robert Taylor",
  "Lisa Anderson",
  "James Thomas",
  "Amanda Jackson",
  "Daniel White",
  "Jessica Harris",
  "Christopher Lewis",
  "Michelle Clark",
  "Matthew Lee",
  "Elizabeth Walker",
  "Andrew Hall",
  "Stephanie Allen",
  "Richard Young",
  "Nicole King"
];

export function AddProjectModal({ open, onOpenChange }: AddProjectModalProps) {
  const { toast } = useToast();
  const { addProject, addConsultants } = useProjectsStore();
  const [roles, setRoles] = useState<ConsultantRole[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState<"upload" | "review" | "processing">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [projectData, setProjectData] = useState({
    name: "",
    company: "",
    description: "",
    duration: "",
    consultantRoles: [] as ConsultantRole[],
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [apiConsultantData, setApiConsultantData] = useState<any[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
      setFile(file);
      setStep("processing");
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('http://75.101.145.1:8000/process_pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log("API Response:", response.data); // Log the full response for debugging
        
        // Extract project data from response
        const projectAutofill = response.data.project_autofill || {};
        const resultsData = response.data.results || {};
        
        // Ensure consultants array exists
        const consultants = projectAutofill.consultants || [];
        
        // Store the full consultant data for later use
        setApiConsultantData(consultants);
        
        // Log the results data to debug score extraction
        console.log("Results data:", resultsData);
        
        // Create consultant objects from API data
        const consultantsFromAPI: Consultant[] = consultants.map((consultant: any, index: number) => {
          // Get a name from our mapping or generate a fallback
          const nameIndex = index % consultantNames.length;
          const consultantName = consultantNames[nameIndex];
          
          // Get score from results if available
          const consultantKey = `${consultant.Consultant_no}`;
          let score = 0;
          
          if (resultsData[consultantKey]) {
            try {
              // Parse the score from the string format
              const resultString = resultsData[consultantKey];
              console.log(`Score string for ${consultantKey}:`, resultString);
              
              // Handle different string formats
              if (typeof resultString === 'string') {
                // Replace Python's None with JavaScript's null before parsing
                const jsonString = resultString.replace(/'/g, '"').replace(/None/g, 'null');
                
                try {
                  const resultObject = JSON.parse(jsonString);
                  score = resultObject.score || 0;
                } catch(e) {
                  // If JSON parsing fails, try extracting the score directly
                  const scoreMatch = resultString.match(/'score':\s*([\d.]+)/);
                  if (scoreMatch && scoreMatch[1]) {
                    score = parseFloat(scoreMatch[1]);
                  }
                }
              } else if (typeof resultString === 'number') {
                score = resultString;
              } else if (typeof resultString === 'object' && resultString !== null) {
                score = resultString.score || 0;
              }
              
              console.log(`Parsed score for ${consultantKey}:`, score);
            } catch (e) {
              console.error("Error parsing consultant score:", e);
            }
          }
          console.log("🚀 ~ score:", score)
          
          return {
            id: `api-${index + 1}`,
            name: consultantName,
            role: consultant.Role,
            skills: consultant.Skills || [],
            status: "available" as const,
            location: consultant.Location_Preference || "Unspecified",
            domain: consultant.Domain_Expertise || undefined,
            level: consultant.Level_Of_Consultant || undefined,
            score: score, // Add the score to the consultant data
          };
        });
        
        // Log the created consultants to verify scores are present
        console.log("Consultants with scores:", consultantsFromAPI);
        
        // Add consultants to the store
        addConsultants(consultantsFromAPI);
        
        // Get unique roles and count them
        const roles: Record<string, number> = {};
        consultants.forEach((consultant: any) => {
          if (typeof consultant.Role === 'string') {
            roles[consultant.Role] = (roles[consultant.Role] || 0) + 1;
          }
        });
        
        // Convert to ConsultantRole array
        const consultantRoles = Object.entries(roles).map(([title, count]) => ({
          title,
          count
        })) as ConsultantRole[];
        
        // Set default project data if not available in API response
        setProjectData({
          name: projectAutofill.project_name || "New Project",
          company: projectAutofill.company_name || "Company",
          description: projectAutofill.project_description || "Project description",
          duration: projectAutofill.total_time ? `${projectAutofill.total_time} days` : "30 days",
          consultantRoles: consultantRoles,
        });
        
        setRoles(consultantRoles);
        setStep("review");
      } catch (error) {
        console.error("Error processing PDF:", error);
        toast({
          variant: "destructive",
          title: "Error processing file",
          description: "There was an error processing your file. Please try again."
        });
        setStep("upload");
        setFile(null);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file"
      });
    }
  };

  const handleRoleCountChange = (index: number, value: string) => {
    const numValue = parseInt(value, 10);
    const countValue = isNaN(numValue) ? 0 : numValue;
    
    setRoles(currentRoles => 
      currentRoles.map((role, i) => 
        i === index 
          ? { ...role, count: countValue }
          : role
      )
    );
    
    setProjectData(prev => ({
      ...prev,
      consultantRoles: roles.map((role, i) => 
        i === index 
          ? { ...role, count: countValue }
          : role
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a list of consultant IDs to use from the store
    const consultantIds: string[] = [];
    
    roles.forEach((role) => {
      const count = role.count || 0;
      const matchingConsultants = apiConsultantData
        .filter(c => c.Role === role.title)
        .map((_, index) => `api-${index + 1}`);
      
      for (let i = 0; i < count; i++) {
        if (matchingConsultants.length > 0) {
          const consultantId = matchingConsultants[i % matchingConsultants.length];
          consultantIds.push(consultantId);
        }
      }
    });
    
    const newProject = {
      id: Math.random().toString(36).substring(2, 9),
      name: projectData.name,
      description: projectData.description,
      client: { 
        name: projectData.company, 
        contact: "",
        email: "",
        phone: "" 
      },
      status: "unassigned",
      skills: [],
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      progress: 0,
      workflowPhase: "unassigned" as const,
      executionPhase: null,
      phases: [],
      files: [],
      feedbackThreads: [],
      projectNotifications: [],
      matchedConsultants: [], // We don't directly add consultants here anymore
      consultantRoles: projectData.consultantRoles,
      duration: projectData.duration,
    };
    
    // Add the project
    addProject(newProject);
    
    // Project created toast notification
    toast({
      title: "Project created",
      description: "The project has been successfully created with consultants added to the store"
    });
    
    // Reset state
    onOpenChange(false);
    setStep("upload");
    setFile(null);
    setProjectData({
      name: "",
      company: "",
      description: "",
      duration: "",
      consultantRoles: [],
    });
    setApiConsultantData([]);
  };

  const renderUploadStep = () => (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-primary bg-primary-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <div>
            <p className="font-medium text-lg mb-1">Upload Project Brief</p>
            <p className="text-sm text-gray-500 mb-4">
              PDF files up to 10MB
            </p>
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}>
              Select File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="py-8 space-y-6">
      <div className="text-center">
        <FileText className="h-14 w-14 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Processing {file?.name}</h3>
        <p className="text-gray-500 mb-6">Extracting project information...</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 max-w-xs mx-auto">
          <div className="bg-primary h-2.5 rounded-full animate-[progress_20s_ease-in-out]" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input 
              id="name" 
              value={projectData.name} 
              onChange={(e) => setProjectData({...projectData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input 
              id="company" 
              value={projectData.company}
              onChange={(e) => setProjectData({...projectData, company: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Project Description</Label>
          <Textarea 
            id="description" 
            rows={4}
            value={projectData.description}
            onChange={(e) => setProjectData({...projectData, description: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Project Duration</Label>
          <Input 
            id="duration" 
            placeholder="e.g. 6 weeks, 3 months"
            value={projectData.duration}
            onChange={(e) => setProjectData({...projectData, duration: e.target.value})}
            required
          />
        </div>

        <div className="space-y-4">
          <Label>Consultants Needed</Label>
          <div className="space-y-3">
            {roles.map((role, index) => (
              <div 
                key={role.title} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium">{role.title}</span>
                <Input
                  type="text"
                  className="w-20 text-center"
                  value={role.count}
                  onChange={(e) => handleRoleCountChange(index, e.target.value)}
                  placeholder="Qty"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <DialogFooter className="sticky bottom-0 pt-4 bg-white">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setStep("upload");
            setFile(null);
          }}
        >
          Back
        </Button>
        <Button type="submit">Create Project</Button>
      </DialogFooter>
    </form>
  );

  const renderContent = () => {
    switch (step) {
      case "upload": return renderUploadStep();
      case "processing": return renderProcessingStep();
      case "review": return renderReviewStep();
      default: return renderUploadStep();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "upload" && "Add New Project"}
            {step === "processing" && "Processing File"}
            {step === "review" && "Review Project Information"}
          </DialogTitle>
          <DialogDescription>
            {step === "upload" && "Upload a project brief to automatically extract information or create a project manually."}
            {step === "processing" && "Please wait while we extract project information from your file."}
            {step === "review" && "Review and edit the extracted project information before creating the project."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {renderContent()}
        </div>
        
        {step === "upload" && (
          <DialogFooter className="sticky bottom-0 pt-4 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
