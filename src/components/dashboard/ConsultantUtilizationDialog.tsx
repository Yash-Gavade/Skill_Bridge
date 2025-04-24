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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectsStore } from "@/store/projectsStore";
import { Briefcase, Calendar, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";

interface ConsultantUtilizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample utilization data
const sampleUtilizationData = [
  {
    consultantId: "c1",
    name: "Alex Thompson",
    role: "Senior Frontend Developer",
    avatar: "/avatars/alex.jpg",
    utilization: 85,
    currentProjects: [
      { id: "p1", name: "Healthcare Portal Redesign", hours: 32 }
    ],
    availableHoursPerWeek: 40,
    assignedHoursPerWeek: 34,
    trend: "up",
    lastMonthUtilization: 80
  },
  {
    consultantId: "c2",
    name: "Sarah Chen",
    role: "Data Engineer",
    avatar: "/avatars/sarah.jpg",
    utilization: 100,
    currentProjects: [
      { id: "p2", name: "E-commerce Platform Migration", hours: 25 },
      { id: "p3", name: "Financial Analytics Dashboard", hours: 15 }
    ],
    availableHoursPerWeek: 40,
    assignedHoursPerWeek: 40,
    trend: "stable",
    lastMonthUtilization: 100
  },
  {
    consultantId: "c3",
    name: "James Wilson",
    role: "DevOps Engineer",
    avatar: "/avatars/james.jpg",
    utilization: 75,
    currentProjects: [
      { id: "p4", name: "Mobile Banking App Revamp", hours: 30 }
    ],
    availableHoursPerWeek: 40,
    assignedHoursPerWeek: 30,
    trend: "up",
    lastMonthUtilization: 65
  },
  {
    consultantId: "c4",
    name: "Elena Rodriguez",
    role: "Backend Developer",
    avatar: "/avatars/elena.jpg",
    utilization: 90,
    currentProjects: [
      { id: "p1", name: "Healthcare Portal Redesign", hours: 20 },
      { id: "p5", name: "HR Management System", hours: 16 }
    ],
    availableHoursPerWeek: 40,
    assignedHoursPerWeek: 36,
    trend: "down",
    lastMonthUtilization: 95
  },
  {
    consultantId: "c5",
    name: "Michael Zhang",
    role: "Mobile Developer",
    avatar: "/avatars/michael.jpg",
    utilization: 62.5,
    currentProjects: [
      { id: "p4", name: "Mobile Banking App Revamp", hours: 25 }
    ],
    availableHoursPerWeek: 40,
    assignedHoursPerWeek: 25,
    trend: "up",
    lastMonthUtilization: 50
  },
  {
    consultantId: "c6",
    name: "Lisa Johnson",
    role: "UX/UI Designer",
    avatar: "/avatars/lisa.jpg",
    utilization: 87.5,
    currentProjects: [
      { id: "p1", name: "Healthcare Portal Redesign", hours: 15 },
      { id: "p2", name: "E-commerce Platform Migration", hours: 20 }
    ],
    availableHoursPerWeek: 40,
    assignedHoursPerWeek: 35,
    trend: "stable",
    lastMonthUtilization: 87.5
  }
];

// Sort options
const SORT_OPTIONS = {
  NAME_ASC: "Name (A-Z)",
  NAME_DESC: "Name (Z-A)",
  UTILIZATION_HIGH: "Utilization (High to Low)",
  UTILIZATION_LOW: "Utilization (Low to High)"
};

export function ConsultantUtilizationDialog({ open, onOpenChange }: ConsultantUtilizationDialogProps) {
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.UTILIZATION_HIGH);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const { consultants, projects } = useProjectsStore();
  
  // In a real app, we would calculate utilization from the consultants and projects data
  // For now, using the sample data
  const utilizationData = sampleUtilizationData;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") {
      return <ChevronUp className="h-4 w-4 text-green-500" />;
    } else if (trend === "down") {
      return <ChevronDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "bg-green-500";
    if (utilization >= 70) return "bg-blue-500";
    if (utilization >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const toggleConsultantDetails = (consultantId: string) => {
    if (selectedConsultant === consultantId) {
      setSelectedConsultant(null);
    } else {
      setSelectedConsultant(consultantId);
    }
  };

  // Sort the data based on the selected option
  const sortedData = [...utilizationData].sort((a, b) => {
    switch (sortOption) {
      case SORT_OPTIONS.NAME_ASC:
        return a.name.localeCompare(b.name);
      case SORT_OPTIONS.NAME_DESC:
        return b.name.localeCompare(a.name);
      case SORT_OPTIONS.UTILIZATION_HIGH:
        return b.utilization - a.utilization;
      case SORT_OPTIONS.UTILIZATION_LOW:
        return a.utilization - b.utilization;
      default:
        return 0;
    }
  });

  // Calculate overall utilization
  const overallUtilization = Math.round(
    utilizationData.reduce((sum, consultant) => sum + consultant.utilization, 0) / 
    utilizationData.length
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Consultant Utilization</DialogTitle>
          <DialogDescription>
            Current utilization of consultants across all projects
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center mt-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Overall Utilization:</div>
            <Badge className="text-xs">{overallUtilization}%</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">Sort by:</div>
            <select 
              className="text-xs border rounded px-2 py-1"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              {Object.values(SORT_OPTIONS).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="space-y-4">
            {sortedData.map((consultant) => (
              <div 
                key={consultant.consultantId} 
                className="rounded-lg border overflow-hidden"
              >
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleConsultantDetails(consultant.consultantId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(consultant.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-medium">{consultant.name}</h3>
                        <p className="text-sm text-muted-foreground">{consultant.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">{consultant.utilization}%</span>
                        {getTrendIcon(consultant.trend)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {consultant.assignedHoursPerWeek} / {consultant.availableHoursPerWeek} hours
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Progress 
                      value={consultant.utilization} 
                      className="h-2" 
                      indicatorClassName={getUtilizationColor(consultant.utilization)}
                    />
                  </div>
                </div>
                
                {selectedConsultant === consultant.consultantId && (
                  <div className="bg-gray-50 p-4 border-t">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Briefcase size={14} /> Current Projects
                    </h4>
                    
                    <div className="space-y-3">
                      {consultant.currentProjects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span className="text-sm">{project.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={12} />
                            <span>{project.hours} hours/week</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} />
                          <span>Monthly Trend</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-muted-foreground">Last month:</span>
                          <Badge variant="outline" className="text-xs">{consultant.lastMonthUtilization}%</Badge>
                          <span className={`text-xs ${consultant.trend === 'up' ? 'text-green-500' : consultant.trend === 'down' ? 'text-red-500' : ''}`}>
                            {consultant.trend === 'up' ? '↑' : consultant.trend === 'down' ? '↓' : '→'}
                            {Math.abs(consultant.utilization - consultant.lastMonthUtilization)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Full Schedule
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 