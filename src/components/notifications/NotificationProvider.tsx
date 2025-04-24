import React, { createContext, useContext, useState } from "react";
import { ConsultantAvailableDialog } from "./ConsultantAvailableDialog";
import { EcommerceMigrationDialog } from "./EcommerceMigrationDialog";
import { HealthcareInterviewDialog } from "./HealthcareInterviewDialog";
import { MisconductNotificationDialog } from "./MisconductNotificationDialog";
import { ProjectMilestoneDialog } from "./ProjectMilestoneDialog";

interface NotificationContextType {
  openMisconductNotification: (props: {
    project: string;
    employee?: string;
    issueType?: string;
    createdAt?: string;
    description?: string;
  }) => void;
  
  openConsultantNotification: (props: {
    consultantName: string;
    consultantRole?: string;
    skills?: string[];
    availableFrom?: string;
    hoursPerWeek?: number;
  }) => void;
  
  openMilestoneNotification: (props: {
    projectName: string;
    milestoneTitle?: string;
    completion?: number;
    completedAt?: string;
    dueDate?: string;
    teamMembers?: number;
    nextMilestone?: string;
  }) => void;
  
  openHealthcareInterviewNotification: (props: {
    interviewDate?: string;
    interviewTime?: string;
    location?: string;
    interviewers?: string[];
    interviewType?: "technical" | "behavioral" | "initial" | "final";
    duration?: string;
  }) => void;
  
  openEcommerceMigrationNotification: (props: {
    projectName?: string;
    role?: string;
    assignedDate?: string;
    startDate?: string;
    duration?: string;
    teamSize?: number;
    projectManager?: string;
  }) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // State for each notification type
  const [misconductOpen, setMisconductOpen] = useState(false);
  const [misconductProps, setMisconductProps] = useState({
    project: "Website Redesign",
    employee: "Anonymous Reporter",
    issueType: "Misconduct",
    createdAt: "2h ago",
    description: "An issue has been reported regarding employee conduct. Please review and take appropriate action."
  });
  
  const [consultantOpen, setConsultantOpen] = useState(false);
  const [consultantProps, setConsultantProps] = useState({
    consultantName: "Sarah Chen",
    consultantRole: "Data Engineer",
    skills: ["Data Modeling", "ETL", "SQL", "Python"],
    availableFrom: "Immediately",
    hoursPerWeek: 40
  });
  
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [milestoneProps, setMilestoneProps] = useState({
    projectName: "Database Migration",
    milestoneTitle: "Data Migration Plan",
    completion: 60,
    completedAt: "Today",
    dueDate: "Next week",
    teamMembers: 5,
    nextMilestone: "Data Validation"
  });
  
  const [healthcareOpen, setHealthcareOpen] = useState(false);
  const [healthcareProps, setHealthcareProps] = useState({
    interviewDate: "May 10, 2023",
    interviewTime: "11:00 AM",
    location: "Virtual Meeting",
    interviewers: ["Alex Thompson", "Elena Rodriguez"],
    interviewType: "technical" as const,
    duration: "45 minutes"
  });
  
  const [ecommerceOpen, setEcommerceOpen] = useState(false);
  const [ecommerceProps, setEcommerceProps] = useState({
    projectName: "E-commerce Platform Migration",
    role: "Frontend Developer",
    assignedDate: "May 9, 2023",
    startDate: "May 15, 2023",
    duration: "3 months",
    teamSize: 8,
    projectManager: "Sarah Chen"
  });
  
  // Methods to open each notification type
  const openMisconductNotification = (props: typeof misconductProps) => {
    setMisconductProps(props);
    setMisconductOpen(true);
  };
  
  const openConsultantNotification = (props: typeof consultantProps) => {
    setConsultantProps(props);
    setConsultantOpen(true);
  };
  
  const openMilestoneNotification = (props: typeof milestoneProps) => {
    setMilestoneProps(props);
    setMilestoneOpen(true);
  };
  
  const openHealthcareInterviewNotification = (props: typeof healthcareProps) => {
    setHealthcareProps(props);
    setHealthcareOpen(true);
  };
  
  const openEcommerceMigrationNotification = (props: typeof ecommerceProps) => {
    setEcommerceProps(props);
    setEcommerceOpen(true);
  };
  
  const value = {
    openMisconductNotification,
    openConsultantNotification,
    openMilestoneNotification,
    openHealthcareInterviewNotification,
    openEcommerceMigrationNotification
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render all dialog components with their respective props */}
      <MisconductNotificationDialog
        open={misconductOpen}
        onOpenChange={setMisconductOpen}
        {...misconductProps}
      />
      
      <ConsultantAvailableDialog
        open={consultantOpen}
        onOpenChange={setConsultantOpen}
        {...consultantProps}
      />
      
      <ProjectMilestoneDialog
        open={milestoneOpen}
        onOpenChange={setMilestoneOpen}
        {...milestoneProps}
      />
      
      <HealthcareInterviewDialog
        open={healthcareOpen}
        onOpenChange={setHealthcareOpen}
        {...healthcareProps}
      />
      
      <EcommerceMigrationDialog
        open={ecommerceOpen}
        onOpenChange={setEcommerceOpen}
        {...ecommerceProps}
      />
    </NotificationContext.Provider>
  );
} 