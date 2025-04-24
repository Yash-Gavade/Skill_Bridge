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
import { Bell, CheckCircle, Info, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NotificationDropdownProps {
  onClose: () => void;
}

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    title: 'Healthcare Portal Redesign',
    content: 'Scheduled an internal interview for the Healthcare Portal Redesign project. Please review details.',
    timestamp: new Date('2023-05-10T11:00:00').toISOString(),
    type: 'meeting',
    read: false
  },
  {
    id: '2',
    title: 'E-commerce Platform Migration',
    content: 'You\'ve been assigned to the E-commerce Platform Migration project. Check your dashboard for details.',
    timestamp: new Date('2023-05-09T16:30:00').toISOString(),
    type: 'assignment',
    read: false
  },
  {
    id: '3',
    title: 'System Update',
    content: 'The platform will undergo maintenance this weekend. No action required.',
    timestamp: new Date('2023-05-08T09:15:00').toISOString(),
    type: 'system',
    read: true
  },
  {
    id: '4',
    title: 'New Project Opportunity',
    content: 'A new banking project matching your skills is available. Review and express interest by Friday.',
    timestamp: new Date('2023-05-07T14:22:00').toISOString(),
    type: 'opportunity',
    read: true
  },
  {
    id: '5',
    title: 'Profile Update Required',
    content: 'Please update your skill profile to improve project matching accuracy.',
    timestamp: new Date('2023-05-06T10:45:00').toISOString(),
    type: 'system',
    read: true
  }
];

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [markingAsRead, setMarkingAsRead] = useState<string[]>([]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleViewAllNotifications = () => {
    navigate("/dashboard");
    onClose();
  };
  
  const handleMarkAsRead = (notificationId: string) => {
    setMarkingAsRead(prev => [...prev, notificationId]);
    
    // Simulate API call delay
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setMarkingAsRead(prev => prev.filter(id => id !== notificationId));
      toast.success("Marked as read", {
        description: "Notification has been marked as read.",
        duration: 1000
      });
    }, 600);
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Bell className="h-4 w-4 text-blue-500" />;
      case "assignment": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "opportunity": return <Zap className="h-4 w-4 text-amber-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <DropdownMenuContent align="end" className="w-[350px]">
      <DropdownMenuLabel className="flex items-center justify-between">
        <span>Recent Notifications</span>
        {unreadCount > 0 && (
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      
      <ScrollArea className="max-h-[350px]">
        <DropdownMenuGroup>
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map(notification => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start cursor-default p-0">
                <div className="w-full p-3 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notification.type)}
                      <span className="text-sm font-medium">
                        {notification.title}
                      </span>
                    </div>
                    {!notification.read && (
                      <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 text-[10px] h-5">
                        New
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        SB
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {notification.content}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <div className="flex gap-2 mt-2 justify-end">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1 text-blue-600 border-blue-100 hover:bg-blue-50"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markingAsRead.includes(notification.id)}
                      >
                        {markingAsRead.includes(notification.id) ? (
                          <span className="flex items-center gap-1">
                            <span className="animate-spin h-3 w-3 rounded-full border-2 border-blue-600 border-opacity-50 border-t-blue-600"></span>
                            Marking...
                          </span>
                        ) : (
                          <>Mark as read</>
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
        onClick={handleViewAllNotifications}
      >
        View all notifications
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
} 