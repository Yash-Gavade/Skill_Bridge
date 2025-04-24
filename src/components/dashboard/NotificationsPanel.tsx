import { ProjectMessagesModal } from "@/components/modals/ProjectMessagesModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectsStore } from "@/store/projectsStore";
import { AlertCircle, Bell, Calendar, CheckCircle2, ExternalLink, FileText, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function NotificationsPanel() {
  const navigate = useNavigate();
  const { messages, markMessageAsRead } = useProjectsStore();
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [projectMessagesOpen, setProjectMessagesOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{id: string, name: string} | null>(null);
  const [activeNotification, setActiveNotification] = useState<typeof allNotifications[0] | null>(null);

  // Get meeting acceptance notifications from messages
  const acceptedInvitations = messages
    .filter(message => message.type === "meeting_invitation" && message.read)
    .map(message => ({
      id: `acceptance-${message.id}`,
      subject: "Meeting Invitation Accepted",
      preview: `${message.consultantName} has accepted the meeting invitation for ${message.projectName}`,
      projectId: message.projectId,
      projectName: message.projectName,
      consultantId: message.consultantId,
      date: new Date(message.timestamp).toLocaleDateString(),
      type: "acceptance" as const
    }));

  // Mock notifications data - in a real app, these would come from the store
  const systemNotifications = [
    {
      id: "n1",
      subject: "Employee misconduct reported",
      preview: "Issue reported in Website Redesign project",
      projectId: "p1",
      projectName: "Website Redesign",
      date: "2h ago",
      type: "alert" as const
    },
    {
      id: "n2",
      subject: "New consultant available",
      preview: "Sarah Chen is now available for assignments",
      projectId: "p2",
      projectName: "E-commerce Platform Migration",
      date: "4h ago",
      type: "info" as const
    },
    {
      id: "n3",
      subject: "Project milestone reached",
      preview: "Database Migration project is 60% complete",
      projectId: "p3",
      projectName: "Database Migration",
      date: "1d ago",
      type: "milestone" as const
    }
  ];

  // Combine both types of notifications and sort by most recent first
  const allNotifications = [...acceptedInvitations, ...systemNotifications]
    .sort((a, b) => {
      // If one notification has a date in ISO format, convert both to timestamps
      if (a.date.includes("-") || b.date.includes("-")) {
        const dateA = a.date.includes("-") ? new Date(a.date).getTime() : 0;
        const dateB = b.date.includes("-") ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      }
      // Otherwise use string comparison (for mock data like "2h ago")
      return 0;
    });

  // Handle notification click with enhanced navigation and feedback
  const handleViewNotification = (notification: typeof allNotifications[0]) => {
    // Set the active notification
    setActiveNotification(notification);
    
    // If this is an acceptance notification, open the project messages modal
    if (notification.type === "acceptance") {
      setSelectedProject({
        id: notification.projectId,
        name: notification.projectName
      });
      setProjectMessagesOpen(true);
      
      // Show a toast with details about the accepted invitation
      toast.success(`Viewing invitation acceptance for ${notification.projectName}`, {
        description: notification.preview,
        action: {
          label: "Go to Project",
          onClick: () => {
            setProjectMessagesOpen(false);
            navigate(`/projects/${notification.projectId}`);
          }
        }
      });
    } else {
      // For other notifications, show a more detailed toast with action
      toast.info(`Viewing: ${notification.subject}`, {
        description: notification.preview,
        action: {
          label: "View Details",
          onClick: () => navigate(`/projects/${notification.projectId}`)
        }
      });
      
      // Navigate to the relevant project
      navigate(`/projects/${notification.projectId}`);
    }
    
    // Mark as read in our local state
    setReadNotifications(prev => [...prev, notification.id]);
  };

  const handleMarkAllAsRead = () => {
    // Mark all as read in our local state
    const allIds = allNotifications.map(n => n.id);
    setReadNotifications(allIds);
    toast.success("All notifications marked as read");
  };

  const isRead = (id: string) => readNotifications.includes(id);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "acceptance": return <UserCheck className="h-5 w-5 text-green-500" />;
      case "alert": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "milestone": return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case "info": return <FileText className="h-5 w-5 text-gray-500" />;
      default: return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  // Close the project messages modal and navigate to project
  const handleNavigateToProject = (projectId: string) => {
    setProjectMessagesOpen(false);
    navigate(`/projects/${projectId}`);
  };

  // Effect to handle new notifications
  useEffect(() => {
    // Check if there are any unread notifications
    const unreadCount = allNotifications.filter(n => !isRead(n.id)).length;
    
    if (unreadCount > 0) {
      // You could trigger a sound or visual indicator here
      document.title = `(${unreadCount}) Skill Bridge - Dashboard`;
    } else {
      document.title = "Skill Bridge - Dashboard";
    }
    
    return () => {
      document.title = "Skill Bridge";
    };
  }, [allNotifications, readNotifications]);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-primary" />
                <span>Important Updates</span>
                {allNotifications.filter(n => !isRead(n.id)).length > 0 && (
                  <Badge variant="secondary">
                    {allNotifications.filter(n => !isRead(n.id)).length}
                  </Badge>
                )}
              </div>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allNotifications.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Bell className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              allNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start py-3 px-3 border-b last:border-0 rounded-md cursor-pointer
                    ${isRead(notification.id) ? 'opacity-70' : 'bg-blue-50 border-blue-100'}
                    ${activeNotification?.id === notification.id ? 'ring-2 ring-primary' : ''}
                    hover:bg-gray-50 transition-colors`}
                  onClick={() => handleViewNotification(notification)}
                >
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm ${isRead(notification.id) ? 'font-medium' : 'font-semibold'} truncate`}>
                        {notification.subject}
                        {!isRead(notification.id) && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>}
                      </h4>
                      <ExternalLink size={14} className="text-gray-400 ml-2 hover:text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {notification.preview}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {notification.date}
                      </span>
                      {notification.projectName && (
                        <Badge variant="outline" className="text-xs">
                          {notification.projectName}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {selectedProject && (
        <ProjectMessagesModal
          open={projectMessagesOpen}
          onOpenChange={(open) => {
            setProjectMessagesOpen(open);
            if (!open) setActiveNotification(null);
          }}
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          onViewProject={() => handleNavigateToProject(selectedProject.id)}
        />
      )}
    </>
  );
}
