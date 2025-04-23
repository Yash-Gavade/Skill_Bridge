
import { ConsultantStatus, ExecutionPhase, InterviewStatus, NotificationType, ProjectPhase } from "./project-types";

export interface Client {
  name: string;
  logo?: string;
  contact?: string;
  email?: string;
  phone?: string;
}

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

export interface ProjectPhaseItem {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface ProjectNotification {
  id: string;
  content: string;
  timestamp: string;
  type: NotificationType;
}

export interface FeedbackMessage {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  authorAvatar?: string;
}

export interface FeedbackThread {
  id: string;
  title: string;
  createdAt: string;
  createdBy: string;
  messages: FeedbackMessage[];
  author?: string;
  date?: string;
  content?: string;
}

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
}

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

export interface ConsultantRole {
  title: string;
  count: string;
}
