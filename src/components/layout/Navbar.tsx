import { MessageDropdown } from "@/components/messages/MessageDropdown";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useProjectsStore } from "@/store/projectsStore";
import { Bell, MessageSquare, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [messageDropdownOpen, setMessageDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const { messages } = useProjectsStore();
  
  // Count unread messages
  const unreadCount = messages.filter(m => !m.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-16 border-b bg-white flex items-center px-6">
      <div className="flex-1">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Messages Icon */}
        <DropdownMenu open={messageDropdownOpen} onOpenChange={setMessageDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center">
                  <Badge variant="destructive" className="h-4 min-w-4 px-1 text-[10px] flex items-center justify-center rounded-full">
                    {unreadCount}
                  </Badge>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <MessageDropdown onClose={() => setMessageDropdownOpen(false)} />
        </DropdownMenu>
        
        {/* Notifications Bell */}
        <DropdownMenu open={notificationDropdownOpen} onOpenChange={setNotificationDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <NotificationDropdown onClose={() => setNotificationDropdownOpen(false)} />
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-100 text-primary-700">YG</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Yash Gavade</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              My Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
