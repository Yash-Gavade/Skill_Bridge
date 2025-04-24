import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Briefcase,
    Calendar,
    Mail,
    MapPin,
    Phone,
    Star
} from "lucide-react";
import { ViewProfileButton } from "./ViewProfileButton";

interface ConsultantDetailsProps {
  consultant: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    avatar?: string;
    skills: string[];
    status: string;
    location: string;
    rating?: number;
    availableFrom?: string;
    experience?: string;
    projectsCompleted?: number;
    // Additional properties
    expertise?: string[];
    pastProjects?: any[];
    availability?: any;
    documents?: any[];
    summary?: string;
  };
}

export function ConsultantDetails({ consultant }: ConsultantDetailsProps) {
  const initials = consultant.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
    
  // Status color mapping
  const statusColors: Record<string, string> = {
    "available": "bg-green-100 text-green-800",
    "assigned": "bg-blue-100 text-blue-800",
    "busy": "bg-amber-100 text-amber-800",
    "leave": "bg-gray-100 text-gray-800",
    "in_selection": "bg-purple-100 text-purple-800",
    "interviewing": "bg-indigo-100 text-indigo-800",
    "unavailable": "bg-red-100 text-red-800",
    "unknown": "bg-gray-100 text-gray-800"
  };

  const statusLabels: Record<string, string> = {
    "available": "Available",
    "assigned": "Assigned",
    "busy": "Busy",
    "leave": "On Leave",
    "in_selection": "In Selection Process",
    "interviewing": "Interviewing with Client",
    "unavailable": "Unavailable",
    "unknown": "Unknown Status"
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Consultant Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="flex flex-col md:flex-row items-center gap-4 pb-4 border-b">
          <Avatar className="h-24 w-24 rounded-md shadow-sm border">
            {consultant.avatar ? (
              <img 
                src={consultant.avatar} 
                alt={consultant.name}
                className="h-full w-full object-cover" 
              />
            ) : (
              <AvatarFallback className="bg-primary-50 text-primary-700 text-3xl">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold mb-1">{consultant.name}</h2>
            <p className="text-gray-600 mb-2">{consultant.role}</p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge className={statusColors[consultant.status] || statusColors.unknown}>
                {statusLabels[consultant.status] || statusLabels.unknown}
              </Badge>
              
              {consultant.rating && (
                <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{consultant.rating.toFixed(1)}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Skills */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-1">
            {consultant.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="bg-gray-50">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{consultant.email}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{consultant.phone}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{consultant.location}</span>
          </div>
        </div>
        
        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          {consultant.experience && (
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                <Briefcase className="h-4 w-4" />
                <span>Experience</span>
              </div>
              <span className="font-semibold">{consultant.experience}</span>
            </div>
          )}
          
          {consultant.projectsCompleted && (
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                <Briefcase className="h-4 w-4" />
                <span>Projects</span>
              </div>
              <span className="font-semibold">{consultant.projectsCompleted}</span>
            </div>
          )}
          
          {consultant.availableFrom && (
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md col-span-2">
              <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                <Calendar className="h-4 w-4" />
                <span>Available From</span>
              </div>
              <span className="font-semibold">{consultant.availableFrom}</span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="pt-2">
          <ViewProfileButton 
            consultantId={consultant.id} 
            consultantName={consultant.name}
            consultantInitials={initials}
          />
        </div>
      </CardContent>
    </Card>
  );
} 