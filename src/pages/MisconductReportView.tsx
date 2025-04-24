import { MisconductReportModal } from "@/components/modals/MisconductReportModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function MisconductReportView() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  
  // Mock report data for demonstration purposes
  // In a real application, you would fetch this data based on the reportId
  const reportData = {
    id: reportId || "MC-2023-0042",
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
  
  // When the modal is closed, navigate back to the previous page or dashboard
  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate(-1);
  };
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Misconduct Report</h1>
      </div>
      
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Viewing Misconduct Report</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            The report details are displayed in a modal window for confidentiality. 
            If the modal is not visible, click the button below to view the report again.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            View Misconduct Report
          </Button>
        </CardContent>
      </Card>
      
      <MisconductReportModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        reportData={reportData}
      />
    </div>
  );
} 