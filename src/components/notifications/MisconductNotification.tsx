import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MisconductNotificationProps {
  reportId: string;
  projectName?: string;
}

export function MisconductNotification({ reportId, projectName }: MisconductNotificationProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/misconduct-reports/${reportId}`);
  };

  return (
    <div className="p-4 rounded-lg border border-red-200 bg-red-50">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800 mb-1">Employee misconduct reported</h3>
          <p className="text-sm text-red-700 mb-3">
            {projectName ? (
              <>Issue reported in <span className="font-medium">{projectName}</span> project. Please review as soon as possible.</>
            ) : (
              <>A misconduct report has been filed. Please review as soon as possible.</>
            )}
          </p>
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full sm:w-auto text-xs bg-red-600 hover:bg-red-700"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
} 