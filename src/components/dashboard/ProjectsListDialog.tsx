import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project, useProjectsStore } from "@/store/projectsStore";
import { ArrowRight, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectsListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample project data
const sampleProjects = [
  {
    id: "p1",
    name: "Healthcare Portal Redesign",
    description: "A comprehensive redesign of the healthcare portal with modern UI and improved patient features.",
    status: "In Progress",
    workflowPhase: "in_progress" as const,
    executionPhase: "development" as const,
    skills: ["React", "UI/UX", "Healthcare"],
    startDate: "2023-03-15",
    endDate: "2023-06-30",
    progress: 65,
    client: {
      name: "MediCare Systems",
      logo: "/logos/medicare.svg"
    },
    projectNotifications: [],
    matchedConsultants: []
  },
  {
    id: "p2",
    name: "E-commerce Platform Migration",
    description: "Migration of legacy e-commerce platform to a modern microservices architecture.",
    status: "Active",
    workflowPhase: "internal_interviews" as const,
    skills: ["Node.js", "Microservices", "AWS"],
    startDate: "2023-04-01",
    endDate: "2023-09-15",
    progress: 32,
    client: {
      name: "ShopGlobal Inc.",
      logo: "/logos/shopglobal.svg"
    },
    projectNotifications: [],
    matchedConsultants: []
  },
  {
    id: "p3",
    name: "Financial Analytics Dashboard",
    description: "Development of a real-time financial analytics dashboard for internal use.",
    status: "Active",
    workflowPhase: "profile_delivery" as const,
    skills: ["Data Visualization", "Python", "Financial Analysis"],
    startDate: "2023-02-20",
    endDate: "2023-07-10",
    progress: 45,
    client: {
      name: "Capital Investments LLC",
      logo: "/logos/capital.svg"
    },
    projectNotifications: [],
    matchedConsultants: []
  },
  {
    id: "p4",
    name: "Mobile Banking App Revamp",
    description: "Revamping the mobile banking application with enhanced security features and improved UX.",
    status: "Active",
    workflowPhase: "in_progress" as const,
    executionPhase: "testing" as const,
    skills: ["React Native", "Mobile Security", "Banking"],
    startDate: "2023-01-10",
    endDate: "2023-05-30",
    progress: 78,
    client: {
      name: "SecureBank Financial",
      logo: "/logos/securebank.svg"
    },
    projectNotifications: [],
    matchedConsultants: []
  },
  {
    id: "p5",
    name: "HR Management System",
    description: "Development of a comprehensive HR management system for enterprise usage.",
    status: "Active",
    workflowPhase: "client_interviews" as const,
    skills: ["Java", "Spring Boot", "HR Tech"],
    startDate: "2023-03-01",
    endDate: "2023-08-15",
    progress: 25,
    client: {
      name: "Enterprise Solutions Inc.",
      logo: "/logos/enterprise.svg"
    },
    projectNotifications: [],
    matchedConsultants: []
  }
];

export function ProjectsListDialog({ open, onOpenChange }: ProjectsListDialogProps) {
  const navigate = useNavigate();
  const { projects } = useProjectsStore();
  
  // If there are projects in the store, use them; otherwise use sample data
  const projectsList = Object.keys(projects).length > 0 
    ? Object.values(projects) 
    : sampleProjects;

  const getPhaseLabel = (project: Project) => {
    if (project.workflowPhase === "in_progress" && project.executionPhase) {
      return `${formatPhase(project.workflowPhase)} - ${formatPhase(project.executionPhase)}`;
    }
    return formatPhase(project.workflowPhase);
  };

  const formatPhase = (phase: string) => {
    return phase.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Active Projects</DialogTitle>
          <DialogDescription>
            Overview of all active projects in your organization
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow mt-4">
          <div className="space-y-4">
            {projectsList.map((project) => (
              <div 
                key={project.id} 
                className="rounded-lg border p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{project.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1 max-w-xl">
                      {project.description}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-xs"
                    onClick={() => handleViewProject(project.id)}
                  >
                    View Details <ArrowUpRight size={14} />
                  </Button>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={project.workflowPhase === "in_progress" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {getPhaseLabel(project)}
                      </Badge>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar size={14} />
                        <span>{new Date(project.startDate).toLocaleDateString()}</span>
                        <ArrowRight size={12} />
                        <span>{new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={project.progress} 
                      className="h-2" 
                    />
                    <span className="text-sm">{project.progress}%</span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    {project.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 