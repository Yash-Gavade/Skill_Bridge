import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectsStore } from "@/store/projectsStore";
import { ArrowUpRight, CalendarClock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ConsultantsListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample consultant data
const sampleConsultants = [
  {
    id: "c1",
    name: "Alex Thompson",
    role: "Senior Frontend Developer",
    avatar: "/avatars/alex.jpg",
    skills: ["React", "TypeScript", "UI/UX"],
    status: "available" as const,
    location: "New York, USA",
    availableFrom: "2023-05-01",
    domain: "Web Development",
    level: "Senior",
    score: 4.9
  },
  {
    id: "c2",
    name: "Sarah Chen",
    role: "Data Engineer",
    avatar: "/avatars/sarah.jpg",
    skills: ["Python", "SQL", "Data Pipelines"],
    status: "available" as const,
    location: "San Francisco, USA",
    availableFrom: "2023-05-15",
    domain: "Data Engineering",
    level: "Mid-level",
    score: 4.7
  },
  {
    id: "c3",
    name: "James Wilson",
    role: "DevOps Engineer",
    avatar: "/avatars/james.jpg",
    skills: ["AWS", "Docker", "Kubernetes"],
    status: "available" as const,
    location: "London, UK",
    availableFrom: "2023-04-20",
    domain: "Cloud Infrastructure",
    level: "Senior",
    score: 4.8
  },
  {
    id: "c4",
    name: "Elena Rodriguez",
    role: "Backend Developer",
    avatar: "/avatars/elena.jpg",
    skills: ["Java", "Spring Boot", "Microservices"],
    status: "available" as const,
    location: "Madrid, Spain",
    availableFrom: "2023-06-01",
    domain: "Backend Development",
    level: "Senior",
    score: 4.5
  },
  {
    id: "c5",
    name: "Michael Zhang",
    role: "Mobile Developer",
    avatar: "/avatars/michael.jpg",
    skills: ["React Native", "iOS", "Android"],
    status: "available" as const,
    location: "Toronto, Canada",
    availableFrom: "2023-05-10",
    domain: "Mobile Development",
    level: "Mid-level",
    score: 4.6
  },
  {
    id: "c6",
    name: "Lisa Johnson",
    role: "UX/UI Designer",
    avatar: "/avatars/lisa.jpg",
    skills: ["Figma", "UI Design", "User Research"],
    status: "available" as const,
    location: "Berlin, Germany",
    availableFrom: "2023-04-15",
    domain: "Design",
    level: "Senior",
    score: 4.9
  },
  {
    id: "c7",
    name: "David Patel",
    role: "Full Stack Developer",
    avatar: "/avatars/david.jpg",
    skills: ["JavaScript", "Node.js", "MongoDB"],
    status: "available" as const,
    location: "Melbourne, Australia",
    availableFrom: "2023-05-20",
    domain: "Full Stack Development",
    level: "Mid-level",
    score: 4.4
  },
  {
    id: "c8",
    name: "Sophia Kim",
    role: "QA Engineer",
    avatar: "/avatars/sophia.jpg",
    skills: ["Test Automation", "Selenium", "QA Processes"],
    status: "available" as const,
    location: "Seoul, South Korea",
    availableFrom: "2023-06-05",
    domain: "Quality Assurance",
    level: "Mid-level",
    score: 4.3
  }
];

export function ConsultantsListDialog({ open, onOpenChange }: ConsultantsListDialogProps) {
  const navigate = useNavigate();
  const { consultants } = useProjectsStore();
  
  // If there are consultants in the store, use them; otherwise use sample data
  const consultantsList = Object.keys(consultants).length > 0 
    ? Object.values(consultants).filter(c => c.status === "available")
    : sampleConsultants;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'assigned':
        return 'bg-blue-500';
      case 'unavailable':
        return 'bg-red-500';
      case 'in_selection':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleViewConsultant = (consultantId: string) => {
    navigate(`/consultants/${consultantId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Available Consultants</DialogTitle>
          <DialogDescription>
            Browse consultants available for new assignments
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consultantsList.map((consultant) => (
              <div 
                key={consultant.id} 
                className="rounded-lg border p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(consultant.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{consultant.name}</h3>
                        <p className="text-sm text-muted-foreground">{consultant.role}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(consultant.status)}`}></span>
                        <span className="text-xs capitalize">
                          {consultant.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-xs text-muted-foreground gap-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{consultant.location}</span>
                      </div>
                      {consultant.availableFrom && (
                        <div className="flex items-center gap-1">
                          <CalendarClock size={12} />
                          <span>Available from {formatDate(consultant.availableFrom)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {consultant.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {consultant.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{consultant.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs gap-1"
                        onClick={() => handleViewConsultant(consultant.id)}
                      >
                        View Profile <ArrowUpRight size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 