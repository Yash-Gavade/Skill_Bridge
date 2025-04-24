import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MessageType, useProjectsStore } from "@/store/projectsStore";
import { ExternalLink, MessageSquare, UserCheck } from "lucide-react";

interface ProjectMessagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  onViewProject?: () => void;
}

export function ProjectMessagesModal({ 
  open, 
  onOpenChange, 
  projectId, 
  projectName,
  onViewProject
}: ProjectMessagesModalProps) {
  const { messages, markMessageAsRead } = useProjectsStore();
  
  // Get all messages for this project
  const projectMessages = messages
    .filter(message => message.projectId === projectId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Mark all as read when opening the modal
  const handleClose = () => {
    // Mark all project messages as read
    projectMessages.forEach(message => {
      if (!message.read) {
        markMessageAsRead(message.id);
      }
    });
    onOpenChange(false);
  };
  
  const getTypeLabel = (type: MessageType) => {
    switch (type) {
      case "meeting_invitation": return "Meeting Invitation";
      case "assignment": return "Assignment";
      case "project_update": return "Project Update";
      case "general": return "Message";
      default: return "Message";
    }
  };
  
  const getTypeClass = (type: MessageType) => {
    switch (type) {
      case "meeting_invitation": return "bg-blue-100 text-blue-800";
      case "assignment": return "bg-green-100 text-green-800";
      case "project_update": return "bg-amber-100 text-amber-800";
      case "general": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getTypeIcon = (type: MessageType) => {
    switch (type) {
      case "meeting_invitation": return <UserCheck className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Project Messages</DialogTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <span>{projectName}</span>
            </Badge>
          </div>
          <DialogDescription>
            Messages related to <span className="font-semibold">{projectName}</span> project
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {projectMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p>No messages for this project</p>
            </div>
          ) : (
            projectMessages.map(message => (
              <div key={message.id} className="border rounded-md p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeClass(message.type)}>
                      <span className="flex items-center gap-1">
                        {getTypeIcon(message.type)}
                        {getTypeLabel(message.type)}
                      </span>
                    </Badge>
                    {!message.read && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">New</Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      PM
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    {message.consultantName && (
                      <div className="mt-1 text-xs text-gray-500">
                        Regarding: {message.consultantName}
                      </div>
                    )}
                    {message.read && message.type === "meeting_invitation" && (
                      <div className="mt-2">
                        <Badge className="bg-green-100 text-green-800">
                          Invitation Accepted
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <DialogFooter>
          {onViewProject && (
            <Button className="gap-2" onClick={onViewProject}>
              <ExternalLink size={16} />
              View Project Details
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 