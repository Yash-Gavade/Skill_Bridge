import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NotificationDialog, NotificationDialogProps } from "./NotificationDialog";

interface MisconductNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: string;
  employee?: string;
  issueType?: string;
  createdAt?: string;
  description?: string;
}

export function MisconductNotificationDialog({
  open,
  onOpenChange,
  project,
  employee = "Anonymous Reporter",
  issueType = "Misconduct",
  createdAt = "Recently",
  description = "An issue has been reported regarding employee conduct. Please review and take appropriate action."
}: MisconductNotificationDialogProps) {
  const navigate = useNavigate();

  const handleMarkAsReviewed = () => {
    // Navigate to dashboard
    navigate("/dashboard");
    toast.success("Marked as reviewed", {
      description: "Notification has been marked as reviewed.",
    });
  };

  const misconductContent = (
    <div className="space-y-4">
      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          This issue requires immediate attention according to company policy.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
        <div className="font-medium text-muted-foreground">Project:</div>
        <div className="font-medium">{project}</div>
        
        <div className="font-medium text-muted-foreground">Type:</div>
        <div>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {issueType}
          </Badge>
        </div>
        
        <div className="font-medium text-muted-foreground">Reported:</div>
        <div>{createdAt}</div>
        
        <div className="font-medium text-muted-foreground">Description:</div>
        <div>{description}</div>
      </div>
    </div>
  );

  const dialogProps: NotificationDialogProps = {
    open,
    onOpenChange,
    title: "Employee Misconduct Reported",
    description: `A misconduct issue has been reported in the ${project} project.`,
    type: "misconduct",
    content: misconductContent,
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    actions: {
      primaryAction: {
        label: "Mark as Reviewed",
        onClick: handleMarkAsReviewed
      },
      dismissAction: {
        label: "Dismiss",
        onClick: () => {
          toast.info("Notification dismissed", {
            description: "You can access this again from your notifications panel."
          });
        }
      }
    }
  };

  return <NotificationDialog {...dialogProps} />;
} 