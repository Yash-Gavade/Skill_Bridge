import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, Users, VideoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NotificationDialog, NotificationDialogProps } from "./NotificationDialog";

interface HealthcareInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interviewDate?: string;
  interviewTime?: string;
  location?: string;
  interviewers?: string[];
  interviewType?: "technical" | "behavioral" | "initial" | "final";
  duration?: string;
}

export function HealthcareInterviewDialog({
  open,
  onOpenChange,
  interviewDate = "May 10, 2023",
  interviewTime = "11:00 AM",
  location = "Virtual Meeting",
  interviewers = ["Alex Thompson", "Elena Rodriguez"],
  interviewType = "technical",
  duration = "45 minutes"
}: HealthcareInterviewDialogProps) {
  const navigate = useNavigate();

  const handleMarkAsReviewed = () => {
    // Navigate to dashboard
    navigate("/dashboard");
    toast.success("Marked as reviewed", {
      description: "Notification has been marked as reviewed.",
    });
  };

  const interviewContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview
        </Badge>
        <Badge variant="outline">{duration}</Badge>
      </div>
      
      <div className="border rounded-md p-3 space-y-3 bg-gray-50">
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div className="text-sm">Date: <span className="font-medium">{interviewDate}</span></div>
        </div>
        
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <Clock className="h-4 w-4 text-gray-500" />
          <div className="text-sm">Time: <span className="font-medium">{interviewTime}</span></div>
        </div>
        
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <VideoIcon className="h-4 w-4 text-gray-500" />
          <div className="text-sm">Location: <span className="font-medium">{location}</span></div>
        </div>
        
        <div className="grid grid-cols-[16px_1fr] gap-2 items-start">
          <Users className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="text-sm">
            <div className="mb-0.5">Interviewers:</div>
            <div>
              {interviewers.map((interviewer, index) => (
                <div key={index} className="font-medium">{interviewer}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="text-sm font-medium mb-2">Interview Preparation:</div>
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <div className="text-sm">Review project requirements</div>
        </div>
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <div className="text-sm">Prepare examples of previous work</div>
        </div>
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <div className="text-sm">Be ready to discuss healthcare domain knowledge</div>
        </div>
      </div>
    </div>
  );

  const dialogProps: NotificationDialogProps = {
    open,
    onOpenChange,
    title: "Healthcare Portal Interview",
    description: `An interview has been scheduled for the Healthcare Portal Redesign project.`,
    type: "message",
    content: interviewContent,
    icon: <VideoIcon className="h-5 w-5 text-blue-500" />,
    actions: {
      primaryAction: {
        label: "Mark as Reviewed",
        onClick: handleMarkAsReviewed
      },
      dismissAction: {
        label: "Dismiss",
        onClick: () => {
          toast.info("Notification dismissed", {
            description: "This interview is still scheduled. You can find it in your calendar."
          });
        }
      }
    }
  };

  return <NotificationDialog {...dialogProps} />;
} 