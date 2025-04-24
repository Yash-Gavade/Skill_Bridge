import { ChatSupport } from "@/components/chat/ChatSupport";
import { Layout } from "@/components/layout/Layout";
import { StoreInitializer } from "@/components/StoreInitializer";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import About from "./pages/About";
import ConsultantProfile from "./pages/ConsultantProfile";
import Consultants from "./pages/Consultants";
import ConsultantView from "./pages/ConsultantView";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import MisconductReportView from "./pages/MisconductReportView";
import NotFound from "./pages/NotFound";
import PastProjectDetail from "./pages/PastProjectDetail";
import PastProjects from "./pages/PastProjects";
import ProjectDetail from "./pages/ProjectDetail";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import UploadCV from "./pages/UploadCV";
import UploadProject from "./pages/UploadProject";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public route that redirects to dashboard if authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Authentication */}
      <Route 
        path="/login" 
        element={<PublicRoute><Login /></PublicRoute>} 
      />
      
      {/* Protected pages */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/projects" 
        element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/projects/:projectId" 
        element={<ProtectedRoute><Layout><ProjectDetail /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/past-projects" 
        element={<ProtectedRoute><Layout><PastProjects /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/past-projects/:projectId" 
        element={<ProtectedRoute><Layout><PastProjectDetail /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/consultants" 
        element={<ProtectedRoute><Layout><Consultants /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/consultants/:consultantId" 
        element={<ProtectedRoute><Layout><ConsultantView /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/consultants-old/:consultantId" 
        element={<ProtectedRoute><Layout><ConsultantProfile /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/settings" 
        element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/upload-project" 
        element={<ProtectedRoute><Layout><UploadProject /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/upload-cv" 
        element={<ProtectedRoute><Layout><UploadCV /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/misconduct-reports/:reportId" 
        element={<ProtectedRoute><Layout><MisconductReportView /></Layout></ProtectedRoute>} 
      />
      
      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <StoreInitializer />
          <BrowserRouter>
            <AppRoutes />
            <ChatSupport />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
