import { useNotification } from "@/components/notifications/NotificationProvider";

// This hook simply re-exports the useNotification hook from the provider
// but allows for future enhancements if needed
export function useNotifications() {
  return useNotification();
}

// Example usage:
/*
  import { useNotifications } from "@/hooks/useNotifications";
  
  function MyComponent() {
    const { 
      openMisconductNotification,
      openConsultantNotification,
      openMilestoneNotification,
      openHealthcareInterviewNotification,
      openEcommerceMigrationNotification 
    } = useNotifications();
    
    const handleNotificationClick = () => {
      openMisconductNotification({
        project: "My Project",
        employee: "John Doe",
        issueType: "Serious Misconduct",
        createdAt: "Today",
        description: "Description of the misconduct"
      });
    };
    
    return (
      <button onClick={handleNotificationClick}>
        Open Notification
      </button>
    );
  }
*/ 