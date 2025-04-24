import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    Grid2X2,
    History,
    LogOut,
    Settings,
    User,
    Users
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    icon: Grid2X2,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: FileText,
    href: "/projects",
  },
  {
    label: "Past Projects",
    icon: History,
    href: "/past-projects",
  },
  {
    label: "Employees",
    icon: Users,
    href: "/consultants",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initials from username for avatar
  const getUserInitials = () => {
    if (!user || !user.username) return "SB";
    
    // If username contains a space, use first letter of each part
    if (user.username.includes(" ")) {
      return user.username
        .split(" ")
        .map(part => part[0].toUpperCase())
        .join("");
    }
    
    // Otherwise, use first letter
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <div 
      className={cn(
        "h-screen border-r bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {!collapsed && (
            <div 
              className="font-semibold text-lg text-primary-600 cursor-pointer hover:text-primary-700 transition-colors"
              onClick={() => navigate("/")}
            >
              Skill Bridge
            </div>
          )}
          {collapsed && (
            <div 
              className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 cursor-pointer hover:bg-primary-200 transition-colors mx-auto"
              onClick={() => navigate("/")}
            >
              SB
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)} 
            className={collapsed ? "mx-auto" : "ml-auto"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => {
                    console.log("Navigating to:", item.href);
                    navigate(item.href);
                  }}
                  className={cn(
                    "flex items-center gap-x-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t mt-auto">
          {!collapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-md p-2 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">Skill Bridge</p>
                
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mx-auto cursor-pointer hover:bg-primary-200 transition-colors" onClick={() => navigate("/settings")}>
              {getUserInitials()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
