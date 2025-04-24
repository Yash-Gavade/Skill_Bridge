import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Calendar, CheckCircle2, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NotificationDialog, NotificationDialogProps } from "./NotificationDialog";

interface ProjectMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  milestoneTitle?: string;
  completion?: number;
  completedAt?: string;
  dueDate?: string;
  teamMembers?: number;
  nextMilestone?: string;
}

export function ProjectMilestoneDialog({
  open,
  onOpenChange,
  projectName,
  milestoneTitle = "Project Milestone",
  completion = 60,
  completedAt = "Today",
  dueDate = "Next week",
  teamMembers = 5,
  nextMilestone = "System Testing"
}: ProjectMilestoneDialogProps) {
  const navigate = useNavigate();

  const handleMarkAsReviewed = () => {
    // Navigate to dashboard
    navigate("/dashboard");
    toast.success("Marked as reviewed", {
      description: "Notification has been marked as reviewed.",
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 30) return "bg-amber-500";
    return "bg-red-500";
  };

  const milestoneContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <div className="font-medium">Project Progress</div>
        <Badge>{completion}% Complete</Badge>
      </div>
      
      <Progress 
        value={completion} 
        className="h-2" 
        // Fix for the linter error in ConsultantUtilizationDialog
        // Using style instead of a custom prop
        style={{ 
          "--progress-background": getProgressColor(completion) 
        } as React.CSSProperties}
      />
      
      <div className="grid grid-cols-1 gap-3 mt-4">
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <div className="text-sm">
            <span className="font-medium">{milestoneTitle}</span> completed on {completedAt}
          </div>
        </div>
        
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <BarChart3 className="h-4 w-4 text-blue-500" />
          <div className="text-sm">
            Project is progressing as expected
          </div>
        </div>
        
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div className="text-sm">
            Next milestone due: <span className="font-medium">{dueDate}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <Clock className="h-4 w-4 text-gray-500" />
          <div className="text-sm">
            Next milestone: <span className="font-medium">{nextMilestone}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <Users className="h-4 w-4 text-gray-500" />
          <div className="text-sm">
            Team members: <span className="font-medium">{teamMembers}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const dialogProps: NotificationDialogProps = {
    open,
    onOpenChange,
    title: "Project Milestone Reached",
    description: `A milestone has been completed in the ${projectName} project.`,
    type: "milestone",
    content: milestoneContent,
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    actions: {
      primaryAction: {
        label: "Mark as Reviewed",
        onClick: handleMarkAsReviewed
      },
      dismissAction: {
        label: "Dismiss",
        onClick: () => {
          toast.info("Notification dismissed", {
            description: "You can view all milestones in the project section."
          });
        }
      }
    }
  };

  return <NotificationDialog {...dialogProps} />;
} 