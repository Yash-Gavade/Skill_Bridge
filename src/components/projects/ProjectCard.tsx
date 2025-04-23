
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProjectPhase } from "@/store/projectsStore";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
    workflowPhase: ProjectPhase;
    skills: string[];
    startDate: string;
    endDate: string;
    client?: {
      name: string;
      logo?: string;
    };
    progress?: number;
  };
}

const statusColors: Record<string, string> = {
  "unassigned": "bg-amber-100 text-amber-800",
  "internal_interviews": "bg-blue-100 text-blue-800",
  "profile_delivery": "bg-purple-100 text-purple-800",
  "client_interviews": "bg-indigo-100 text-indigo-800",
  "in_progress": "bg-green-100 text-green-800",
  "completed": "bg-gray-100 text-gray-800",
  "assigned": "bg-blue-100 text-blue-800"
};

const statusLabels: Record<string, string> = {
  "unassigned": "Unassigned",
  "internal_interviews": "Internal Interviews",
  "profile_delivery": "Profile Delivery",
  "client_interviews": "Client Interviews",
  "in_progress": "In Progress",
  "completed": "Completed",
  "assigned": "Assigned"
};

export function ProjectCard({ project }: ProjectCardProps) {
  const isUnassigned = project.workflowPhase === "unassigned";
  const statusLabel = statusLabels[project.workflowPhase] || statusLabels[project.status];
  const statusColor = statusColors[project.workflowPhase] || statusColors[project.status];
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription>{project.client?.name}</CardDescription>
          </div>
          <Badge className={cn(statusColor)}>
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span>{project.startDate}</span>
          <span>→</span>
          <span>{project.endDate}</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {project.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="bg-gray-50">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <Button 
          variant={isUnassigned ? "default" : "outline"}
          size="sm" 
          className="w-full"
        >
          {isUnassigned ? "Assign Consultants" : "View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
}
