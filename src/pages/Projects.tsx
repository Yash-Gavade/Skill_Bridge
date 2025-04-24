import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Search, Plus, History } from "lucide-react";
import { AssignConsultantModal } from "@/components/modals/AssignConsultantModal";
import { AddProjectModal } from "@/components/modals/AddProjectModal";
import { useNavigate } from "react-router-dom";
import { useProjectsStore, Project } from "@/store/projectsStore";
import { toast } from "sonner";
import { pastProjects } from "./PastProjects";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const { projects } = useProjectsStore();
  const projectsData = Object.values(projects) as Project[];
  
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesSearch;
  });
  
  // Filter projects based on workflow phase
  const unassignedProjects = filteredProjects.filter(p => p.workflowPhase === "unassigned");
  const assignedProjects = filteredProjects.filter(p => p.workflowPhase !== "unassigned");

  // Filter past projects based on search query
  const filteredPastProjects = pastProjects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesSearch;
  });

  const handleProjectClick = (project: Project) => {
    if (project.workflowPhase === "unassigned") {
      setSelectedProject(project);
      setAssignModalOpen(true);
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  const handlePastProjectClick = (projectId: string) => {
    navigate(`/past-projects/${projectId}`);
  };

  const handleAddProject = () => {
    setAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button className="gap-2" onClick={handleAddProject}>
          <Plus size={16} />
          Add Project
        </Button>
      </div>
      
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search projects..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Unassigned Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unassignedProjects.map((project) => (
              <div key={project.id} onClick={() => handleProjectClick(project)}>
                <ProjectCard project={project} />
              </div>
            ))}
            {unassignedProjects.length === 0 && (
              <div className="col-span-full p-6 text-center border rounded-lg bg-gray-50">
                <p className="text-gray-500">No unassigned projects found</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Assigned Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedProjects.map((project) => (
              <div key={project.id} onClick={() => handleProjectClick(project)}>
                <ProjectCard project={project} />
              </div>
            ))}
            {assignedProjects.length === 0 && (
              <div className="col-span-full p-6 text-center border rounded-lg bg-gray-50">
                <p className="text-gray-500">No assigned projects found</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <History size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Past Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPastProjects.map((project) => (
              <div key={project.id} onClick={() => handlePastProjectClick(project.id)} className="cursor-pointer">
                <PastProjectCard project={project} />
              </div>
            ))}
            {filteredPastProjects.length === 0 && (
              <div className="col-span-full p-6 text-center border rounded-lg bg-gray-50">
                <p className="text-gray-500">No past projects found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AssignConsultantModal 
        open={assignModalOpen} 
        onOpenChange={setAssignModalOpen} 
        project={selectedProject} 
      />
      
      <AddProjectModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
      />
    </div>
  );
}

// Enhanced card with success indicators for past projects
function PastProjectCard({ project }) {
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-all duration-200 hover:-translate-y-1 bg-white">
      <div className="bg-purple-gradient text-white py-2 px-4 flex justify-between items-center">
        <h3 className="font-medium text-sm">COMPLETED PROJECT</h3>
        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">Success</span>
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
            <span key={skill} className="bg-primary-50 text-primary-700 border border-primary-100 text-xs px-2 py-1 rounded-full">
              {skill}
            </span>
          ))}
          {project.skills.length > 3 && (
            <span className="bg-gray-50 text-xs px-2 py-1 rounded-full border">
              +{project.skills.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
