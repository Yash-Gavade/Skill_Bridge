import { ConsultantMessage } from "@/components/consultants/ConsultantMessage";
import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    Loader,
    Star,
    User
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

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
          <Avatar className="h-20 w-20 rounded-lg border shadow-sm">
            <AvatarFallback className="bg-primary-50 text-primary-700 text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <h1 className="text-2xl font-bold">{consultant.name}</h1>
              <Badge 
                className={`${statusColors[consultant.status]} w-fit`}
              >
                {statusLabels[consultant.status]}
              </Badge>
            </div>
            
            <p className="text-gray-500 mb-1">{consultant.role}</p>
            <p className="text-gray-500 mb-3 flex items-center gap-1">
              <span className="inline-block h-4 w-4 text-gray-400">
                <User size={16} />
              </span>
              {consultant.location}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {consultant.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="bg-gray-50">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button>Assign to Project</Button>
              <ConsultantMessage 
                consultantId={consultant.id}
                consultantName={consultant.name}
                consultantInitials={initials}
                currentUserId="admin"
                currentUserName="Admin User"
              />
              {consultant.status === 'available' && (
                <Button variant="outline">Schedule Interview</Button>
              )}
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
      
      {/* Content Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="projects">Past Projects</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          {/* AI Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Profile Summary</CardTitle>
                {!aiSummary && !isGeneratingAI && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateAISummary}
                  >
                    <span>Generate AI Summary</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isGeneratingAI ? (
                <div className="flex items-center justify-center py-6">
                  <Loader className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span>Generating AI Summary...</span>
                </div>
              ) : aiSummary ? (
                <p className="text-sm text-gray-600">{aiSummary}</p>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>
                    Generate an AI summary to get a comprehensive overview of this consultant.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <p>{consultant.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                  <p>{consultant.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <p>{consultant.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Current Project</h3>
                  <p>{consultant.currentProject || "Not assigned"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Preferred Project Types</h3>
                <div className="flex flex-wrap gap-1">
                  {consultant.preferences.projectTypes.map((type) => (
                    <Badge key={type} variant="outline" className="bg-gray-50">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Preferred Industries</h3>
                <div className="flex flex-wrap gap-1">
                  {consultant.preferences.industries.map((industry) => (
                    <Badge key={industry} variant="outline" className="bg-gray-50">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Preferred Roles</h3>
                <div className="flex flex-wrap gap-1">
                  {consultant.preferences.roles.map((role) => (
                    <Badge key={role} variant="outline" className="bg-gray-50">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Work Location Preference</h3>
                <Badge variant="outline" className="bg-gray-50">
                  {consultant.preferences.location}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {consultant.pastProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>{project.client}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="fill-current h-4 w-4" />
                        <span className="font-medium">{project.feedback}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Role</h3>
                      <p>{project.role}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                      <p>{project.duration}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Performance</h3>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag) => (
                          <Badge key={tag} className="bg-green-100 text-green-800">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="availability">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Availability Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => {
                      return consultant.availability.blockers.some(
                        (blocker) => blocker.date.toDateString() === date.toDateString()
                      );
                    }}
                  />
                </div>
                <div className="w-full md:w-60 space-y-4">
                  <h3 className="font-medium">Upcoming Unavailability</h3>
                  <div className="space-y-2">
                    {consultant.availability.blockers.map((blocker, index) => (
                      <div key={index} className="p-2 rounded-md border">
                        <p className="text-sm font-medium">{blocker.label}</p>
                        <p className="text-xs text-gray-500">
                          {blocker.date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Notes & Observations</CardTitle>
                <Button variant="outline" size="sm">Add Note</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultant.notes.length === 0 ? (
                  <p className="text-center py-6 text-gray-500">
                    No notes added yet.
                  </p>
                ) : (
                  consultant.notes.map((note) => (
                    <div key={note.id} className="p-4 rounded-md border">
                      <p className="text-sm mb-2">{note.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>By {note.author}</span>
                        <span>{new Date(note.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
