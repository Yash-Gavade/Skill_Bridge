import { ConsultantStatus } from "@/store/projectsStore";

export interface ConsultantCardProps {
  consultant: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    skills: string[];
    status: ConsultantStatus;
    location: string;
    availableFrom?: string;
    selected?: boolean;
    interviewStatus?: string;
    interviewDate?: string;
    score?: number;
  };
  selectable?: boolean;
  onSelect?: (consultantId: string) => void;
}
