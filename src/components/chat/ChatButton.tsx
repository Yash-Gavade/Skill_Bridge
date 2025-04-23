
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg",
        "hover:shadow-xl hover:scale-105 transition-all duration-200",
        "bg-primary text-primary-foreground",
        "flex items-center justify-center p-0",
        isOpen && "opacity-0 pointer-events-none"
      )}
      size="icon"
    >
      <Bot className="h-6 w-6" />
    </Button>
  );
}
