import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  type: "update" | "message" | "misconduct" | "consultant" | "milestone" | "other";
  actions?: {
    primaryAction?: {
      label: string;
      onClick: () => void;
    };
    secondaryAction?: {
      label: string;
      onClick: () => void;
    };
    dismissAction?: {
      label: string;
      onClick: () => void;
    };
  };
  content?: React.ReactNode;
  icon?: React.ReactNode;
}

export function NotificationDialog({
  open,
  onOpenChange,
  title,
  description,
  type,
  actions,
  content,
  icon
}: NotificationDialogProps) {
  
  const handleMarkAsRead = () => {
    toast.success("Notification marked as read", {
      description: "This notification has been marked as read.",
      duration: 2000,
    });
    onOpenChange(false);
  };

  const getIconByType = () => {
    if (icon) return icon;
    
    // Default icons based on type could be implemented here
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getIconByType()}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {content && <div className="py-4">{content}</div>}
        
        <DialogFooter className="flex items-center justify-between sm:justify-end gap-2">
          {actions?.dismissAction && (
            <Button 
              variant="outline" 
              onClick={() => {
                actions.dismissAction?.onClick();
                onOpenChange(false);
              }}
            >
              {actions.dismissAction.label}
            </Button>
          )}
          
          {actions?.secondaryAction && (
            <Button 
              variant="outline" 
              onClick={() => {
                actions.secondaryAction?.onClick();
                onOpenChange(false);
              }}
            >
              {actions.secondaryAction.label}
            </Button>
          )}
          
          {actions?.primaryAction ? (
            <Button 
              onClick={() => {
                actions.primaryAction?.onClick();
                onOpenChange(false);
              }}
            >
              {actions.primaryAction.label}
            </Button>
          ) : (
            <Button onClick={handleMarkAsRead}>
              Mark as Read
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 