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
import { Textarea } from "@/components/ui/textarea";
import { Message, MessageType, useProjectsStore } from "@/store/projectsStore";
import {
    Calendar,
    CheckCircle,
    Clock,
    ExternalLink,
    Info,
    Send,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MessageDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message | null;
}

export function MessageDetailsModal({ open, onOpenChange, message }: MessageDetailsModalProps) {
  const [response, setResponse] = useState("");
  const [responseType, setResponseType] = useState<"accept" | "decline" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { markMessageAsRead } = useProjectsStore();
  const navigate = useNavigate();
  
  // Reset response when modal opens with a new message
  useEffect(() => {
    if (open && message) {
      setResponse("");
      setResponseType(null);
    }
  }, [open, message]);
  
  if (!message) return null;
  
  const handleClose = () => {
    onOpenChange(false);
    setResponse("");
    setResponseType(null);
  };
  
  const handleSendResponse = () => {
    // Show loading state
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      // In a real app, this would send the response to the consultant
      if (message && !message.read) {
        markMessageAsRead(message.id);
      }
      
      // Show appropriate toast based on response type
      if (responseType === "accept") {
        toast.success("Meeting invitation accepted", {
          description: `You have accepted the meeting for ${message.projectName}`,
          duration: 1000,
        });
      } else if (responseType === "decline") {
        toast.info("Meeting invitation declined", {
          description: "Please consider rescheduling at a better time.",
          duration: 1000,
        });
      } else {
        toast.success("Response sent successfully", { duration: 1000 });
      }
      
      setIsSubmitting(false);
      setResponse("");
      setResponseType(null);
      onOpenChange(false);
    }, 600);
  };
  
  const handleAcceptInvitation = () => {
    setResponseType("accept");
    setResponse(response || "I confirm that I'll attend the meeting as scheduled.");
  };
  
  const handleDeclineInvitation = () => {
    setResponseType("decline");
    setResponse(response || "I'm unable to attend the meeting at this time.");
  };
  
  const handleViewProject = () => {
    navigate(`/projects/${message.projectId}`);
    onOpenChange(false);
  };
  
  const handleViewConsultant = () => {
    if (message.consultantId) {
      navigate(`/consultants/${message.consultantId}`);
      onOpenChange(false);
    }
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
      case "meeting_invitation": return <Calendar className="h-4 w-4" />;
      case "assignment": return <CheckCircle className="h-4 w-4" />;
      case "project_update": return <Info className="h-4 w-4" />;
      case "general": return <Info className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };
  
  const getResponseButtons = () => {
    if (message.type !== "meeting_invitation") return null;
    
    return (
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 gap-1
            ${responseType === "accept" ? "bg-green-50 border-green-300" : ""}`}
          onClick={handleAcceptInvitation}
        >
          <CheckCircle size={16} />
          Accept Invitation
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1
            ${responseType === "decline" ? "bg-red-50 border-red-300" : ""}`}
          onClick={handleDeclineInvitation}
        >
          <XCircle size={16} />
          Decline
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              <span className="flex items-center gap-2">
                {getTypeIcon(message.type)}
                {getTypeLabel(message.type)}
              </span>
            </DialogTitle>
            <Badge className={getTypeClass(message.type)}>
              {getTypeLabel(message.type)}
            </Badge>
          </div>
          <DialogDescription className="flex justify-between items-center">
            <span>From Project: <span className="font-semibold">{message.projectName}</span></span>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock size={12} />
              {new Date(message.timestamp).toLocaleDateString()}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                PM
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm">{message.content}</p>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
                {message.consultantName && (
                  <span className="text-xs text-gray-500">
                    Regarding: {message.consultantName}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {message.type === "meeting_invitation" && (
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Your Response:</h4>
              <Textarea
                placeholder="Write your response..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[100px]"
              />
              
              {/* Accept/Decline quick response buttons */}
              {getResponseButtons()}
              
              {responseType && (
                <div className="mt-2">
                  <Badge className={responseType === "accept" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {responseType === "accept" ? "Accepting" : "Declining"}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-1" onClick={handleViewProject}>
              <ExternalLink size={16} />
              View Project
            </Button>
            {message.consultantId && (
              <Button variant="outline" className="gap-1" onClick={handleViewConsultant}>
                <ExternalLink size={16} />
                View Consultant
              </Button>
            )}
          </div>
          
          {message.type === "meeting_invitation" && (
            <Button 
              onClick={handleSendResponse} 
              disabled={!response.trim() || isSubmitting}
              className={`gap-1 ${
                responseType === "accept" ? "bg-green-600 hover:bg-green-700" : 
                responseType === "decline" ? "bg-red-600 hover:bg-red-700" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <Send size={16} />
                  Send Response
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 