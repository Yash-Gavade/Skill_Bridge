import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Static data for past projects
export const pastProjects = [
  {
    id: "past1",
    name: "Healthcare Portal Modernization",
    description: "Complete redesign of a healthcare provider portal with improved patient data management and integration with EHR systems.",
    status: "completed",
    workflowPhase: "completed",
    skills: ["React", "Node.js", "MongoDB", "Healthcare API", "HIPAA Compliance"],
    startDate: "Jan 2023",
    endDate: "Apr 2023",
    client: {
      name: "MediCare Systems",
      logo: "/images/clients/medicare.png"
    },
    progress: 100
  },
  {
    id: "past2",
    name: "Financial Services Analytics Dashboard",
    description: "Development of a comprehensive analytics dashboard for a financial services provider with real-time data visualization and reporting.",
    status: "completed",
    workflowPhase: "completed",
    skills: ["Angular", "TypeScript", "D3.js", "Python", "AWS", "FinTech"],
    startDate: "Nov 2022",
    endDate: "Mar 2023",
    client: {
      name: "Global Finance Partners",
      logo: "/images/clients/gfp.png"
    },
    progress: 100
  },
  {
    id: "past3",
    name: "E-commerce Platform Migration",
    description: "Migration of a legacy e-commerce platform to a modern microservices architecture with improved performance and scalability.",
    status: "completed",
    workflowPhase: "completed",
    skills: ["Microservices", "Java", "Spring Boot", "Kubernetes", "PostgreSQL", "Redis"],
    startDate: "Aug 2022",
    endDate: "Jan 2023",
    client: {
      name: "ShopMaxx Retail",
      logo: "/images/clients/shopmaxx.png"
    },
    progress: 100
  },
  {
    id: "past4",
    name: "Supply Chain Management System",
    description: "Implementation of an end-to-end supply chain management system with real-time tracking and inventory optimization.",
    status: "completed",
    workflowPhase: "completed",
    skills: ["React", "Node.js", "GraphQL", "IoT Integration", "Machine Learning"],
    startDate: "May 2022",
    endDate: "Oct 2022",
    client: {
      name: "LogiTech Solutions",
      logo: "/images/clients/logitech.png"
    },
    progress: 100
  },
  {
    id: "past5",
    name: "Banking App Redesign",
    description: "Complete UI/UX redesign and backend modernization of a mobile banking application focusing on security and user experience.",
    status: "completed",
    workflowPhase: "completed",
    skills: ["Flutter", "Firebase", "Biometric Authentication", "UI/UX Design", "Financial API Integration"],
    startDate: "Feb 2022",
    endDate: "Jul 2022",
    client: {
      name: "SecureBank Financial",
      logo: "/images/clients/securebank.png"
    },
    progress: 100
  }
];

// Group projects by industry
const industryProjects = {
  "Healthcare": [pastProjects[0]],
  "Finance": [pastProjects[1], pastProjects[4]],
  "Retail": [pastProjects[2]],
  "Logistics": [pastProjects[3]]
};

export default function PastProjects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  
  const filteredProjects = pastProjects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesSearch;
  });
  
  const handleProjectClick = (projectId: string) => {
    navigate(`/past-projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <History size={24} className="text-primary" />
          <h1 className="text-2xl font-bold">Past Projects</h1>
        </div>
        <Badge variant="gradient" className="text-sm py-1 px-3">
          Success Stories
        </Badge>
      </div>
      
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search past projects..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="retail">Retail</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} onClick={() => handleProjectClick(project.id)} className="cursor-pointer">
                <PastProjectCard project={project} />
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-full p-6 text-center border rounded-lg bg-gray-50">
                <p className="text-gray-500">No matching past projects found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="healthcare" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryProjects["Healthcare"].filter(p => 
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(project => (
              <div key={project.id} onClick={() => handleProjectClick(project.id)} className="cursor-pointer">
                <PastProjectCard project={project} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="finance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryProjects["Finance"].filter(p => 
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(project => (
              <div key={project.id} onClick={() => handleProjectClick(project.id)} className="cursor-pointer">
                <PastProjectCard project={project} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="retail" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryProjects["Retail"].filter(p => 
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(project => (
              <div key={project.id} onClick={() => handleProjectClick(project.id)} className="cursor-pointer">
                <PastProjectCard project={project} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="logistics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryProjects["Logistics"].filter(p => 
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(project => (
              <div key={project.id} onClick={() => handleProjectClick(project.id)} className="cursor-pointer">
                <PastProjectCard project={project} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Enhanced card with success indicators for past projects
function PastProjectCard({ project }) {
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-all duration-200 hover:-translate-y-1 bg-white">
      <div className="bg-purple-gradient text-white py-2 px-4 flex justify-between items-center">
        <h3 className="font-medium text-sm">COMPLETED PROJECT</h3>
        <Badge variant="secondary" className="bg-white/20 text-white text-xs">Success</Badge>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.client?.name}</p>
          </div>
        </div>
        
        <p className="mt-3 text-sm text-gray-600 line-clamp-3">{project.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 my-3">
          <span>{project.startDate}</span>
          <span>→</span>
          <span>{project.endDate}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {project.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="bg-primary-50 text-primary-700 border-primary-100">
              {skill}
            </Badge>
          ))}
          {project.skills.length > 3 && (
            <Badge variant="outline" className="bg-gray-50">
              +{project.skills.length - 3} more
            </Badge>
          )}
        </div>
        
        <Button 
          variant="gradient"
          size="sm" 
          className="w-full"
        >
          View Case Study
        </Button>
      </div>
    </div>
  );
} 