
import { Consultant, Project } from "../types/project-interfaces";

export const initialProjects: Record<string, Project> = {
  "proj1": {
    id: "proj1",
    name: "E-commerce Platform Redesign",
    description: "Modernizing the UI/UX of an existing e-commerce platform with focus on mobile experience",
    status: "unassigned",
    workflowPhase: "unassigned",
    executionPhase: null,
    skills: ["UI/UX Design", "React", "Node.js", "Figma", "Responsive Design"],
    startDate: "2025-05-10",
    endDate: "2025-07-30",
    client: {
      name: "RetailPro Inc.",
      logo: "retailpro.svg"
    },
    progress: 0,
    projectNotifications: [],
    matchedConsultants: []
  },
  "proj2": {
    id: "proj2",
    name: "Financial Dashboard Development",
    description: "Creating an interactive dashboard for financial data visualization with real-time updates",
    status: "unassigned",
    workflowPhase: "unassigned",
    executionPhase: null,
    skills: ["React", "TypeScript", "D3.js", "Data Visualization", "API Integration"],
    startDate: "2025-06-01",
    endDate: "2025-09-15",
    client: {
      name: "FinViz Capital",
      logo: "finviz.svg"
    },
    progress: 0,
    projectNotifications: [],
    matchedConsultants: []
  }
};

export const initialConsultants: Record<string, Consultant> = {
  "cons1": {
    id: "cons1",
    name: "Sarah Jensen",
    role: "Senior React Developer",
    avatar: "avatar1.jpg",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    status: "available",
    location: "New York, US"
  },
  "cons2": {
    id: "cons2",
    name: "Michael Chen",
    role: "UX/UI Designer",
    avatar: "avatar2.jpg",
    skills: ["UI/UX Design", "Figma", "Adobe XD", "User Research", "Prototyping"],
    status: "available",
    location: "San Francisco, US"
  },
  "cons3": {
    id: "cons3",
    name: "Emma Rodriguez",
    role: "Full Stack Developer",
    avatar: "avatar3.jpg",
    skills: ["React", "Node.js", "MongoDB", "Express", "AWS"],
    status: "assigned",
    location: "London, UK"
  },
  "cons4": {
    id: "cons4",
    name: "David Kim",
    role: "DevOps Engineer",
    avatar: "avatar4.jpg",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
    status: "busy",
    location: "Berlin, Germany"
  },
  "cons5": {
    id: "cons5",
    name: "Aisha Patel",
    role: "Data Scientist",
    avatar: "avatar5.jpg",
    skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis", "SQL"],
    status: "available",
    location: "Toronto, Canada"
  },
  "cons6": {
    id: "cons6",
    name: "Thomas Müller",
    role: "Backend Developer",
    avatar: "avatar6.jpg",
    skills: ["Java", "Spring Boot", "PostgreSQL", "Microservices", "Kafka"],
    status: "leave",
    location: "Munich, Germany"
  }
};
