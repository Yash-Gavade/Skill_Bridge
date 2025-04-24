import { consultantsData } from "@/data/consultants";
import { useProjectsStore } from "@/store/projectsStore";
import { useEffect } from "react";

export function StoreInitializer() {
  const { addConsultants } = useProjectsStore();

  useEffect(() => {
    // Initialize the store with our consultant data
    addConsultants(consultantsData);
    
    // This effect should only run once
  }, [addConsultants]);

  return null; // This component doesn't render anything
} 