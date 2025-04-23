
export type ProjectPhase = 
  | "unassigned"
  | "internal_interviews" 
  | "profile_delivery" 
  | "client_interviews" 
  | "in_progress" 
  | "completed";

export type ExecutionPhase =
  | "planning"
  | "development"
  | "testing"
  | "deployment"
  | "maintenance"
  | "schema_design"
  | "data_migration"
  | "go_live";

export type InterviewStatus = 
  | "scheduled"
  | "completed"
  | "pending"
  | "profile_delivered"
  | "interview_scheduled";

export type ConsultantStatus = 
  | "available" 
  | "assigned" 
  | "interviewing" 
  | "unavailable"
  | "in_selection"
  | "busy"
  | "leave";

export type NotificationType = "milestone" | "phase_change" | "alert" | "update" | "client" | "file" | "status";

