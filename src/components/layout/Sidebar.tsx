import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    Grid2X2,
    History,
    Settings,
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
            <div className="font-semibold text-lg text-primary-600">SkillBridge</div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)} 
            className="ml-auto"
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
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                SB
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">SkillBridge HQ</p>
                <p className="text-xs text-muted-foreground truncate">Enterprise Plan</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mx-auto">
              SB
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
