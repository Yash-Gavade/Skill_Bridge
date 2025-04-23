
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import type { ConsultantRole } from "@/store/projectsStore";

interface ReviewStepProps {
  projectData: {
    name: string;
    company: string;
    description: string;
    duration: string;
  };
  roles: ConsultantRole[];
  onProjectDataChange: (field: string, value: string) => void;
  onRoleCountChange: (index: number, value: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReviewStep({
  projectData,
  roles,
  onProjectDataChange,
  onRoleCountChange,
  onBack,
  onSubmit
}: ReviewStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input 
              id="name" 
              value={projectData.name} 
              onChange={(e) => onProjectDataChange("name", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input 
              id="company" 
              value={projectData.company}
              onChange={(e) => onProjectDataChange("company", e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Project Description</Label>
          <Textarea 
            id="description" 
            rows={4}
            value={projectData.description}
            onChange={(e) => onProjectDataChange("description", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Project Duration</Label>
          <Input 
            id="duration" 
            placeholder="e.g. 6 weeks, 3 months"
            value={projectData.duration}
            onChange={(e) => onProjectDataChange("duration", e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <Label>Consultants Needed</Label>
          <div className="space-y-3">
            {roles.map((role, index) => (
              <div 
                key={role.title} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium">{role.title}</span>
                <Input
                  type="text"
                  className="w-20 text-center"
                  value={role.count}
                  onChange={(e) => onRoleCountChange(index, e.target.value)}
                  placeholder="Qty"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Create Project</Button>
      </DialogFooter>
    </form>
  );
}
