
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Project workflow phases
export type ProjectPhase = 
  | "unassigned"
  | "internal_interviews" 
  | "profile_delivery" 
  | "client_interviews" 
  | "in_progress" 
  | "completed";

// Execution phases (when project is in_progress)
export type ExecutionPhase =
  | "planning"
  | "development"
  | "testing"
  | "deployment"
  | "maintenance"
  | "schema_design"
  | "data_migration"
  | "go_live";

// Interview status types
export type InterviewStatus = 
  | "scheduled"
  | "completed"
  | "pending"
  | "profile_delivered"
  | "interview_scheduled";

// Consultant status types
export type ConsultantStatus = 
  | "available" 
  | "assigned" 
  | "interviewing" 
  | "unavailable"
  | "in_selection"
  | "busy"
  | "leave";

// Define notification types
export type NotificationType = "milestone" | "phase_change" | "alert" | "update" | "client" | "file" | "status";

// Define Client interface
export interface Client {
  name: string;
  logo?: string;
  contact?: string;
  email?: string;
  phone?: string;
}

// Define ProjectFile interface
export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  size?: string;
  date?: string;
}

// Define ProjectPhaseItem interface
export interface ProjectPhaseItem {
  id: string;
  date: string;
  title: string;
  description: string;
}

// Define Notification interface
export interface ProjectNotification {
  id: string;
  content: string;
  timestamp: string;
  type: NotificationType;
}

// Define FeedbackMessage interface
export interface FeedbackMessage {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  authorAvatar?: string;
}

// Define FeedbackThread interface
export interface FeedbackThread {
  id: string;
  title: string;
  createdAt: string;
  createdBy: string;
  messages: FeedbackMessage[];
  author?: string; // Added for compatibility
  date?: string; // Added for compatibility
  content?: string; // Added for compatibility
}

// Define Consultant interface
export interface Consultant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  skills: string[];
  status: ConsultantStatus;
  location: string;
  availableFrom?: string;
  selected?: boolean;
  interviewStatus?: InterviewStatus;
  interviewDate?: string;
  domain?: string;
  level?: string;
  score?: number;
}

// Define Project interface
export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  workflowPhase: ProjectPhase;
  executionPhase?: ExecutionPhase | null;
  skills: string[];
  startDate: string;
  endDate: string;
  client?: Client;
  progress?: number;
  phases?: ProjectPhaseItem[];
  files?: ProjectFile[];
  feedbackThreads?: FeedbackThread[];
  projectNotifications: ProjectNotification[];
  matchedConsultants: Consultant[];
  duration?: string;
  consultantRoles?: ConsultantRole[];
}

// ProjectsState interface for the store
export interface ProjectsState {
  projects: Record<string, Project>;
  consultants: Record<string, Consultant>;
  updateProject: (projectId: string, projectData: Partial<Project>) => void;
  updateConsultant: (consultantId: string, consultantData: Partial<Consultant>) => void;
  addConsultants: (consultants: Consultant[]) => void;
  addProject: (project: Project) => void;
  assignConsultantsToProject: (projectId: string, consultantIds: string[]) => void;
  advanceProjectPhase: (projectId: string, newPhase: ProjectPhase, executionPhase?: ExecutionPhase) => void;
  toggleConsultantSelection: (projectId: string, consultantId: string) => void;
}

// Remove duplicate interface by using the exported one
export interface ConsultantRole {
  title: string;
  count: number ;
}

const initialProjects: Record<string, Project> = {
  
};

const initialConsultants: Record<string, Consultant> = {
  
};

export const useProjectsStore = create<ProjectsState>()(
  devtools(
    (set) => ({
      projects: initialProjects,
      consultants: initialConsultants,

      updateProject: (projectId, projectData) => 
        set((state) => ({
          projects: {
            ...state.projects,
            [projectId]: {
              ...state.projects[projectId],
              ...projectData
            }
          }
        })),
    
      updateConsultant: (consultantId, consultantData) =>
        set((state) => ({
          consultants: {
            ...state.consultants,
            [consultantId]: {
              ...state.consultants[consultantId],
              ...consultantData
            }
          }
        })),
      
      addConsultants: (consultants: Consultant[]) =>
        set((state) => {
          const updatedConsultants = { ...state.consultants };
          
          consultants.forEach(consultant => {
            updatedConsultants[consultant.id] = consultant;
          });
          
          return {
            consultants: {
              ...state.consultants,
              ...updatedConsultants
            }
          };
        }),
        
      addProject: (project) =>
        set((state) => ({
          projects: {
            ...state.projects,
            [project.id]: project
          }
        })),
    
      assignConsultantsToProject: (projectId, consultantIds) =>
        set((state) => {
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
                timestamp: "Just now",
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
    
      advanceProjectPhase: (
        projectId: string,
        newPhase: ProjectPhase,
        executionPhase?: ExecutionPhase
      ) =>
        set((state) => {
          const project = state.projects[projectId];
          if (!project) return state;
          
          let progress = 0;
          switch (newPhase) {
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
            executionPhase: (newPhase as string) === "in_progress" ? (executionPhase || "planning") : project.executionPhase,
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
      
      toggleConsultantSelection: (projectId, consultantId) => 
        set((state) => {
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
        })
    }),
    {
      name: "projects-store"
    }
  )
);
