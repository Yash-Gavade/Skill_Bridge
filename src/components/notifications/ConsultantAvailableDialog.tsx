import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Clock, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NotificationDialog, NotificationDialogProps } from "./NotificationDialog";

interface ConsultantAvailableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultantName: string;
  consultantRole?: string;
  skills?: string[];
  availableFrom?: string;
  hoursPerWeek?: number;
}

export function ConsultantAvailableDialog({
  open,
  onOpenChange,
  consultantName,
  consultantRole = "Consultant",
  skills = ["General Consulting"],
  availableFrom = "Immediately",
  hoursPerWeek = 40
}: ConsultantAvailableDialogProps) {
  const navigate = useNavigate();

  const handleMarkAsReviewed = () => {
    // Navigate to dashboard
    navigate("/dashboard");
    toast.success("Marked as reviewed", {
      description: "Notification has been marked as reviewed.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const consultantContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(consultantName)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div className="font-medium text-base">{consultantName}</div>
          <div className="text-sm text-muted-foreground">{consultantRole}</div>
        </div>
      </div>
      
      <div className="border rounded-md p-3 space-y-3 bg-gray-50">
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div className="text-sm">Available from: <span className="font-medium">{availableFrom}</span></div>
        </div>
        
        <div className="grid grid-cols-[16px_1fr] gap-2 items-center">
          <Clock className="h-4 w-4 text-gray-500" />
          <div className="text-sm">Availability: <span className="font-medium">{hoursPerWeek} hours/week</span></div>
        </div>
        
        <div className="grid grid-cols-[16px_1fr] gap-2 items-start">
          <Briefcase className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="text-sm">
            <div className="mb-1">Skills:</div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const dialogProps: NotificationDialogProps = {
    open,
    onOpenChange,
    title: "New Consultant Available",
    description: `${consultantName} is now available for project assignments.`,
    type: "consultant",
    content: consultantContent,
    icon: <UserCheck className="h-5 w-5 text-green-500" />,
    actions: {
      primaryAction: {
        label: "Mark as Reviewed",
        onClick: handleMarkAsReviewed
      },
      dismissAction: {
        label: "Dismiss",
        onClick: () => {
          toast.info("Notification dismissed", {
            description: "You can find available consultants in the consultants section."
          });
        }
      }
    }
  };

  return <NotificationDialog {...dialogProps} />;
} 