import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, FileText, MessageSquare, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MisconductReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData?: {
    id: string;
    title: string;
    description: string;
    status: "new" | "investigating" | "resolved" | "dismissed";
    severity: "low" | "medium" | "high" | "critical";
    reportedBy: string;
    reportedAt: string;
    project?: {
      id: string;
      name: string;
    };
    employee?: {
      id: string;
      name: string;
      position: string;
    };
    witnesses?: string[];
    evidence?: {
      type: string;
      description: string;
      url?: string;
    }[];
    timeline?: {
      date: string;
      action: string;
      by: string;
    }[];
  };
}

export function MisconductReportModal({ 
  open, 
  onOpenChange, 
  reportData 
}: MisconductReportModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  
  // Mock data for demo purposes (would be replaced with actual data in production)
  const mockReportData = {
    id: "MC-2023-0042",
    title: "Employee misconduct reported",
    description: "Issues reported regarding professional conduct during the Website Redesign project. The employee in question allegedly displayed unprofessional behavior during team meetings and failed to follow project guidelines.",
    status: "investigating" as const,
    severity: "medium" as const,
    reportedBy: "Jane Smith",
    reportedAt: "2023-09-15T14:30:00",
    project: {
      id: "p123",
      name: "Website Redesign project"
    },
    employee: {
      id: "e456",
      name: "John Doe",
      position: "Senior Developer"
    },
    witnesses: ["Alex Johnson", "Maria Garcia"],
    evidence: [
      {
        type: "document",
        description: "Email exchanges regarding missed deadlines",
        url: "/documents/evidence-001.pdf"
      },
      {
        type: "meeting",
        description: "Recording of team meeting on Sept 10",
        url: "/recordings/meeting-sept10.mp4"
      }
    ],
    timeline: [
      {
        date: "2023-09-15",
        action: "Report filed",
        by: "Jane Smith"
      },
      {
        date: "2023-09-16",
        action: "Initial review completed",
        by: "HR Department"
      },
      {
        date: "2023-09-18",
        action: "Investigation started",
        by: "Ethics Committee"
      }
    ]
  };
  
  // Use mockReportData if no reportData is provided
  const data = reportData || mockReportData;
  
  // Status and severity badges styling
  const statusStyles = {
    new: "bg-blue-100 text-blue-800",
    investigating: "bg-amber-100 text-amber-800",
    resolved: "bg-green-100 text-green-800",
    dismissed: "bg-gray-100 text-gray-800"
  };
  
  const severityStyles = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-purple-100 text-purple-800"
  };
  
  const statusLabels = {
    new: "New Report",
    investigating: "Under Investigation",
    resolved: "Resolved",
    dismissed: "Dismissed"
  };
  
  const severityLabels = {
    low: "Low Severity",
    medium: "Medium Severity",
    high: "High Severity",
    critical: "Critical Severity"
  };
  
  const handleViewProject = () => {
    if (data.project) {
      navigate(`/projects/${data.project.id}`);
      onOpenChange(false);
    }
  };
  
  const handleViewEmployee = () => {
    if (data.employee) {
      navigate(`/consultants/${data.employee.id}`);
      onOpenChange(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <DialogTitle>{data.title}</DialogTitle>
          </div>
          <DialogDescription className="flex items-center justify-between">
            <span>Report ID: {data.id}</span>
            <span>Reported: {formatDate(data.reportedAt)}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-3 mb-4">
          <Badge className={statusStyles[data.status]}>
            {statusLabels[data.status]}
          </Badge>
          <Badge className={severityStyles[data.severity]}>
            {severityLabels[data.severity]}
          </Badge>
          <span className="text-sm text-gray-500">by {data.reportedBy}</span>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Misconduct Report</AlertTitle>
              <AlertDescription>
                This report contains sensitive information. Please maintain confidentiality.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-1">Description</h3>
                <p className="text-sm">{data.description}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-2">Project Information</h3>
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{data.project?.name}</p>
                        <p className="text-xs text-gray-500">Associated Project</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-2">Employee Information</h3>
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-gray-100 text-gray-800">
                          {data.employee?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{data.employee?.name}</p>
                        <p className="text-xs text-gray-500">{data.employee?.position}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {data.witnesses && data.witnesses.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-2">Witnesses</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.witnesses.map((witness, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {witness}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="evidence" className="space-y-4">
            {data.evidence && data.evidence.length > 0 ? (
              <div className="space-y-3">
                {data.evidence.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {item.type === 'document' ? (
                            <FileText className="h-5 w-5 text-blue-500" />
                          ) : item.type === 'meeting' ? (
                            <Users className="h-5 w-5 text-green-500" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-purple-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          {item.url && (
                            <Button variant="outline" size="sm" className="text-xs">
                              View {item.type}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p>No evidence has been attached to this report</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            {data.timeline && data.timeline.length > 0 ? (
              <div className="relative border-l-2 border-gray-200 pl-4 ml-2 space-y-6">
                {data.timeline.map((event, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[22px] h-4 w-4 rounded-full bg-primary"></div>
                    <div className="mb-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{event.date}</span>
                    </div>
                    <h4 className="font-medium">{event.action}</h4>
                    <p className="text-sm text-gray-600">By: {event.by}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p>No timeline events have been recorded</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleViewProject}>
              View Project
            </Button>
            <Button variant="outline" onClick={handleViewEmployee}>
              View Employee
            </Button>
          </div>
          
          <Button>
            Mark as Reviewed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 