
import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  FileText, 
  Star, 
  Calendar as CalendarIcon, 
  User, 
  Settings, 
  Loader 
} from "lucide-react";

// Mock data for consultant profiles
const consultants = {
  "c1": {
    id: "c1",
    name: "Alex Johnson",
    role: "Senior Frontend Developer",
    email: "alex.johnson@skillbridge.co",
    phone: "+1 (415) 555-7890",
    avatar: "",
    skills: ["React", "TypeScript", "UI/UX"],
    status: "available",
    location: "San Francisco, US",
    currentProject: null,
    availability: {
      blockers: [
        { date: new Date(2023, 3, 15), type: "vacation", label: "Vacation" },
        { date: new Date(2023, 3, 16), type: "vacation", label: "Vacation" },
        { date: new Date(2023, 3, 28), type: "personal", label: "Doctor Appointment" }
      ]
    },
    pastProjects: [
      {
        id: "pp1",
        name: "E-commerce Redesign",
        client: "Fashion Forward Inc.",
        role: "Frontend Lead",
        duration: "Jan 2023 - Mar 2023",
        feedback: 4.8,
        tags: ["On Time", "Strong Communicator"]
      },
      {
        id: "pp2",
        name: "Mobile App Development",
        client: "HealthFirst",
        role: "Senior Developer",
        duration: "Aug 2022 - Dec 2022",
        feedback: 4.5,
        tags: ["Technical Excellence"]
      }
    ],
    preferences: {
      projectTypes: ["Frontend Development", "UI/UX Design"],
      location: "Remote",
      industries: ["Healthcare", "E-commerce", "Fintech"],
      roles: ["Lead Developer", "Individual Contributor"]
    },
    notes: [
      {
        id: "n1",
        author: "Maria Rodriguez",
        date: "2023-02-15",
        content: "Alex excels in mentoring junior developers. Consider pairing him with new team members."
      }
    ]
  },
  "c2": {
    id: "c2",
    name: "Sarah Chen",
    role: "Backend Engineer",
    email: "sarah.chen@skillbridge.co",
    phone: "+49 30 12345678",
    avatar: "",
    skills: ["Node.js", "Python", "AWS"],
    status: "available",
    location: "Berlin, Germany",
    currentProject: null,
    availability: {
      blockers: [
        { date: new Date(2023, 3, 25), type: "vacation", label: "Vacation" },
        { date: new Date(2023, 3, 26), type: "vacation", label: "Vacation" },
        { date: new Date(2023, 3, 27), type: "vacation", label: "Vacation" },
        { date: new Date(2023, 4, 10), type: "personal", label: "Family Event" }
      ]
    },
    pastProjects: [
      {
        id: "pp3",
        name: "Banking API Integration",
        client: "Global Finances",
        role: "Lead Backend Developer",
        duration: "Nov 2022 - Feb 2023",
        feedback: 4.9,
        tags: ["Technical Excellence", "On Time"]
      }
    ],
    preferences: {
      projectTypes: ["API Development", "Cloud Infrastructure"],
      location: "Hybrid",
      industries: ["Finance", "Technology"],
      roles: ["Lead Developer"]
    },
    notes: [
      {
        id: "n2",
        author: "James Wilson",
        date: "2023-01-20",
        content: "Sarah prefers morning meetings. She's most productive in the afternoons."
      }
    ]
  }
};

export default function ConsultantProfile() {
  const { consultantId } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  
  // Get consultant data based on consultantId
  const consultant = consultants[consultantId as keyof typeof consultants];

  if (!consultant) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">Consultant not found</h2>
        <p className="mt-2">The consultant you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Get initials for avatar
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
  };

  const statusLabels: Record<string, string> = {
    "available": "Available",
    "assigned": "Assigned",
    "busy": "Busy",
    "leave": "On Leave",
  };

  const handleGenerateAISummary = () => {
    setIsGeneratingAI(true);
    // Simulate AI generation
    setTimeout(() => {
      setAiSummary(
        `${consultant.name} is a highly skilled ${consultant.role} with exceptional expertise in ${
          consultant.skills.join(", ")
        }. Based on past project performance, they excel in ${
          consultant.pastProjects[0]?.tags[0] || "technical implementation"
        } and ${
          consultant.pastProjects[0]?.tags[1] || "communication"
        }. They prefer ${consultant.preferences.projectTypes.join(", ")} projects in the ${
          consultant.preferences.industries.join(", ")
        } industries. Consider them for ${
          consultant.preferences.roles.join(", ")
        } positions where their strengths can be fully utilized.`
      );
      setIsGeneratingAI(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Consultant Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start md:items-center flex-col md:flex-row gap-6 md:gap-8">
          <Avatar className="w-20 h-20 md:w-24 md:h-24 text-2xl">
            <AvatarFallback className="bg-primary-50 text-primary-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{consultant.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-gray-500">{consultant.role}</span>
                  <Badge className={statusColors[consultant.status]}>
                    {statusLabels[consultant.status]}
                  </Badge>
                  <span className="text-gray-500 text-sm">{consultant.location}</span>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {consultant.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="bg-gray-50">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Summary Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">AI Profile Summary</CardTitle>
            <Button 
              variant={aiSummary ? "outline" : "default"}
              size="sm"
              onClick={handleGenerateAISummary} 
              disabled={isGeneratingAI}
              className="gap-2"
            >
              {isGeneratingAI ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : aiSummary ? (
                <>
                  <span className="rotate-270">↻</span>
                  <span>Regenerate</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🪄</span>
                  <span>Generate Summary</span>
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            AI-powered analysis of consultant strengths and fit
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGeneratingAI && (
            <div className="bg-gray-50 rounded-md p-6 text-center animate-pulse">
              <p className="text-gray-500">Analyzing consultant data...</p>
            </div>
          )}
          
          {!isGeneratingAI && !aiSummary && (
            <div className="bg-gray-50 rounded-md p-6 text-center">
              <p className="text-gray-500">Generate an AI summary to get insights about this consultant</p>
            </div>
          )}
          
          {!isGeneratingAI && aiSummary && (
            <div className="bg-gray-50 rounded-md p-4 text-gray-700">
              {aiSummary}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="overview" className="gap-2">
            <User className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="h-4 w-4" />
            Preferences & Notes
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Current Project */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Current Project</CardTitle>
                </CardHeader>
                <CardContent>
                  {consultant.currentProject ? (
                    <div className="bg-white">
                      <h3 className="font-semibold">{consultant.currentProject.name}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Role</p>
                          <p>{consultant.currentProject.role}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Client</p>
                          <p>{consultant.currentProject.client}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p>{consultant.currentProject.duration}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button size="sm">View Project</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 text-center rounded-md">
                      <p className="text-gray-500">Not currently assigned to any projects</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Assign to Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Past Projects */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Past Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {consultant.pastProjects.length === 0 ? (
                    <div className="bg-gray-50 p-6 text-center rounded-md">
                      <p className="text-gray-500">No past projects available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {consultant.pastProjects.map((project) => (
                        <div 
                          key={project.id} 
                          className="border rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{project.name}</h4>
                                <p className="text-sm text-gray-500">{project.client}</p>
                              </div>
                              <div className="flex items-center">
                                <div className="flex items-center gap-1">
                                  {[...Array(Math.floor(project.feedback))].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className="h-4 w-4 text-yellow-400 fill-yellow-400" 
                                    />
                                  ))}
                                  {project.feedback % 1 > 0 && (
                                    <Star 
                                      className="h-4 w-4 text-yellow-400" 
                                    />
                                  )}
                                </div>
                                <span className="text-sm text-gray-500 ml-1">
                                  {project.feedback.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div>
                                <p className="text-sm">{project.role}</p>
                                <p className="text-xs text-gray-500">{project.duration}</p>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {project.tags.map((tag) => (
                                  <Badge 
                                    key={tag} 
                                    variant="outline" 
                                    className="bg-gray-50 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 border-t hidden">
                            <p className="text-sm">Project details and contributions will appear here</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{consultant.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{consultant.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{consultant.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {consultant.skills.map((skill) => (
                      <Badge key={skill} className="bg-primary-50 text-primary-700 hover:bg-primary-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Calendar Tab */}
        <TabsContent value="calendar" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
              <CardDescription>
                View consultant's availability and blockers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    modifiers={{
                      booked: consultant.availability.blockers.map(b => b.date)
                    }}
                    modifiersStyles={{
                      booked: {
                        backgroundColor: "#fee2e2",
                        color: "#b91c1c"
                      }
                    }}
                  />
                </div>
                <div className="md:w-1/2">
                  <div className="bg-gray-50 p-4 rounded-md h-full">
                    <h3 className="font-medium mb-4">Upcoming Blockers</h3>
                    
                    {consultant.availability.blockers.length > 0 ? (
                      <div className="space-y-3">
                        {consultant.availability.blockers
                          .sort((a, b) => a.date.getTime() - b.date.getTime())
                          .map((blocker, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded border">
                            <div 
                              className={`w-3 h-3 rounded-full ${
                                blocker.type === 'vacation' ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{blocker.label}</p>
                              <p className="text-xs text-gray-500">
                                {blocker.date.toLocaleDateString('en-US', { 
                                  weekday: 'short',
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={
                                blocker.type === 'vacation' 
                                  ? 'bg-blue-50 text-blue-800' 
                                  : 'bg-amber-50 text-amber-800'
                              }
                            >
                              {blocker.type === 'vacation' ? 'Vacation' : 'Personal'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">No upcoming blockers</p>
                    )}
                    
                    <div className="flex justify-center mt-4">
                      <Button size="sm">Add Blocker</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Consultant Preferences</CardTitle>
                <CardDescription>
                  Personal preferences for project assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Preferred Project Types</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {consultant.preferences.projectTypes.map((type) => (
                        <Badge key={type} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Preferred Location</h3>
                    <p className="mt-1">{consultant.preferences.location}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Preferred Industries</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {consultant.preferences.industries.map((industry) => (
                        <Badge key={industry} variant="outline">{industry}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Preferred Roles</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {consultant.preferences.roles.map((role) => (
                        <Badge key={role} variant="outline">{role}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
                <CardDescription>
                  Notes only visible to management
                </CardDescription>
              </CardHeader>
              <CardContent>
                {consultant.notes.length > 0 ? (
                  <div className="space-y-4">
                    {consultant.notes.map((note) => (
                      <div key={note.id} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium">{note.author}</p>
                          <p className="text-xs text-gray-500">{new Date(note.date).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    <p>No notes have been added yet</p>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button size="sm" className="w-full">Add Note</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
