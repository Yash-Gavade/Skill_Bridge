
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Mock notifications data
const notifications = [
  {
    id: "n1",
    subject: "Employee misconduct reported",
    preview: "Issue reported in Website Redesign project",
    projectId: "p1",
    date: "2h ago"
  },
  {
    id: "n2",
    subject: "New consultant available",
    preview: "Sarah Chen is now available for assignments",
    projectId: "p2",
    date: "4h ago"
  },
  {
    id: "n3",
    subject: "Project milestone reached",
    preview: "Database Migration project is 60% complete",
    projectId: "p3",
    date: "1d ago"
  }
];

export function NotificationsPanel() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              <span>Important Updates</span>
            </div>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            Mark all as read
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">
                  {notification.subject}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                  {notification.preview}
                </p>
                <span className="text-xs text-muted-foreground">
                  {notification.date}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-4 whitespace-nowrap"
                onClick={() => navigate(`/projects/${notification.projectId}`)}
              >
                View Project
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
