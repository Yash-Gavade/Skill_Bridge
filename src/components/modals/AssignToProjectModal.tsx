import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Project, useProjectsStore } from "@/store/projectsStore";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AssignToProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultantId: string;
  consultantName: string;
}

export function AssignToProjectModal({
  open,
  onOpenChange,
  consultantId,
  consultantName,
}: AssignToProjectModalProps) {
  const { projects, updateProject, updateConsultant } = useProjectsStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Get all unassigned or in_progress projects
  const availableProjects = Object.values(projects).filter(
    (project) => project.workflowPhase === "unassigned" || project.workflowPhase === "in_progress"
  );
  
  const handleAssign = () => {
    if (!selectedProjectId) {
      toast.error("Please select a project first");
      return;
    }
    
    // Update the consultant status
    updateConsultant(consultantId, {
      status: "assigned"
    });
    
    // Update the project's matched consultants
    const project = projects[selectedProjectId];
    const updatedConsultants = [...project.matchedConsultants];
    
    // Check if consultant is already in the list
    const existingIndex = updatedConsultants.findIndex(c => c.id === consultantId);
    
    if (existingIndex === -1) {
      // Add the consultant to the project
      const consultantToAdd = {
        id: consultantId,
        name: consultantName,
        // Assuming we have these values somewhere
        role: "Consultant",
        status: "assigned",
        skills: [],
        location: "",
      };
      
      updatedConsultants.push(consultantToAdd);
    } else {
      // Update the existing consultant
      updatedConsultants[existingIndex] = {
        ...updatedConsultants[existingIndex],
        status: "assigned"
      };
    }
    
    // Update the project
    updateProject(selectedProjectId, {
      matchedConsultants: updatedConsultants,
      // If unassigned, move to internal_interviews phase
      workflowPhase: project.workflowPhase === "unassigned" 
        ? "internal_interviews" 
        : project.workflowPhase,
    });
    
    toast.success(`${consultantName} has been assigned to the project`);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Assign to Project</DialogTitle>
          <DialogDescription>
            Select a project to assign {consultantName} to.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4 max-h-[400px] overflow-y-auto pr-2">
          {availableProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No available projects found. Create a new project first.
            </div>
          ) : (
            availableProjects.map((project) => (
              <ProjectCard 
                key={project.id}
                project={project}
                selected={selectedProjectId === project.id}
                onClick={() => setSelectedProjectId(project.id)} 
              />
            ))
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={!selectedProjectId || availableProjects.length === 0}
          >
            Assign to Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ProjectCardProps {
  project: Project;
  selected: boolean;
  onClick: () => void;
}

function ProjectCard({ project, selected, onClick }: ProjectCardProps) {
  return (
    <Card 
      className={`relative cursor-pointer transition-all ${
        selected 
          ? "border-primary ring-1 ring-primary" 
          : "hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
      )}
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium">{project.name}</h3>
            {project.client && (
              <p className="text-sm text-gray-500">{project.client.name}</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {project.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.skills.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{project.duration || `${project.startDate} - ${project.endDate}`}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span>
                {project.workflowPhase.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 