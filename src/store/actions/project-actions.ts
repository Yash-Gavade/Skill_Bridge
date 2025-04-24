import { Message } from "../projectsStore";
import { Consultant, Project } from "../types/project-interfaces";
import { ConsultantStatus, ExecutionPhase, InterviewStatus, MessageType, NotificationType, ProjectPhase } from "../types/project-types";

export interface ProjectsState {
  projects: Record<string, Project>;
  consultants: Record<string, Consultant>;
  messages: Message[];
  updateProject: (projectId: string, projectData: Partial<Project>) => void;
  updateConsultant: (consultantId: string, consultantData: Partial<Consultant>) => void;
  addProject: (project: Project) => void;
  assignConsultantsToProject: (projectId: string, consultantIds: string[]) => void;
  advanceProjectPhase: (projectId: string, newPhase: ProjectPhase, executionPhase?: ExecutionPhase) => void;
  toggleConsultantSelection: (projectId: string, consultantId: string) => void;
  addProjectNote: (projectId: string, content: string) => void;
  sendMeetingInvitations: (projectId: string, consultantIds: string[]) => void;
  markMessageAsRead: (messageId: string) => void;
  markAllMessagesAsRead: () => void;
  deleteMessage: (messageId: string) => void;
  acceptMeetingInvitation: (messageId: string) => void;
  declineMeetingInvitation: (messageId: string) => void;
}

export const createProjectActions = (set: Function) => ({
  updateProject: (projectId: string, projectData: Partial<Project>) => 
    set((state: ProjectsState) => ({
      projects: {
        ...state.projects,
        [projectId]: {
          ...state.projects[projectId],
          ...projectData
        }
      }
    })),

  updateConsultant: (consultantId: string, consultantData: Partial<Consultant>) =>
    set((state: ProjectsState) => ({
      consultants: {
        ...state.consultants,
        [consultantId]: {
          ...state.consultants[consultantId],
          ...consultantData
        }
      }
    })),
    
  addProject: (project: Project) =>
    set((state: ProjectsState) => ({
      projects: {
        ...state.projects,
        [project.id]: project
      }
    })),

  assignConsultantsToProject: (projectId: string, consultantIds: string[]) =>
    set((state: ProjectsState) => {
      const project = state.projects[projectId];
      
      if (!project) return state;
      
      const selectedConsultants = consultantIds.map(id => {
        const consultant = state.consultants[id];
        return {
          ...consultant,
          status: "in_selection" as ConsultantStatus,
          selected: true
        };
      });
      
      const updatedProject = {
        ...project,
        status: "assigned",
        workflowPhase: "internal_interviews" as ProjectPhase,
        matchedConsultants: selectedConsultants,
        progress: 15,
        projectNotifications: [
          {
            id: `pn${Date.now()}`,
            content: "Project submitted for internal interviews",
            timestamp: new Date().toISOString(),
            type: "milestone" as NotificationType
          },
          ...project.projectNotifications
        ]
      };
      
      const updatedConsultants = { ...state.consultants };
      consultantIds.forEach(id => {
        updatedConsultants[id] = {
          ...updatedConsultants[id],
          status: "in_selection",
          interviewStatus: "scheduled" as InterviewStatus
        };
      });
      
      return {
        projects: {
          ...state.projects,
          [projectId]: updatedProject
        },
        consultants: updatedConsultants
      };
    }),

  advanceProjectPhase: (projectId: string, newPhase: ProjectPhase, executionPhase?: ExecutionPhase) =>
    set((state: ProjectsState) => {
      const project = state.projects[projectId];
      if (!project) return state;
      
      let progress = 0;
      switch (newPhase) {
        case "unassigned": progress = 0; break;
        case "internal_interviews": progress = 15; break;
        case "profile_delivery": progress = 35; break;
        case "client_interviews": progress = 65; break;
        case "in_progress": progress = 80; break;
        case "completed": progress = 100; break;
        default: progress = project.progress || 0;
      }
      
      let notificationContent = "";
      switch (newPhase) {
        case "profile_delivery": notificationContent = "Consultant profiles delivered to client"; break;
        case "client_interviews": notificationContent = "Client interviews scheduled"; break;
        case "in_progress": notificationContent = "Project kickoff initiated"; break;
        case "completed": notificationContent = "Project completed successfully"; break;
        default: notificationContent = "Project phase updated";
      }
      
      let updatedConsultants = { ...state.consultants };
      
      if (newPhase === "profile_delivery") {
        const selectedConsultantIds = project.matchedConsultants
          .filter(c => c.selected)
          .map(c => c.id);
          
        Object.keys(updatedConsultants).forEach(id => {
          const consultant = updatedConsultants[id];
          if (
            project.matchedConsultants.some(c => c.id === id) && 
            !selectedConsultantIds.includes(id)
          ) {
            updatedConsultants[id] = {
              ...consultant,
              status: "available",
            };
          }
        });
        
        const updatedMatchedConsultants = project.matchedConsultants.filter(c => c.selected);
        
        const updatedProject = {
          ...project,
          workflowPhase: newPhase,
          executionPhase: project.executionPhase,
          status: "assigned",
          progress,
          matchedConsultants: updatedMatchedConsultants,
          projectNotifications: [
            {
              id: Date.now().toString(),
              content: notificationContent,
              timestamp: new Date().toISOString(),
              type: "phase_change" as NotificationType,
            },
            ...project.projectNotifications,
          ],
        };
        
        return {
          ...state,
          projects: {
            ...state.projects,
            [projectId]: updatedProject,
          },
          consultants: updatedConsultants,
        };
      }
      
      if (newPhase === "in_progress") {
        const selectedConsultantIds = project.matchedConsultants
          .filter(c => c.selected)
          .map(c => c.id);
          
        Object.keys(updatedConsultants).forEach(id => {
          const consultant = updatedConsultants[id];
          if (selectedConsultantIds.includes(id)) {
            updatedConsultants[id] = {
              ...consultant,
              status: "assigned",
            };
          }
        });
        
        const updatedMatchedConsultants = project.matchedConsultants.filter(c => c.selected);
        
        const updatedProject = {
          ...project,
          workflowPhase: newPhase,
          executionPhase: executionPhase || "planning",
          status: "assigned",
          progress,
          matchedConsultants: updatedMatchedConsultants,
          projectNotifications: [
            {
              id: Date.now().toString(),
              content: notificationContent,
              timestamp: new Date().toISOString(),
              type: "phase_change" as NotificationType,
            },
            ...project.projectNotifications,
          ],
        };
        
        return {
          ...state,
          projects: {
            ...state.projects,
            [projectId]: updatedProject,
          },
          consultants: updatedConsultants,
        };
      }
      
      const updatedProject = {
        ...project,
        workflowPhase: newPhase,
        executionPhase: newPhase === "in_progress" ? (executionPhase || "planning") : project.executionPhase,
        status: newPhase === "completed" ? "completed" : (newPhase === "unassigned" ? "unassigned" : "assigned"),
        progress,
        projectNotifications: [
          {
            id: Date.now().toString(),
            content: notificationContent,
            timestamp: new Date().toISOString(),
            type: "phase_change" as NotificationType,
          },
          ...project.projectNotifications,
        ],
      };
      
      return {
        ...state,
        projects: {
          ...state.projects,
          [projectId]: updatedProject,
        },
      };
    }),
  
  toggleConsultantSelection: (projectId: string, consultantId: string) => 
    set((state: ProjectsState) => {
      const project = state.projects[projectId];
      if (!project) return state;
      
      const updatedConsultants = project.matchedConsultants.map(consultant => {
        if (consultant.id === consultantId) {
          return {
            ...consultant,
            selected: !consultant.selected
          };
        }
        return consultant;
      });
      
      return {
        projects: {
          ...state.projects,
          [projectId]: {
            ...project,
            matchedConsultants: updatedConsultants
          }
        }
      };
    }),

  addProjectNote: (projectId: string, content: string) =>
    set((state: ProjectsState) => {
      const project = state.projects[projectId];
      
      if (!project) return state;
      
      const timestamp = new Date().toISOString();
      
      // Create a note that works with the current implementation
      const newNote = {
        id: `note-${Date.now()}`,
        title: "Team Note",
        createdAt: timestamp,
        createdBy: "Project Manager", // This would be the current user in a real app
        author: "Project Manager", // For compatibility with the UI
        date: new Date().toLocaleDateString(), // For compatibility with the UI
        content: content, // For compatibility with the UI
        messages: [
          {
            id: `msg-${Date.now()}`,
            content: content,
            timestamp: timestamp,
            author: "Project Manager"
          }
        ]
      };
      
      const updatedProject = {
        ...project,
        feedbackThreads: [
          newNote,
          ...(project.feedbackThreads || [])
        ],
        projectNotifications: [
          {
            id: `notification-${Date.now()}`,
            content: "New team note added",
            timestamp: timestamp,
            type: "update"
          },
          ...project.projectNotifications
        ]
      };
      
      return {
        ...state,
        projects: {
          ...state.projects,
          [projectId]: updatedProject
        }
      };
    }),

  sendMeetingInvitations: (projectId: string, consultantIds: string[]) =>
    set((state: ProjectsState) => {
      const project = state.projects[projectId];
      
      if (!project) return state;
      
      // Update consultant status
      const updatedConsultants = { ...state.consultants };
      const newMessages: Message[] = [];
      
      consultantIds.forEach(id => {
        const consultant = updatedConsultants[id];
        
        if (consultant) {
          // Update interview status
          updatedConsultants[id] = {
            ...consultant,
            status: "interviewing" as ConsultantStatus,
            interviewStatus: "scheduled" as InterviewStatus,
            interviewDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow
          };
          
          // Create invitation message
          newMessages.push({
            id: `msg-${Date.now()}-${id}`,
            projectId,
            projectName: project.name,
            content: `Interview invitation for "${project.name}" project. Please confirm your availability.`,
            timestamp: new Date().toISOString(),
            type: "meeting_invitation" as MessageType,
            read: false,
            consultantId: id,
            consultantName: consultant.name
          });
        }
      });
      
      // Update project with notifications
      const updatedProject = {
        ...project,
        projectNotifications: [
          {
            id: `notification-${Date.now()}`,
            content: `Interview invitations sent to ${consultantIds.length} consultants: ${consultantIds.map(id => updatedConsultants[id]?.name).join(", ")}`,
            timestamp: new Date().toISOString(),
            type: "milestone" as NotificationType
          },
          ...project.projectNotifications
        ]
      };
      
      return {
        ...state,
        projects: {
          ...state.projects,
          [projectId]: updatedProject
        },
        consultants: updatedConsultants,
        messages: [...newMessages, ...state.messages]
      };
    }),
    
  markMessageAsRead: (messageId: string) =>
    set((state: ProjectsState) => ({
      ...state,
      messages: state.messages.map(message =>
        message.id === messageId ? { ...message, read: true } : message
      )
    })),
    
  markAllMessagesAsRead: () =>
    set((state: ProjectsState) => ({
      ...state,
      messages: state.messages.map(message => ({ ...message, read: true }))
    })),
    
  deleteMessage: (messageId: string) =>
    set((state: ProjectsState) => ({
      ...state,
      messages: state.messages.filter(message => message.id !== messageId)
    })),

  acceptMeetingInvitation: (messageId: string) =>
    set((state: ProjectsState) => {
      const message = state.messages.find(m => m.id === messageId);
      if (!message || message.type !== "meeting_invitation") return state;
      
      const project = state.projects[message.projectId];
      if (!project) return state;
      
      const updatedConsultants = { ...state.consultants };
      if (message.consultantId && updatedConsultants[message.consultantId]) {
        updatedConsultants[message.consultantId] = {
          ...updatedConsultants[message.consultantId],
          status: "interviewing",
          interviewStatus: "scheduled"
        };
      }
      
      // Add a notification to the project about the acceptance
      const updatedProject = {
        ...project,
        projectNotifications: [
          {
            id: `notification-${Date.now()}`,
            content: `${message.consultantName} has accepted the meeting invitation`,
            timestamp: new Date().toISOString(),
            type: "milestone" as NotificationType
          },
          ...project.projectNotifications
        ]
      };
      
      // Mark the message as read
      const updatedMessages = state.messages.map(m => 
        m.id === messageId ? { ...m, read: true } : m
      );
      
      return {
        ...state,
        projects: {
          ...state.projects,
          [message.projectId]: updatedProject
        },
        consultants: updatedConsultants,
        messages: updatedMessages
      };
    }),
    
  declineMeetingInvitation: (messageId: string) =>
    set((state: ProjectsState) => {
      const message = state.messages.find(m => m.id === messageId);
      if (!message || message.type !== "meeting_invitation") return state;
      
      const project = state.projects[message.projectId];
      if (!project) return state;
      
      const updatedConsultants = { ...state.consultants };
      if (message.consultantId && updatedConsultants[message.consultantId]) {
        updatedConsultants[message.consultantId] = {
          ...updatedConsultants[message.consultantId],
          status: "available",
          interviewStatus: "pending"
        };
      }
      
      // Add a notification to the project about the declination
      const updatedProject = {
        ...project,
        projectNotifications: [
          {
            id: `notification-${Date.now()}`,
            content: `${message.consultantName} has declined the meeting invitation`,
            timestamp: new Date().toISOString(),
            type: "alert" as NotificationType
          },
          ...project.projectNotifications
        ]
      };
      
      // Mark the message as read
      const updatedMessages = state.messages.map(m => 
        m.id === messageId ? { ...m, read: true } : m
      );
      
      return {
        ...state,
        projects: {
          ...state.projects,
          [message.projectId]: updatedProject
        },
        consultants: updatedConsultants,
        messages: updatedMessages
      };
    })
});
