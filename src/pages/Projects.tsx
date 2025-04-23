
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Search, Plus } from "lucide-react";
import { AssignConsultantModal } from "@/components/modals/AssignConsultantModal";
import { AddProjectModal } from "@/components/modals/AddProjectModal";
import { useNavigate } from "react-router-dom";
import { useProjectsStore, Project } from "@/store/projectsStore";
import { toast } from "sonner";

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

  const handleProjectClick = (project: Project) => {
    if (project.workflowPhase === "unassigned") {
      setSelectedProject(project);
      setAssignModalOpen(true);
    } else {
      navigate(`/projects/${project.id}`);
    }
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
