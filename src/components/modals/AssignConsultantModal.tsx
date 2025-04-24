import { ConsultantCard } from "@/components/consultants/ConsultantCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Consultant, Project, useProjectsStore } from "@/store/projectsStore";
import { CheckCircle, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AssignConsultantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export function AssignConsultantModal({
  open,
  onOpenChange,
  project,
}: AssignConsultantModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<(Consultant & { selected: boolean })[]>([]);
  const [selectedConsultants, setSelectedConsultants] = useState<string[]>([]);
  
  // Get consultants from the store
  const { consultants, assignConsultantsToProject } = useProjectsStore();

  // Reset selections when modal opens with a new project
  useEffect(() => {
    if (open && project) {
      setSuggestions([]);
      setSelectedConsultants([]);
    }
  }, [open, project]);

  const handleGenerateSuggestions = () => {
    setLoading(true);
    // Simulate an API call to get consultant suggestions
    setTimeout(() => {
      // Get available consultants from the store
      const availableConsultants = Object.values(consultants)
        .filter(c => c.status === "available")
        .map(c => ({...c, selected: false}));
      
      setSuggestions(availableConsultants);
      setLoading(false);
    }, 1500);
  };

  const availableConsultants = suggestions.filter(
    (consultant) => consultant.status === "available"
  );
  
  const unavailableConsultants = suggestions.filter(
    (consultant) => consultant.status !== "available"
  );
  
  const handleConsultantSelect = (consultantId: string) => {
    setSuggestions(prev => prev.map(c => {
      if (c.id === consultantId) {
        return {...c, selected: !c.selected};
      }
      return c;
    }));
    
    setSelectedConsultants(prev => 
      prev.includes(consultantId)
        ? prev.filter(id => id !== consultantId)
        : [...prev, consultantId]
    );
  };
  
  const handleSubmitForInterviews = () => {
    if (!project) return;
    
    // Update the project and consultants in the store
    assignConsultantsToProject(project.id, selectedConsultants);
    
    toast.success("Project submitted for internal interviews", {
      description: `${selectedConsultants.length} consultants selected for interviews`,
      duration: 1000,
    });
    
    onOpenChange(false);
    navigate(`/projects/${project.id}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Consultants to Project</DialogTitle>
          <DialogDescription>
            Automatically find the best matches or manually select consultants.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {project && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-lg">{project.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <span>{project.startDate}</span>
                <span>→</span>
                <span>{project.endDate}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-sm text-gray-600 mr-2">Required skills:</span>
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-white">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {!suggestions.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CirclePlus className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Generate Consultant Suggestions</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Our AI will analyze consultant profiles and find the best matches for this project based on skills, availability and past work.
              </p>
              <Button 
                onClick={handleGenerateSuggestions} 
                disabled={loading}
              >
                {loading ? "Finding matches..." : "Generate Suggestions"}
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              <Tabs defaultValue="available" className="flex-1 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="justify-start">
                    <TabsTrigger value="available">
                      Available ({availableConsultants.length})
                    </TabsTrigger>
                    <TabsTrigger value="unavailable">
                      Unavailable ({unavailableConsultants.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="text-sm">
                    <span className="font-medium">{selectedConsultants.length}</span> consultants selected
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                  <TabsContent value="available" className="mt-0 h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                      {availableConsultants.map((consultant) => (
                        <div 
                          key={consultant.id} 
                          className={`relative cursor-pointer transition-all duration-200 ${
                            consultant.selected ? 'ring-2 ring-primary rounded-lg' : ''
                          }`}
                          onClick={() => handleConsultantSelect(consultant.id)}
                        >
                          <ConsultantCard consultant={consultant} />
                          {consultant.selected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-6 w-6 text-primary fill-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="unavailable" className="mt-0 h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                      {unavailableConsultants.map((consultant) => (
                        <ConsultantCard key={consultant.id} consultant={consultant} />
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            disabled={selectedConsultants.length === 0}
            onClick={handleSubmitForInterviews}
          >
            Submit for Internal Interviews
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
