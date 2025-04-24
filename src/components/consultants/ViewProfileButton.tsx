import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MessageButton } from "./MessageButton";

interface ViewProfileButtonProps {
  consultantId: string;
  consultantName: string;
  consultantInitials: string;
  showMessageButton?: boolean;
}

export function ViewProfileButton({
  consultantId,
  consultantName,
  consultantInitials,
  showMessageButton = true
}: ViewProfileButtonProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-2 w-full">
      <Button 
        onClick={() => navigate(`/consultants/${consultantId}`)}
        variant="outline" 
        className="flex-1 gap-2"
      >
        <UserRound size={16} />
        <span>View Profile</span>
      </Button>
      
      {showMessageButton && (
        <MessageButton 
          consultantId={consultantId}
          consultantName={consultantName}
          consultantInitials={consultantInitials}
          variant="outline"
          size="sm"
          className="flex-1"
        />
      )}
    </div>
  );
} 