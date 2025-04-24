import { MessageDetailsModal } from "@/components/modals/MessageDetailsModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, useProjectsStore } from "@/store/projectsStore";
import { AlertCircle, MailOpen, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function MessagesPanel() {
  const navigate = useNavigate();
  const { messages, markAllMessagesAsRead, markMessageAsRead } = useProjectsStore();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  
  const handleOpenMessage = (message: Message) => {
    setSelectedMessage(message);
    setMessageModalOpen(true);
    setActiveMessageId(message.id);
    
    // Mark message as read
    if (!message.read) {
      markMessageAsRead(message.id);
      
      // Show toast for new messages
      toast.info("Opening new message", {
        description: `From project: ${message.projectName}`,
        action: {
          label: "View Project",
          onClick: () => {
            setMessageModalOpen(false);
            navigate(`/projects/${message.projectId}`);
          }
        }
      });
    }
  };
  
  const handleMarkAllRead = () => {
    markAllMessagesAsRead();
    toast.success("All messages marked as read");
  };
  
  // Group messages by project
  const groupedMessages = messages?.reduce((acc, message) => {
    if (!acc[message.projectId]) {
      acc[message.projectId] = [];
    }
    acc[message.projectId].push(message);
    return acc;
  }, {} as Record<string, typeof messages>) || {};

  const projectIds = Object.keys(groupedMessages);
  
  const unreadCount = messages?.filter(m => !m.read).length || 0;
  
  // Handle modal close and reset active message
  const handleModalClose = (open: boolean) => {
    setMessageModalOpen(open);
    if (!open) {
      setActiveMessageId(null);
    }
  };
  
  // Effect to handle unread message count in page title
  useEffect(() => {
    if (unreadCount > 0) {
      // Update page title with unread count
      const currentTitle = document.title.replace(/^\(\d+\)\s/, '');
      document.title = `(${unreadCount}) ${currentTitle}`;
    }
    
    return () => {
      // Reset title when component unmounts
      const currentTitle = document.title.replace(/^\(\d+\)\s/, '');
      document.title = currentTitle;
    };
  }, [unreadCount]);
  
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                <span>Messages & Invitations</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1">{unreadCount}</Badge>
                )}
              </div>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground"
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {projectIds.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm">No messages or invitations yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projectIds.map((projectId) => {
                const projectMessages = groupedMessages[projectId];
                const latestMessage = projectMessages[0];
                const hasUnread = projectMessages.some(m => !m.read);
                
                return (
                  <div
                    key={projectId}
                    className={`flex items-start p-3 border rounded-md 
                      ${hasUnread ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'} 
                      ${activeMessageId === latestMessage.id ? 'ring-2 ring-primary' : ''}
                      cursor-pointer transition-all duration-200`}
                    onClick={() => handleOpenMessage(latestMessage)}
                  >
                    <Avatar className="h-9 w-9 mr-3">
                      <AvatarFallback className={`${hasUnread ? 'bg-primary/20' : 'bg-primary/10'} text-primary`}>
                        {hasUnread ? <AlertCircle size={16} /> : <MailOpen size={16} />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm ${hasUnread ? 'font-semibold' : 'font-medium'}`}>
                          {latestMessage.projectName}
                          {hasUnread && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(latestMessage.timestamp).toLocaleString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {latestMessage.content}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        {projectMessages.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            +{projectMessages.length - 1} more messages
                          </Badge>
                        )}
                        {hasUnread && (
                          <Badge variant="secondary" className="text-xs">
                            {projectMessages.filter(m => !m.read).length} unread
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <MessageDetailsModal 
        open={messageModalOpen}
        onOpenChange={handleModalClose}
        message={selectedMessage}
      />
    </>
  );
} 