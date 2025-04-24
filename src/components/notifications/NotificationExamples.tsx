import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationExamples() {
  const {
    openMisconductNotification,
    openConsultantNotification,
    openMilestoneNotification,
    openHealthcareInterviewNotification,
    openEcommerceMigrationNotification
  } = useNotifications();

  const handleMisconductDemo = () => {
    openMisconductNotification({
      project: "Website Redesign",
      employee: "Anonymous Reporter",
      issueType: "Misconduct",
      createdAt: "2h ago",
      description: "An issue has been reported regarding employee conduct. Please review and take appropriate action."
    });
  };

  const handleConsultantDemo = () => {
    openConsultantNotification({
      consultantName: "Sarah Chen",
      consultantRole: "Data Engineer",
      skills: ["Data Modeling", "ETL", "SQL", "Python"],
      availableFrom: "Immediately",
      hoursPerWeek: 40
    });
  };

  const handleMilestoneDemo = () => {
    openMilestoneNotification({
      projectName: "Database Migration",
      milestoneTitle: "Data Migration Plan",
      completion: 60,
      completedAt: "Today",
      dueDate: "Next week",
      teamMembers: 5,
      nextMilestone: "Data Validation"
    });
  };

  const handleHealthcareInterviewDemo = () => {
    openHealthcareInterviewNotification({
      interviewDate: "May 10, 2023",
      interviewTime: "11:00 AM",
      location: "Virtual Meeting",
      interviewers: ["Alex Thompson", "Elena Rodriguez"],
      interviewType: "technical",
      duration: "45 minutes"
    });
  };

  const handleEcommerceDemo = () => {
    openEcommerceMigrationNotification({
      projectName: "E-commerce Platform Migration",
      role: "Frontend Developer",
      assignedDate: "May 9, 2023",
      startDate: "May 15, 2023",
      duration: "3 months",
      teamSize: 8,
      projectManager: "Sarah Chen"
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Notification Dialogs Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Misconduct</CardTitle>
            <CardDescription>Notification for reported misconduct issues</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleMisconductDemo} className="w-full">
              Open Misconduct Dialog
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>New Consultant</CardTitle>
            <CardDescription>Notification for newly available consultants</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConsultantDemo} className="w-full">
              Open Consultant Dialog
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Project Milestone</CardTitle>
            <CardDescription>Notification for project milestone completion</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleMilestoneDemo} className="w-full">
              Open Milestone Dialog
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Healthcare Interview</CardTitle>
            <CardDescription>Notification for scheduled interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleHealthcareInterviewDemo} className="w-full">
              Open Interview Dialog
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Project Assignment</CardTitle>
            <CardDescription>Notification for new project assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleEcommerceDemo} className="w-full">
              Open Assignment Dialog
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 