
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectsStore, ConsultantStatus } from "@/store/projectsStore";
import { useNavigate } from "react-router-dom";

const statusColors: Record<ConsultantStatus, string> = {
  "available": "bg-green-100 text-green-800",
  "assigned": "bg-blue-100 text-blue-800",
  "busy": "bg-amber-100 text-amber-800",
  "leave": "bg-gray-100 text-gray-800",
  "in_selection": "bg-purple-100 text-purple-800",
  "interviewing": "bg-indigo-100 text-indigo-800",
  "unavailable": "bg-red-100 text-red-800"
};

const statusLabels: Record<ConsultantStatus, string> = {
  "available": "Available",
  "assigned": "Assigned",
  "busy": "Busy",
  "leave": "On Leave",
  "in_selection": "In Selection Process",
  "interviewing": "Interviewing with Client",
  "unavailable": "Unavailable"
};

export function ProjectAssignedConsultants({ projectId }: { projectId?: string }) {
  const navigate = useNavigate();
  const { projects } = useProjectsStore();
  
  if (!projectId) return null;
  
  const project = projects[projectId];
  if (!project) return null;
  
  // Only show consultants who are on the project (either assigned or in_selection/interviewing)
  const consultants = project.matchedConsultants.filter(
    consultant => ["assigned", "in_selection", "interviewing"].includes(consultant.status)
  );
  
  if (consultants.length === 0) {
    return (
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No consultants assigned to this project yet.</p>
          <Button size="sm" variant="outline" className="mt-2">
            Assign Consultants
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-3">
      {consultants.map((consultant) => (
        <div 
          key={consultant.id}
          className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {consultant.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{consultant.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{consultant.role}</span>
              <Badge className={statusColors[consultant.status]}>
                {statusLabels[consultant.status]}
              </Badge>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/consultants/${consultant.id}`)}
          >
            View
          </Button>
        </div>
      ))}
    </div>
  );
}
