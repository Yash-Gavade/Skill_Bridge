import { ConsultantCard } from "@/components/consultants/ConsultantCard";
import { LeaveNoteModal } from "@/components/modals/LeaveNoteModal";
import { ProjectAssignedConsultants } from "@/components/projects/ProjectAssignedConsultants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectPhase, useProjectsStore } from "@/store/projectsStore";
import { Check, CheckCircle2, Clock, FileText, Mail, MessageSquare, Pause, Star, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeNotificationFilter, setActiveNotificationFilter] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [leaveNoteModalOpen, setLeaveNoteModalOpen] = useState(false);
  const [invitationsSent, setInvitationsSent] = useState(false);
  
  const { projects, advanceProjectPhase, toggleConsultantSelection, sendMeetingInvitations } = useProjectsStore();
  
  const project = projectId ? projects[projectId] : null;

  if (!project) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <p className="mt-2">The project you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const safeProject = {
    ...project,
    files: project.files || [],
    feedbackThreads: project.feedbackThreads || [],
    projectNotifications: project.projectNotifications || [],
    matchedConsultants: project.matchedConsultants || [],
    progress: project.progress || 0
  };

  const statusColors: Record<string, string> = {
    "unassigned": "bg-amber-100 text-amber-800",
    "internal_interviews": "bg-blue-100 text-blue-800",
    "profile_delivery": "bg-purple-100 text-purple-800",
    "client_interviews": "bg-indigo-100 text-indigo-800",
    "in_progress": "bg-green-100 text-green-800",
    "paused": "bg-gray-100 text-gray-800",
    "completed": "bg-slate-100 text-slate-800"
  };

  const statusLabels: Record<string, string> = {
    "unassigned": "Unassigned",
    "internal_interviews": "Internal Interviews",
    "profile_delivery": "Profiles Delivered / Awaiting Interviews",
    "client_interviews": "Client Interviews",
    "in_progress": "In Progress",
    "paused": "Paused",
    "completed": "Completed"
  };

  const statusIcons: Record<string, any> = {
    "in_progress": <Clock className="h-4 w-4" />,
    "paused": <Pause className="h-4 w-4" />,
    "completed": <Check className="h-4 w-4" />
  };

  const handleAdvanceToProfileDelivery = () => {
    const selectedConsultants = project.matchedConsultants.filter(c => c.selected);
    
    if (selectedConsultants.length === 0) {
      toast.error("Please select at least one consultant to proceed");
      return;
    }
    
    advanceProjectPhase(project.id, "profile_delivery");
    toast.success("Project advanced to Profiles Delivered / Awaiting Interviews phase");
  };

  const handleStartClientInterviews = () => {
    advanceProjectPhase(project.id, "client_interviews");
    toast.success("Client interviews initiated");
  };

  const handleStartProject = () => {
    const selectedConsultants = project.matchedConsultants.filter(c => c.selected);
    
    if (selectedConsultants.length === 0) {
      toast.error("Please select at least one consultant to proceed");
      return;
    }
    
    advanceProjectPhase(project.id, "in_progress", "planning");
    toast.success("Project started successfully");
  };

  const handleCompleteProject = () => {
    advanceProjectPhase(project.id, "completed");
    toast.success("Project marked as complete");
  };

  const getPhaseProgress = () => {
    const phaseMap = {
      "unassigned": 0,
      "internal_interviews": 20,
      "profile_delivery": 40,
      "client_interviews": 60,
      "in_progress": 80,
      "completed": 100
    };
    
    return phaseMap[project.workflowPhase] || 0;
  };

  const handleConsultantSelection = (consultantId: string) => {
    if (projectId) {
      toggleConsultantSelection(projectId, consultantId);
    }
  };

  const filteredNotifications = activeNotificationFilter
    ? safeProject.projectNotifications.filter(notification => notification.type === activeNotificationFilter)
    : safeProject.projectNotifications;

  const getPhaseTimelines = () => {
    const phaseTimelines = {
      "unassigned": "Not started yet",
      "internal_interviews": project.projectNotifications.find(
        n => n.content.includes("internal interviews")
      )?.timestamp ? new Date(
        project.projectNotifications.find(
          n => n.content.includes("internal interviews")
        )?.timestamp || ""
      ).toLocaleDateString() : "Not started yet",
      "profile_delivery": project.projectNotifications.find(
        n => n.content.includes("Profile delivery")
      )?.timestamp ? new Date(
        project.projectNotifications.find(
          n => n.content.includes("Profile delivery")
        )?.timestamp || ""
      ).toLocaleDateString() : "Not started yet",
      "client_interviews": project.projectNotifications.find(
        n => n.content.includes("Client interviews")
      )?.timestamp ? new Date(
        project.projectNotifications.find(
          n => n.content.includes("Client interviews")
        )?.timestamp || ""
      ).toLocaleDateString() : "Not started yet",
      "in_progress": project.projectNotifications.find(
        n => n.content.includes("Project execution")
      )?.timestamp ? new Date(
        project.projectNotifications.find(
          n => n.content.includes("Project execution")
        )?.timestamp || ""
      ).toLocaleDateString() : "Not started yet",
      "completed": project.projectNotifications.find(
        n => n.content.includes("Project completed")
      )?.timestamp ? new Date(
        project.projectNotifications.find(
          n => n.content.includes("Project completed")
        )?.timestamp || ""
      ).toLocaleDateString() : "Not started yet"
    };
    
    return phaseTimelines;
  };

  const handleSendInvitations = () => {
    if (!projectId) return;
    
    const selectedConsultants = project.matchedConsultants.filter(c => c.selected);
    
    if (selectedConsultants.length === 0) {
      toast.error("Please select at least one consultant to send invitations");
      return;
    }
    
    const consultantIds = selectedConsultants.map(c => c.id);
    sendMeetingInvitations(projectId, consultantIds);
    setInvitationsSent(true);
    
    // Show a more detailed toast notification
    toast.success(`Invitations sent successfully`, {
      description: (
        <div className="text-sm">
          <p>Sent to: {selectedConsultants.map(c => c.name).join(", ")}</p>
          <p className="mt-1">Consultants will be notified to confirm their availability.</p>
        </div>
      ),
      duration: 5000
    });
  };

  const renderPhaseContent = () => {
    switch (project.workflowPhase) {
      case "unassigned":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Assign Consultants</h2>
                <p className="text-gray-700 mb-4">Match consultants to this project based on skills and availability.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {project.matchedConsultants.map((consultant) => (
                    <ConsultantCard key={consultant.id} consultant={consultant} />
                  ))}
                  {project.matchedConsultants.length === 0 && (
                    <div className="col-span-full p-6 text-center border rounded-lg bg-gray-50">
                      <p className="text-gray-500">No consultants matched yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "internal_interviews":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Internal Interviews</h2>
                <p className="text-gray-700 mb-4">
                  Selected consultants are being evaluated for their fit with this project. 
                  Select the consultants you want to proceed to the profile delivery phase.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {project.matchedConsultants.map((consultant) => (
                    <div key={consultant.id} className="relative">
                      <ConsultantCard 
                        consultant={consultant} 
                        selectable
                        onSelect={handleConsultantSelection}
                      />
                      <Badge 
                        className={`absolute top-2 right-2 ${
                          consultant.interviewStatus === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : consultant.interviewStatus === 'scheduled' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {consultant.interviewStatus === 'completed' 
                          ? 'Interview Completed' 
                          : consultant.interviewStatus === 'scheduled' 
                            ? 'Interview Scheduled'
                            : 'Pending Interview'}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between">
                  <div className="flex gap-2">
                    <span className="text-sm font-medium self-center">
                      {project.matchedConsultants.filter(c => c.selected).length} consultants selected
                    </span>
                    <Button 
                      variant="outline"
                      className="gap-2"
                      onClick={handleSendInvitations}
                      disabled={invitationsSent || project.matchedConsultants.filter(c => c.selected).length === 0}
                    >
                      <Mail size={16} />
                      {invitationsSent ? "Invitations Sent" : "Invite to Meeting"}
                    </Button>
                  </div>
                  <Button onClick={handleAdvanceToProfileDelivery}>
                    Proceed to Profile Delivery
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "profile_delivery":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Profiles Delivered / Awaiting Interviews</h2>
                  <Badge className="bg-purple-100 text-purple-800">
                    Awaiting Client Response
                  </Badge>
                </div>
                
                <p className="text-gray-700 mb-4">
                  Consultant profiles have been delivered to the client. Select which consultants will proceed to the project.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {project.matchedConsultants.map((consultant) => (
                    <div key={consultant.id} className="relative">
                      <ConsultantCard 
                        consultant={consultant} 
                        selectable
                        onSelect={handleConsultantSelection}
                      />
                      <Badge className="absolute top-2 right-2 bg-purple-100 text-purple-800">
                        Profile Delivered
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between">
                  <div>
                    <span className="text-sm font-medium">
                      {project.matchedConsultants.filter(c => c.selected).length} consultants selected
                    </span>
                  </div>
                  <Button onClick={handleStartProject}>
                    Start Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "client_interviews":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Client Interviews</h2>
                <p className="text-gray-700 mb-4">
                  The client is interviewing selected consultants before making final decisions.
                  Select which consultants will proceed to the project.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {project.matchedConsultants.map((consultant) => (
                    <div key={consultant.id} className="relative">
                      <ConsultantCard 
                        consultant={consultant} 
                        selectable
                        onSelect={handleConsultantSelection} 
                      />
                      <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                        <Badge className="bg-indigo-100 text-indigo-800">
                          Interview Scheduled
                        </Badge>
                        {consultant.interviewDate && (
                          <Badge variant="outline" className="bg-white text-xs">
                            {consultant.interviewDate}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between">
                  <div>
                    <span className="text-sm font-medium">
                      {project.matchedConsultants.filter(c => c.selected).length} consultants selected
                    </span>
                  </div>
                  <Button onClick={handleStartProject}>
                    Start Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "in_progress":
        return renderExecutionPhaseContent();
        
      case "completed":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Project Completed</h2>
                <p className="text-gray-700 mb-4">
                  This project has been successfully completed. Client feedback has been collected.
                </p>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Client Feedback</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-5 w-5 ${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">4.0/5.0</span>
                  </div>
                  <p className="text-sm italic">
                    "The team did an excellent job delivering this project. 
                    Communication was great, and the quality of work exceeded our expectations."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderExecutionPhaseContent = () => {
    if (project.workflowPhase !== "in_progress" || !project.executionPhase) {
      return null;
    }

    switch (project.executionPhase) {
      case "planning":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Planning Phase</h2>
                <p className="text-gray-700 mb-4">
                  Define project scope, requirements, and timeline.
                </p>
                
                <div className="border border-dashed rounded-md p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium">Upload Planning Documents</p>
                  <p className="text-xs text-gray-500">Drag & drop or click to upload scope documents, requirements, etc.</p>
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button onClick={() => advanceProjectPhase(project.id, "in_progress", "schema_design")}>
                    Proceed to Schema Design
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "schema_design":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Schema Design</h2>
                <p className="text-gray-700 mb-4">
                  Design database schemas and architecture for the project.
                </p>
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Uploaded Schemas</h4>
                  <div className="space-y-2">
                    {project.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{file.date}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 border border-dashed rounded-md p-4 text-center">
                    <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                    <p className="text-xs">Upload more schema files</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button onClick={() => advanceProjectPhase(project.id, "in_progress", "data_migration")}>
                    Proceed to Data Migration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "data_migration":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Data Migration</h2>
                <p className="text-gray-700 mb-4">
                  Migrate data from legacy systems to the new architecture.
                </p>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Migration Progress</h4>
                    <span className="text-sm text-gray-500">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Migration Reports</h4>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Initial Migration Report</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Phase 2 Migration Report</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 border border-dashed rounded-md p-4 text-center">
                    <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                    <p className="text-xs">Upload migration report</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button onClick={() => advanceProjectPhase(project.id, "in_progress", "testing")}>
                    Proceed to Testing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "testing":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Testing</h2>
                <p className="text-gray-700 mb-4">
                  Validate the migration and perform quality assurance tests.
                </p>
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Test Checklist</h4>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Schema validation tests</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Data integrity tests</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <div className="h-4 w-4 border rounded-full mr-2"></div>
                      <span className="text-sm">Performance tests</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <div className="h-4 w-4 border rounded-full mr-2"></div>
                      <span className="text-sm">User acceptance tests</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 border border-dashed rounded-md p-4 text-center">
                    <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                    <p className="text-xs">Upload test report</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button onClick={() => advanceProjectPhase(project.id, "in_progress", "go_live")}>
                    Proceed to Go Live
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "go_live":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Go Live</h2>
                <p className="text-gray-700 mb-4">
                  Final deployment and project completion steps.
                </p>
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Final Checklist</h4>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Deployment plan approved</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Backup systems in place</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Stakeholder sign-off received</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <div className="h-4 w-4 border rounded-full mr-2"></div>
                      <span className="text-sm">Final deployment completed</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleCompleteProject}>
                    Mark Project Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
              {project.client?.logo ? (
                <img 
                  src={project.client.logo} 
                  alt={project.client.name}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <span className="text-lg font-bold">
                  {project.client?.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-500">{project.client?.name}</span>
                <Badge className={statusColors[project.workflowPhase]}>
                  <div className="flex items-center gap-1">
                    {statusIcons[project.workflowPhase]}
                    <span>{statusLabels[project.workflowPhase]}</span>
                  </div>
                </Badge>
              </div>
            </div>
          </div>
          {project.workflowPhase === "in_progress" && (
            <Button variant="outline">Update Status</Button>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Project Progress</h3>
            <span className="text-sm text-gray-500">{getPhaseProgress()}% Complete</span>
          </div>
          <Progress value={getPhaseProgress()} className="h-2" />
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-1 items-center justify-between">
              {["unassigned", "internal_interviews", "profile_delivery", "client_interviews", "in_progress", "completed"].map((phase, index) => {
                const phaseKey = phase as ProjectPhase;
                const isActive = 
                  index === 0 ? true : 
                  ["internal_interviews", "profile_delivery", "client_interviews", "in_progress", "completed"].includes(project.workflowPhase) && index === 1 ? true :
                  ["profile_delivery", "client_interviews", "in_progress", "completed"].includes(project.workflowPhase) && index === 2 ? true :
                  ["client_interviews", "in_progress", "completed"].includes(project.workflowPhase) && index === 3 ? true :
                  ["in_progress", "completed"].includes(project.workflowPhase) && index === 4 ? true :
                  project.workflowPhase === "completed" && index === 5;
                
                const phaseLabels = {
                  "unassigned": "Selection",
                  "internal_interviews": "Internal Interviews",
                  "profile_delivery": "Profile Delivery",
                  "client_interviews": "Client Interviews",
                  "in_progress": "Execution",
                  "completed": "Completed"
                };
                
                const phaseTimelines = getPhaseTimelines();
                
                return (
                  <div key={phase} className={`flex flex-col items-center`}>
                    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-primary' : 'bg-gray-200'}`} />
                    <span className="text-xs mt-1 text-gray-600">{phaseLabels[phaseKey]}</span>
                    <span className="text-[10px] mt-0.5 text-gray-500">{phaseTimelines[phaseKey]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {renderPhaseContent()}

      {(safeProject.workflowPhase === "in_progress" || safeProject.workflowPhase === "completed") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Project Overview</h2>
                <p className="text-gray-700">{safeProject.description}</p>
                
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-2">Client Contact</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Contact Person</p>
                        <p className="font-medium">{safeProject.client?.contact || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{safeProject.client?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{safeProject.client?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-md font-medium">Timeline</h3>
                    <span className="text-sm text-gray-500">
                      {safeProject.startDate} — {safeProject.endDate}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${safeProject.progress}%` }} 
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-2">Attached Files</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {safeProject.files.map((file, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{file.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="uppercase">{file.type}</span>
                            <span>•</span>
                            <span>{file.size}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {safeProject.files.length === 0 && (
                      <div className="col-span-full border border-dashed rounded-md p-4 text-center">
                        <FileText className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No files attached yet</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Upload File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">Team & Collaboration</h2>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Assigned Consultants</h3>
                  <ProjectAssignedConsultants projectId={projectId} />
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-medium">Team Feedback</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs gap-2"
                      onClick={() => setLeaveNoteModalOpen(true)}
                    >
                      <MessageSquare className="h-3 w-3" />
                      Leave Note
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {safeProject.feedbackThreads && safeProject.feedbackThreads.map(thread => (
                      <div key={thread.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {thread.author ? thread.author.split(' ').map(n => n[0]).join('') : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{thread.author || 'Unknown'}</span>
                            <span className="text-xs text-gray-500">{thread.date || 'N/A'}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{thread.content || ''}</p>
                        </div>
                      </div>
                    ))}
                    
                    {(!safeProject.feedbackThreads || safeProject.feedbackThreads.length === 0) && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No feedback yet. Be the first to leave a note.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <div className="flex gap-1">
                    <Button 
                      variant={activeNotificationFilter === null ? "secondary" : "outline"} 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setActiveNotificationFilter(null)}
                    >
                      All
                    </Button>
                    <Button 
                      variant={activeNotificationFilter === "milestone" ? "secondary" : "outline"} 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setActiveNotificationFilter("milestone")}
                    >
                      Milestones
                    </Button>
                    <Button 
                      variant={activeNotificationFilter === "client" ? "secondary" : "outline"} 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setActiveNotificationFilter("client")}
                    >
                      Client
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4 max-h-48 overflow-y-auto">
                  {filteredNotifications.map(notification => (
                    <div key={notification.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {notification.type === 'milestone' && <Check className="h-4 w-4 text-green-500" />}
                        {notification.type === 'client' && <Star className="h-4 w-4 text-amber-500" />}
                        {notification.type === 'file' && <FileText className="h-4 w-4 text-blue-500" />}
                        {notification.type === 'status' && <Clock className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.content}</p>
                        <p className="text-xs text-gray-500">{notification.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  
                  {filteredNotifications.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No notifications to display
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <LeaveNoteModal
        open={leaveNoteModalOpen}
        onOpenChange={setLeaveNoteModalOpen}
        projectId={projectId || ""}
      />
    </div>
  );
}
