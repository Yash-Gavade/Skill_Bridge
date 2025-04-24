import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Calendar, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NotificationDialog, NotificationDialogProps } from "./NotificationDialog";

interface EcommerceMigrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName?: string;
  role?: string;
  assignedDate?: string;
  startDate?: string;
  duration?: string;
  teamSize?: number;
  projectManager?: string;
}

export function EcommerceMigrationDialog({
  open,
  onOpenChange,
  projectName = "E-commerce Platform Migration",
  role = "Frontend Developer",
  assignedDate = "May 9, 2023",
  startDate = "May 15, 2023",
  duration = "3 months",
  teamSize = 8,
  projectManager = "Sarah Chen"
}: EcommerceMigrationDialogProps) {
  const navigate = useNavigate();

  const handleMarkAsReviewed = () => {
    // Navigate to dashboard
    navigate("/dashboard");
    toast.success("Marked as reviewed", {
      description: "Notification has been marked as reviewed.",
    });
  };

  const migrationContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          New Assignment
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {role}
        </Badge>
      </div>
      
      <Card className="border-dashed">
        <CardContent className="p-3 grid grid-cols-1 gap-2.5 text-sm">
          <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>Assigned on: <span className="font-medium">{assignedDate}</span></div>
          </div>
          
          <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>Expected duration: <span className="font-medium">{duration}</span></div>
          </div>
          
          <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>Start date: <span className="font-medium">{startDate}</span></div>
          </div>
          
          <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
            <Users className="h-4 w-4 text-gray-500" />
            <div>Team size: <span className="font-medium">{teamSize} members</span></div>
          </div>
          
          <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <div>Project manager: <span className="font-medium">{projectManager}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const dialogProps: NotificationDialogProps = {
    open,
    onOpenChange,
    title: "E-commerce Platform Migration",
    description: `You've been assigned to the ${projectName} project as a ${role}.`,
    type: "message",
    content: migrationContent,
    icon: <Briefcase className="h-5 w-5 text-blue-500" />,
    actions: {
      primaryAction: {
        label: "Mark as Reviewed",
        onClick: handleMarkAsReviewed
      },
      dismissAction: {
        label: "Dismiss",
        onClick: () => {
          toast.info("Notification dismissed", {
            description: "You can find this assignment in your projects list."
          });
        }
      }
    }
  };

  return <NotificationDialog {...dialogProps} />;
} 