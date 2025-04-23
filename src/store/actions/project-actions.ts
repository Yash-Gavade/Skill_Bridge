
import { Project, Consultant } from "../types/project-interfaces";
import { ProjectPhase, ExecutionPhase, ConsultantStatus, InterviewStatus, NotificationType } from "../types/project-types";

export interface ProjectsState {
  projects: Record<string, Project>;
  consultants: Record<string, Consultant>;
  updateProject: (projectId: string, projectData: Partial<Project>) => void;
  updateConsultant: (consultantId: string, consultantData: Partial<Consultant>) => void;
  addProject: (project: Project) => void;
  assignConsultantsToProject: (projectId: string, consultantIds: string[]) => void;
  advanceProjectPhase: (projectId: string, newPhase: ProjectPhase, executionPhase?: ExecutionPhase) => void;
  toggleConsultantSelection: (projectId: string, consultantId: string) => void;
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
    })
});
