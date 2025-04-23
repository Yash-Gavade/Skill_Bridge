import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ConsultantCard } from "@/components/consultants/ConsultantCard";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, FileText } from "lucide-react";

// Mock data
const upcomingProjects = [
  {
    id: "p1",
    name: "Website Redesign",
    description: "Redesign the company website with modern UI/UX principles",
    status: "unassigned" as const,
    workflowPhase: "unassigned" as const,
    skills: ["UI/UX", "React", "Figma"],
    startDate: "May 15, 2023",
    endDate: "June 30, 2023",
    client: {
      name: "Acme Corp"
    },
    progress: 0
  },
  {
    id: "p2",
    name: "Mobile App Development",
    description: "Build a cross-platform mobile app for customer engagement",
    status: "unassigned" as const,
    workflowPhase: "unassigned" as const,
    skills: ["React Native", "Firebase", "Redux"],
    startDate: "May 20, 2023",
    endDate: "August 15, 2023",
    client: {
      name: "TechStart Inc"
    },
    progress: 0
  },
];

const availableConsultants = [
  {
    id: "c1",
    name: "Alex Johnson",
    role: "Senior Frontend Developer",
    skills: ["React", "TypeScript", "UI/UX"],
    status: "available" as const,
    location: "San Francisco, US",
  },
  {
    id: "c2",
    name: "Sarah Chen",
    role: "Backend Engineer",
    skills: ["Node.js", "Python", "AWS"],
    status: "available" as const,
    location: "Berlin, Germany",
  }
];

const stats = [
  { 
    title: "Active Projects", 
    value: 14, 
    change: "+3",
    changeType: "increase",
    icon: FileText
  },
  { 
    title: "Available Consultants", 
    value: 8, 
    change: "+2",
    changeType: "increase",
    icon: Users
  },
  { 
    title: "Consultant Utilization", 
    value: "76%", 
    change: "+5%",
    changeType: "increase",
    icon: Calendar
  },
];

export default function Index() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Welcome to SkillBridge HQ</h1>
        <p className="text-gray-500">AI-powered consultant management platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <div className={`flex items-center mt-2 text-sm ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span>{stat.change}</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-primary-50 rounded-full">
                  <stat.icon size={20} className="text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Upcoming Projects</CardTitle>
                <CardDescription>Projects starting in the next 30 days</CardDescription>
              </div>
              <Link to="/projects">
                <Button variant="ghost" size="sm" className="gap-1">
                  <span>View All</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {upcomingProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Available Consultants</CardTitle>
                <CardDescription>Consultants ready for assignment</CardDescription>
              </div>
              <Link to="/consultants">
                <Button variant="ghost" size="sm" className="gap-1">
                  <span>View All</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {availableConsultants.map((consultant) => (
                <ConsultantCard key={consultant.id} consultant={consultant} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
