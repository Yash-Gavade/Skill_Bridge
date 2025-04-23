
import { FileText } from "lucide-react";

interface ProcessingStepProps {
  fileName?: string;
}

export function ProcessingStep({ fileName }: ProcessingStepProps) {
  return (
    <div className="py-8 space-y-6">
      <div className="text-center">
        <FileText className="h-14 w-14 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Processing {fileName}</h3>
        <p className="text-gray-500 mb-6">Extracting project information...</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 max-w-xs mx-auto">
          <div className="bg-primary h-2.5 rounded-full animate-[progress_2s_ease-in-out]" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
}
