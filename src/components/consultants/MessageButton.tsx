import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { ConsultantMessage } from "./ConsultantMessage";

interface MessageButtonProps extends ButtonProps {
  consultantId: string;
  consultantName: string;
  consultantAvatar?: string;
  consultantInitials: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}

export function MessageButton({
  consultantId,
  consultantName,
  consultantAvatar,
  consultantInitials,
  variant = "outline",
  size = "sm",
  fullWidth = false,
  className,
  ...props
}: MessageButtonProps) {
  return (
    <ConsultantMessage
      consultantId={consultantId}
      consultantName={consultantName}
      consultantAvatar={consultantAvatar}
      consultantInitials={consultantInitials}
      currentUserId="admin"
      currentUserName="Admin User"
    >
      <Button 
        variant={variant} 
        size={size} 
        className={cn(
          "gap-2",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        <MessageCircle size={size === "sm" ? 16 : 20} />
        <span>Message</span>
      </Button>
    </ConsultantMessage>
  );
} 