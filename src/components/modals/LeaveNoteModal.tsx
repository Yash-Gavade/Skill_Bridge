import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useProjectsStore } from "@/store/projectsStore";

interface LeaveNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function LeaveNoteModal({ open, onOpenChange, projectId }: LeaveNoteModalProps) {
  const [noteContent, setNoteContent] = useState("");
  const { addProjectNote } = useProjectsStore();

  const handleSubmit = () => {
    if (noteContent.trim()) {
      addProjectNote(projectId, noteContent);
      setNoteContent("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Leave a Note</DialogTitle>
          <DialogDescription>
            Add a note to the project that will be visible to the team.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              placeholder="Write your note here..."
              className="min-h-[120px]"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!noteContent.trim()}>
            Submit Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 