
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadStepProps {
  onFileSelect: (file: File) => void;
}

export function FileUploadStep({ onFileSelect }: FileUploadStepProps) {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
      onFileSelect(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-primary bg-primary-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <div>
            <p className="font-medium text-lg mb-1">Upload Project Brief</p>
            <p className="text-sm text-gray-500 mb-4">
              PDF files up to 10MB
            </p>
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}>
              Select File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
