import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, CheckCircle, History, Star, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Static data for past projects 
const pastProjects = [
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

// Consultant data related to past projects
const pastProjectConsultants = {
  "past1": [
    { name: "Dr. Emma Roberts", role: "Healthcare Integration Specialist", avatar: "/avatars/emma.jpg" },
    { name: "Michael Chen", role: "Senior React Developer", avatar: "/avatars/michael.jpg" },
    { name: "Sophia Garcia", role: "UX/UI Designer", avatar: "/avatars/sophia.jpg" },
    { name: "James Johnson", role: "Backend Developer", avatar: "/avatars/james.jpg" }
  ],
  "past2": [
    { name: "Alex Thompson", role: "Data Visualization Expert", avatar: "/avatars/alex.jpg" },
    { name: "Olivia Williams", role: "Angular Developer", avatar: "/avatars/olivia.jpg" },
    { name: "Daniel Kim", role: "FinTech Specialist", avatar: "/avatars/daniel.jpg" }
  ],
  "past3": [
    { name: "Sarah Miller", role: "DevOps Engineer", avatar: "/avatars/sarah.jpg" },
    { name: "David Lee", role: "Java Developer", avatar: "/avatars/david.jpg" },
    { name: "Jennifer Wilson", role: "Database Architect", avatar: "/avatars/jennifer.jpg" },
    { name: "Robert Brown", role: "Microservices Specialist", avatar: "/avatars/robert.jpg" }
  ],
  "past4": [
    { name: "Emily Taylor", role: "IoT Specialist", avatar: "/avatars/emily.jpg" },
    { name: "Joshua Martin", role: "Full Stack Developer", avatar: "/avatars/joshua.jpg" },
    { name: "Amanda White", role: "Machine Learning Engineer", avatar: "/avatars/amanda.jpg" }
  ],
  "past5": [
    { name: "Ryan Davis", role: "Flutter Developer", avatar: "/avatars/ryan.jpg" },
    { name: "Natalie Moore", role: "UI/UX Designer", avatar: "/avatars/natalie.jpg" },
    { name: "Kevin Jackson", role: "Cybersecurity Expert", avatar: "/avatars/kevin.jpg" },
    { name: "Christina Anderson", role: "QA Engineer", avatar: "/avatars/christina.jpg" }
  ]
};

// Outcomes data for each project
const projectOutcomes = {
  "past1": [
    "Reduced patient data retrieval time by 68%",
    "Improved user satisfaction score from 3.2 to 4.8/5",
    "Achieved HIPAA compliance with zero security vulnerabilities",
    "Integrated with 3 major EHR systems seamlessly",
    "Decreased operational costs by 42% annually"
  ],
  "past2": [
    "Enabled real-time financial monitoring across 12 departments",
    "Reduced reporting generation time from 5 hours to 4 minutes",
    "Created 27 customizable dashboard widgets",
    "Increased data accuracy by 99.7%",
    "Automated 18 previously manual reporting tasks"
  ],
  "past3": [
    "Improved website loading speed by 78%",
    "Increased transaction processing capacity by 300%",
    "Reduced infrastructure costs by 52%",
    "Enabled easier scalability during peak shopping seasons",
    "Zero downtime during the migration process"
  ],
  "past4": [
    "Real-time tracking of 15,000+ inventory items",
    "Reduced inventory holding costs by 37%",
    "Improved delivery accuracy to 99.8%",
    "Cut fulfillment time by 52%",
    "Predictive stock management reduced stockouts by 84%"
  ],
  "past5": [
    "Increased mobile app user engagement by 42%",
    "Reduced transaction abandonment rate from 24% to 7%",
    "Enhanced security with biometric authentication",
    "Improved app store rating from 3.1 to 4.7/5",
    "Increased mobile banking usage by 68% among users"
  ]
};

export default function PastProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Find the project data
  const project = pastProjects.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Project Not Found</h2>
          <p className="text-gray-500 mt-2">The requested project does not exist</p>
          <Button 
            variant="default"
            className="mt-4"
            onClick={() => navigate("/past-projects")}
          >
            Back to Past Projects
          </Button>
        </div>
      </div>
    );
  }
  
  const consultants = pastProjectConsultants[project.id] || [];
  const outcomes = projectOutcomes[project.id] || [];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/past-projects")}
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-2">
          <History size={20} className="text-primary" />
          <h1 className="text-xl font-semibold">Past Project Details</h1>
        </div>
      </div>
      
      {/* Project Header */}
      <div className="bg-purple-gradient rounded-lg text-white p-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
            <p className="text-white/80 max-w-2xl">{project.description}</p>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{project.startDate} — {project.endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{consultants.length} Consultants</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>100% Completed</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-white/20 text-white px-3 py-1 text-sm">
              {project.client?.name}
            </Badge>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-300 fill-yellow-300" />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold border-b pb-3 mb-4">Project Description</h3>
                <p className="text-gray-700 mb-4">
                  {project.description} Our team worked closely with {project.client?.name} to deliver 
                  a comprehensive solution that addressed their specific needs and challenges.
                </p>
                <p className="text-gray-700">
                  The project was completed over a {getMonthDifference(project.startDate, project.endDate)}-month period,
                  with all deliverables successfully meeting or exceeding client expectations. The implementation followed
                  industry best practices and included thorough testing and documentation.
                </p>
              </div>
              
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold border-b pb-3 mb-4">Technical Approach</h3>
                <p className="text-gray-700 mb-4">
                  Our technical approach focused on building a scalable, maintainable solution using modern technologies and methodologies.
                  We implemented an agile development process with two-week sprints, regular client demos, and continuous integration.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map(skill => (
                      <Badge key={skill} variant="outline" className="bg-primary-50 text-primary-700 border-primary-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold border-b pb-3 mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">CLIENT</h4>
                    <p className="text-gray-900">{project.client?.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">INDUSTRY</h4>
                    <p className="text-gray-900">{getIndustry(project.id)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DURATION</h4>
                    <p className="text-gray-900">{getMonthDifference(project.startDate, project.endDate)} months</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">TEAM SIZE</h4>
                    <p className="text-gray-900">{consultants.length} consultants</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold border-b pb-3 mb-4">Key Highlights</h3>
                <ul className="space-y-2">
                  {outcomes.slice(0, 3).map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{outcome}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="link"
                  size="sm"
                  className="mt-2 p-0 h-auto"
                  onClick={() => setActiveTab("outcomes")}
                >
                  View All Outcomes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="mt-6">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-3 mb-4">Project Team</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {consultants.map((consultant, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {getInitials(consultant.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900">{consultant.name}</h4>
                    <p className="text-gray-500 text-sm">{consultant.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="outcomes" className="mt-6">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-3 mb-4">Project Outcomes</h3>
            
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {outcomes.map((outcome, index) => (
                  <div key={index} className="bg-primary-50 rounded-lg p-4 flex items-start gap-3">
                    <div className="bg-primary-100 rounded-full p-2 flex-shrink-0">
                      <CheckCircle size={16} className="text-primary-700" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{outcome}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Client Testimonial</h4>
                <blockquote className="text-gray-700 italic border-l-4 border-primary pl-4 py-1">
                  "{getTestimonial(project.id)}"
                </blockquote>
                <p className="text-gray-500 text-sm mt-2 text-right">— {getClientContact(project.id)}, {project.client?.name}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button
              variant="gradient"
              size="lg"
              className="px-8"
              onClick={() => navigate("/contact")}
            >
              Get Similar Results for Your Project
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

function getMonthDifference(startDate: string, endDate: string): number {
  // Simple estimate based on month names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const startParts = startDate.split(' ');
  const endParts = endDate.split(' ');
  
  const startMonth = months.indexOf(startParts[0]);
  const startYear = parseInt(startParts[1]);
  
  const endMonth = months.indexOf(endParts[0]);
  const endYear = parseInt(endParts[1]);
  
  return (endYear - startYear) * 12 + endMonth - startMonth + 1;
}

function getIndustry(projectId: string): string {
  const industries = {
    "past1": "Healthcare",
    "past2": "Finance",
    "past3": "Retail / E-commerce",
    "past4": "Logistics / Supply Chain",
    "past5": "Banking / Finance"
  };
  
  return industries[projectId as keyof typeof industries] || "Technology";
}

function getTestimonial(projectId: string): string {
  const testimonials = {
    "past1": "The team at Skill Bridge completely transformed our healthcare portal. Their expertise in healthcare systems and attention to detail resulted in a solution that has significantly improved our operational efficiency and patient satisfaction.",
    "past2": "Implementing the analytics dashboard developed by Skill Bridge has been a game-changer for our financial services. The real-time insights have enabled us to make data-driven decisions faster than ever before.",
    "past3": "The migration of our e-commerce platform was seamless and delivered exceptional improvements in performance. Skill Bridge's team demonstrated remarkable technical expertise and professionalism throughout the project.",
    "past4": "The supply chain management system developed by Skill Bridge has revolutionized how we track and manage inventory. Their innovative approach to integrating IoT and machine learning exceeded our expectations.",
    "past5": "Our users love the redesigned banking app! Skill Bridge delivered an intuitive, secure, and modern solution that has significantly increased our mobile banking adoption rates. Excellent work!"
  };
  
  return testimonials[projectId as keyof typeof testimonials] || "";
}

function getClientContact(projectId: string): string {
  const contacts = {
    "past1": "Dr. Robert Williams, CTO",
    "past2": "Jennifer Chen, VP of Analytics",
    "past3": "Thomas Brown, E-commerce Director",
    "past4": "Maria Rodriguez, Supply Chain Manager",
    "past5": "David Johnson, Head of Digital Banking"
  };
  
  return contacts[projectId as keyof typeof contacts] || "CEO";
} 