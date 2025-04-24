import { ConsultantDetails } from "@/components/consultants/ConsultantDetails";
import { MessageButton } from "@/components/consultants/MessageButton";
import { AssignToProjectModal } from "@/components/modals/AssignToProjectModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useProjectsStore } from "@/store/projectsStore";
import {
    BarChart,
    Briefcase,
    Calendar,
    Download,
    FileText,
    MessageSquare,
    Star,
    Upload
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

// Sample consultant data with complete profile information
const consultantData = {
  "c1": {
    id: "c1",
    name: "John Smith",
    role: "Business Analyst",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    skills: ["Requirements Gathering", "Stakeholder Liaison", "Documentation"],
    status: "assigned",
    location: "New York, USA",
    rating: 4.8,
    experience: "5+ years",
    projectsCompleted: 12,
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    expertise: ["Business Process Modeling", "Use Case Analysis", "Agile Methodologies"],
    pastProjects: [
      {
        id: "pp1",
        name: "ERP Implementation",
        client: "Global Manufacturing Inc.",
        duration: "Jan 2023 - Mar 2023",
        role: "Lead Business Analyst",
        description: "Led requirements gathering and stakeholder workshops for the implementation of a new ERP system.",
        feedback: 4.9,
        skills: ["Requirements Gathering", "Stakeholder Management", "Documentation"]
      },
      {
        id: "pp2",
        name: "CRM Integration",
        client: "Financial Services Ltd.",
        duration: "Aug 2022 - Dec 2022",
        role: "Business Analyst",
        description: "Analyzed business processes and documented requirements for CRM integration with existing systems.",
        feedback: 4.7,
        skills: ["Process Analysis", "Documentation", "Integration Planning"]
      }
    ],
    availability: {
      current: {
        project: "Website Redesign Project",
        client: "Acme Corp",
        role: "Business Analyst",
        endDate: "June 30, 2023"
      },
      blockedDates: [
        { date: "2023-07-15", reason: "Vacation" },
        { date: "2023-07-16", reason: "Vacation" },
        { date: "2023-07-17", reason: "Vacation" }
      ]
    },
    documents: [
      { name: "John Smith CV.pdf", type: "CV", date: "2023-01-10" },
      { name: "Portfolio.pdf", type: "Portfolio", date: "2023-01-15" },
      { name: "Skills Assessment.pdf", type: "Assessment", date: "2023-02-01" }
    ],
    summary: "John is an experienced Business Analyst with a strong background in requirements gathering and documentation. He has consistently received positive feedback for his ability to liaise between technical and business stakeholders. John excels in complex projects requiring detailed analysis and clear documentation."
  }
};

// Extended consultant interface that includes all profile details
interface ExtendedConsultant {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  avatarUrl?: string;
  skills: string[];
  status: string;
  location: string;
  rating?: number;
  experience?: string;
  projectsCompleted?: number;
  expertise?: string[];
  pastProjects?: any[];
  availability?: {
    current?: {
      project: string;
      client: string;
      role: string;
      endDate: string;
    };
    blockedDates?: {
      date: string;
      reason: string;
    }[];
  };
  documents?: {
    name: string;
    type: string;
    date: string;
  }[];
  summary?: string;
  feedbackHistory?: Array<{
    id: string;
    date: string;
    rating: number;
    feedback: string;
    project: string;
    submittedBy: string;
    category: string;
  }>;
}

export default function ConsultantView() {
  const { consultantId = "c1" } = useParams();
  const { consultants } = useProjectsStore();
  const [completeConsultant, setCompleteConsultant] = useState<ExtendedConsultant | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [feedbackProject, setFeedbackProject] = useState<string>("");
  const [feedbackCategory, setFeedbackCategory] = useState<string>("general");
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>("");
  
  useEffect(() => {
    // Get the consultant from the store
    const storeConsultant = consultants[consultantId];
    // Get the sample data
    const sampleConsultant = consultantData[consultantId as keyof typeof consultantData];
    
    // Create a merged consultant with fallbacks to the sample data
    const mergedConsultant: ExtendedConsultant = {
      // Start with store data
      ...(storeConsultant || {}),
      // Include sample data as fallback
      ...(sampleConsultant || {}),
      // Ensure the basic required fields are present
      id: storeConsultant?.id || sampleConsultant?.id || consultantId,
      name: storeConsultant?.name || sampleConsultant?.name || "Unknown Consultant",
      role: storeConsultant?.role || sampleConsultant?.role || "Consultant",
      email: sampleConsultant?.email || "email@example.com",
      phone: sampleConsultant?.phone || "+1 (555) 123-4567",
      skills: storeConsultant?.skills || sampleConsultant?.skills || [],
      status: storeConsultant?.status || sampleConsultant?.status || "unknown",
      location: storeConsultant?.location || sampleConsultant?.location || "Unknown Location",
      // Default avatar if none exists
      avatarUrl: storeConsultant?.avatarUrl || sampleConsultant?.avatarUrl || `https://i.pravatar.cc/150?img=${parseInt(consultantId.replace(/\D/g, '')) || 1}`
    };
    
    setCompleteConsultant(mergedConsultant);
  }, [consultantId, consultants]);
  
  // Function to handle feedback submission
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackText || !feedbackProject) {
      toast.error("Please complete all required fields");
      return;
    }
    
    const newFeedback = {
      id: `feedback-${Date.now()}`,
      date: new Date().toISOString(),
      rating: feedbackRating,
      feedback: feedbackText,
      project: feedbackProject,
      submittedBy: "Current Manager", // This would come from the logged-in user
      category: feedbackCategory
    };
    
    // In a real app, this would be an API call to save the feedback
    
    // Update the local state
    if (completeConsultant) {
      const updatedConsultant = {
        ...completeConsultant,
        feedbackHistory: [
          ...(completeConsultant.feedbackHistory || []),
          newFeedback
        ],
        // Update the overall rating
        rating: calculateNewRating(completeConsultant, feedbackRating)
      };
      
      setCompleteConsultant(updatedConsultant);
      
      // Reset form
      setFeedbackRating(5);
      setFeedbackText("");
      setFeedbackProject("");
      setFeedbackCategory("general");
      
      toast.success("Feedback submitted successfully", { duration: 1000 });
    }
  };
  
  // Function to calculate new average rating
  const calculateNewRating = (consultant: ExtendedConsultant, newRating: number): number => {
    const existingFeedbackCount = consultant.feedbackHistory?.length || 0;
    const currentRating = consultant.rating || 5;
    
    // Calculate the new average rating
    const totalRatingPoints = currentRating * existingFeedbackCount + newRating;
    const newAverageRating = totalRatingPoints / (existingFeedbackCount + 1);
    
    return parseFloat(newAverageRating.toFixed(1));
  };

  // Function to handle avatar update
  const handleAvatarUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAvatarUrl) {
      toast.error("Please enter a valid avatar URL");
      return;
    }
    
    if (completeConsultant) {
      const updatedConsultant = {
        ...completeConsultant,
        avatarUrl: newAvatarUrl
      };
      
      setCompleteConsultant(updatedConsultant);
      setNewAvatarUrl("");
      
      toast.success("Profile photo updated successfully", { duration: 1000 });
    }
  };

  // Function to generate a random avatar
  const generateRandomAvatar = () => {
    const randomNum = Math.floor(Math.random() * 70) + 1;
    const newUrl = `https://i.pravatar.cc/150?img=${randomNum}`;
    
    if (completeConsultant) {
      const updatedConsultant = {
        ...completeConsultant,
        avatarUrl: newUrl
      };
      
      setCompleteConsultant(updatedConsultant);
      toast.success("Profile photo updated successfully", { duration: 1000 });
    }
  };
  
  if (!completeConsultant) {
    return <div className="flex items-center justify-center h-full">Loading consultant profile...</div>;
  }
  
  const initials = completeConsultant.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
    
  const isAvailableForAssignment = completeConsultant.status === "available" || 
                                  completeConsultant.status === "in_selection" || 
                                  completeConsultant.status === "interviewing";
    
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Left sidebar */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={completeConsultant.avatarUrl} alt={completeConsultant.name} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <h2 className="text-xl font-bold">{completeConsultant.name}</h2>
                  <p className="text-gray-500">{completeConsultant.role}</p>
                </div>
                
                <form onSubmit={handleAvatarUpdate} className="w-full space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Update Profile Photo</Label>
                    <div className="flex gap-2">
                      <Input
                        id="avatarUrl"
                        placeholder="Enter avatar URL"
                        value={newAvatarUrl}
                        onChange={(e) => setNewAvatarUrl(e.target.value)}
                      />
                      <Button type="submit" size="icon" variant="outline">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={generateRandomAvatar}
                >
                  Generate Random Avatar
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <ConsultantDetails consultant={completeConsultant} />
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <MessageButton 
                  consultantId={completeConsultant.id}
                  consultantName={completeConsultant.name}
                  consultantInitials={initials}
                  variant="default"
                />
                <Button 
                  variant="outline"
                  onClick={() => setAssignModalOpen(true)}
                  disabled={!isAvailableForAssignment}
                  title={!isAvailableForAssignment ? "This consultant is not available for assignment" : ""}
                >
                  Assign to Project
                </Button>
              </div>
            </div>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Summary Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{completeConsultant.summary || "No summary available."}</p>
                </CardContent>
              </Card>
              
              {/* Expertise Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(completeConsultant.expertise || []).map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-gray-50 text-sm">
                        {skill}
                      </Badge>
                    ))}
                    {(!completeConsultant.expertise || completeConsultant.expertise.length === 0) && (
                      <p className="text-sm text-gray-500">No expertise listed.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-4 border rounded-md">
                      <div className="p-2 bg-primary-50 rounded-md">
                        <Briefcase className="h-5 w-5 text-primary-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Projects</p>
                        <p className="text-xl font-semibold">{completeConsultant.projectsCompleted || "0"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 border rounded-md">
                      <div className="p-2 bg-amber-50 rounded-md">
                        <Star className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="text-xl font-semibold">{completeConsultant.rating || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 border rounded-md">
                      <div className="p-2 bg-blue-50 rounded-md">
                        <Calendar className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="text-xl font-semibold">{completeConsultant.experience || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 border rounded-md">
                      <div className="p-2 bg-green-50 rounded-md">
                        <BarChart className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Success Rate</p>
                        <p className="text-xl font-semibold">98%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              {completeConsultant.availability?.current && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Current Project</CardTitle>
                    <CardDescription>Assigned until {completeConsultant.availability.current.endDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">{completeConsultant.availability.current.project}</h3>
                        <p className="text-sm text-gray-500">{completeConsultant.availability.current.client}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Role</h4>
                        <p>{completeConsultant.availability.current.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <h3 className="font-medium mt-6">Past Projects</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(completeConsultant.pastProjects || []).map((project) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{project.name}</CardTitle>
                          <CardDescription>{project.client}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="font-medium">{project.feedback}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Role</h4>
                        <p>{project.role}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                        <p>{project.duration}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Description</h4>
                        <p className="text-sm">{project.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Skills Applied</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="bg-gray-50 text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(!completeConsultant.pastProjects || completeConsultant.pastProjects.length === 0) && (
                  <p className="text-sm text-gray-500 col-span-2">No past projects available.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="availability">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Availability</CardTitle>
                  <CardDescription>
                    {completeConsultant.status === "available" 
                      ? "Available for new projects" 
                      : `Assigned until ${completeConsultant.availability?.current?.endDate || "N/A"}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Upcoming Unavailability</h3>
                    {completeConsultant.availability?.blockedDates?.length > 0 ? (
                      <div className="space-y-2">
                        {completeConsultant.availability.blockedDates.map((block, index) => (
                          <div key={index} className="flex justify-between p-2 border rounded-md">
                            <span>{new Date(block.date).toLocaleDateString()}</span>
                            <Badge variant="outline">{block.reason}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No unavailable dates scheduled</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(completeConsultant.documents || []).map((doc, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.type} • {new Date(doc.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    ))}
                    {(!completeConsultant.documents || completeConsultant.documents.length === 0) && (
                      <p className="text-sm text-gray-500">No documents available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="feedback">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feedback Form */}
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Experience Rating & Feedback</CardTitle>
                      <CardDescription>
                        Provide feedback and performance rating for this consultant
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="rating">Rating</Label>
                          <div className="flex items-center gap-2">
                            <Select
                              value={feedbackRating.toString()}
                              onValueChange={(value) => setFeedbackRating(Number(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Poor</SelectItem>
                                <SelectItem value="2">2 - Below Average</SelectItem>
                                <SelectItem value="3">3 - Average</SelectItem>
                                <SelectItem value="4">4 - Good</SelectItem>
                                <SelectItem value="5">5 - Excellent</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${star <= feedbackRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="project">Project</Label>
                          <Input
                            id="project"
                            placeholder="Project name"
                            value={feedbackProject}
                            onChange={(e) => setFeedbackProject(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="category">Feedback Category</Label>
                          <Select
                            value={feedbackCategory}
                            onValueChange={setFeedbackCategory}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Performance</SelectItem>
                              <SelectItem value="technical">Technical Skills</SelectItem>
                              <SelectItem value="communication">Communication</SelectItem>
                              <SelectItem value="teamwork">Teamwork</SelectItem>
                              <SelectItem value="leadership">Leadership</SelectItem>
                              <SelectItem value="problem-solving">Problem Solving</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="feedback">Detailed Feedback</Label>
                          <Textarea
                            id="feedback"
                            placeholder="Provide detailed feedback about the consultant's performance"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            rows={5}
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="w-full">
                          Submit Feedback
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Feedback History */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Feedback History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {completeConsultant.feedbackHistory && completeConsultant.feedbackHistory.length > 0 ? (
                          completeConsultant.feedbackHistory.map((feedback) => (
                            <div key={feedback.id} className="border rounded-md p-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <Badge variant="outline" className="mb-1">
                                    {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
                                  </Badge>
                                  <h3 className="font-medium">{feedback.project}</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                  <span className="font-medium">{feedback.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">{feedback.feedback}</p>
                              <div className="text-xs text-gray-500 flex justify-between items-center pt-2">
                                <span>By: {feedback.submittedBy}</span>
                                <span>{new Date(feedback.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                            <MessageSquare className="h-12 w-12 mb-2 text-gray-300" />
                            <p>No feedback records yet</p>
                            <p className="text-sm">Feedback you provide will appear here</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <AssignToProjectModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        consultantId={completeConsultant.id}
        consultantName={completeConsultant.name}
      />
    </div>
  );
} 