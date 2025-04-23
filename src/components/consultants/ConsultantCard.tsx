import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { ConsultantStatus } from "@/store/projectsStore";
import { ConsultantCardProps } from "./ConsultantCard.d";
import { Check } from "lucide-react";

const statusColors: Record<ConsultantStatus, string> = {
  "available": "bg-green-100 text-green-800",
  "assigned": "bg-blue-100 text-blue-800",
  "busy": "bg-amber-100 text-amber-800", 
  "leave": "bg-gray-100 text-gray-800",
  "in_selection": "bg-purple-100 text-purple-800",
  "interviewing": "bg-indigo-100 text-indigo-800",
  "unavailable": "bg-red-100 text-red-800"
};

const statusLabels: Record<ConsultantStatus, string> = {
  "available": "Available",
  "assigned": "Assigned",
  "busy": "Busy",
  "leave": "On Leave",
  "in_selection": "In Selection Process",
  "interviewing": "Interviewing with Client",
  "unavailable": "Unavailable"
};

export function ConsultantCard({ consultant, selectable, onSelect }: ConsultantCardProps) {
  const { name, role, avatar, skills, status, location, score } = consultant;
  const navigate = useNavigate();
  
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Format score to 1 decimal place if it exists
  const formattedScore = score !== undefined ? score.toFixed(1) : undefined;
  console.log("🚀 ~ ConsultantCard ~ score:", score)
  console.log("🚀 ~ ConsultantCard ~ formattedScore:", formattedScore)

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative",
      selectable && "cursor-pointer",
      consultant.selected && selectable && "ring-2 ring-primary"
    )}>
      {formattedScore && (
        <div className="absolute top-2 right-2 z-10 bg-amber-100 text-amber-800 rounded-full px-2.5 py-1 text-xs font-semibold">
          Score: {formattedScore}
        </div>
      )}
      
      <CardHeader className="pt-6 px-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 flex-shrink-0 text-lg font-medium">
            {avatar ? (
              <img 
                src={avatar} 
                alt={name} 
                className="w-full h-full object-cover rounded-full" 
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base">{name}</h3>
            <p className="text-sm text-gray-500">{role}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn("text-xs px-2", statusColors[status])}>
                {statusLabels[status]}
              </Badge>
              <span className="text-xs text-gray-500">{location}</span>
            </div>
          </div>
          {selectable && consultant.selected && !formattedScore && (
            <div className="absolute top-2 right-2">
              <Check className="h-6 w-6 text-primary" />
            </div>
          )}
          {selectable && consultant.selected && formattedScore && (
            <div className="absolute top-2 right-16">
              <Check className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 py-3">
        <div className="flex flex-wrap gap-1 mb-1">
          {skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="bg-gray-50 text-xs">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="bg-gray-50 text-xs">
              +{skills.length - 3} more
            </Badge>
          )}
        </div>
        {status !== "available" && consultant.availableFrom && (
          <p className="text-xs text-gray-500 mt-2">
            Available from: {consultant.availableFrom}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 px-6 pt-0 pb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1" 
          onClick={() => navigate(`/consultants/${consultant.id}`)}
        >
          View Profile
        </Button>
        {selectable ? (
          <Button 
            variant={consultant.selected ? "default" : "outline"} 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(consultant.id);
            }}
          >
            {consultant.selected ? "Selected" : "Select"}
          </Button>
        ) : (
          status === "available" && (
            <Button variant="default" size="sm" className="flex-1">
              Assign
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}
