import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageType, useProjectsStore } from "@/store/projectsStore";
import { Bell, CheckCircle, MessageSquare, UserCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MessageDropdownProps {
  onClose: () => void;
}

export function MessageDropdown({ onClose }: MessageDropdownProps) {
  const navigate = useNavigate();
  const { messages, markMessageAsRead, acceptMeetingInvitation, declineMeetingInvitation } = useProjectsStore();
  const [acceptingIds, setAcceptingIds] = useState<string[]>([]);
  const [decliningIds, setDecliningIds] = useState<string[]>([]);
  
  // Get most recent messages
  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5); // Show only 5 most recent messages
  
  const handleViewAllMessages = () => {
    navigate("/dashboard");
    onClose();
  };
  
  const handleMarkAsRead = (messageId: string) => {
    markMessageAsRead(messageId);
  };
  
  const handleAcceptInvitation = (messageId: string) => {
    setAcceptingIds(prev => [...prev, messageId]);
    
    // Simulate API call delay
    setTimeout(() => {
      acceptMeetingInvitation(messageId);
      setAcceptingIds(prev => prev.filter(id => id !== messageId));
      toast.success("Invitation accepted", {
        description: "The meeting has been added to your calendar",
        duration: 1000,
      });
    }, 800);
  };
  
  const handleDeclineInvitation = (messageId: string) => {
    setDecliningIds(prev => [...prev, messageId]);
    
    // Simulate API call delay
    setTimeout(() => {
      declineMeetingInvitation(messageId);
      setDecliningIds(prev => prev.filter(id => id !== messageId));
      toast.info("Invitation declined", {
        description: "You've declined the meeting invitation."
      });
    }, 800);
  };
  
  const getTypeIcon = (type: MessageType) => {
    switch (type) {
      case "meeting_invitation": return <UserCheck className="h-4 w-4 text-blue-500" />;
      case "assignment": return <UserCheck className="h-4 w-4 text-green-500" />;
      case "project_update": return <Bell className="h-4 w-4 text-amber-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <DropdownMenuContent align="end" className="w-[350px]">
      <DropdownMenuLabel className="flex items-center justify-between">
        <span>Recent Messages</span>
        {messages.filter(m => !m.read).length > 0 && (
          <Badge variant="secondary">
            {messages.filter(m => !m.read).length} unread
          </Badge>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      
      <ScrollArea className="max-h-[350px]">
        <DropdownMenuGroup>
          {recentMessages.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No messages
            </div>
          ) : (
            recentMessages.map(message => (
              <DropdownMenuItem key={message.id} className="flex flex-col items-start cursor-default p-0">
                <div className="w-full p-3 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(message.type)}
                      <span className="text-sm font-medium">
                        {message.projectName}
                      </span>
                    </div>
                    {!message.read && (
                      <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 text-[10px] h-5">
                        New
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        PM
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {message.content}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {message.type === "meeting_invitation" && !message.read && (
                    <div className="flex gap-2 mt-2 justify-end">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1 text-green-600 border-green-100 hover:bg-green-50"
                        onClick={() => handleAcceptInvitation(message.id)}
                        disabled={acceptingIds.includes(message.id) || decliningIds.includes(message.id)}
                      >
                        {acceptingIds.includes(message.id) ? (
                          <span className="flex items-center gap-1">
                            <span className="animate-spin h-3 w-3 rounded-full border-2 border-green-600 border-opacity-50 border-t-green-600"></span>
                            Accepting...
                          </span>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Accept
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1 text-red-600 border-red-100 hover:bg-red-50"
                        onClick={() => handleDeclineInvitation(message.id)}
                        disabled={acceptingIds.includes(message.id) || decliningIds.includes(message.id)}
                      >
                        {decliningIds.includes(message.id) ? (
                          <span className="flex items-center gap-1">
                            <span className="animate-spin h-3 w-3 rounded-full border-2 border-red-600 border-opacity-50 border-t-red-600"></span>
                            Declining...
                          </span>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Decline
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </ScrollArea>
      
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className="justify-center text-sm cursor-pointer" 
        onClick={handleViewAllMessages}
      >
        View all messages
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
} 