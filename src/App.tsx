import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Consultants from "./pages/Consultants";
import ConsultantProfile from "./pages/ConsultantProfile";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ChatSupport } from "@/components/chat/ChatSupport";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public route that redirects to dashboard if authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={<PublicRoute><Login /></PublicRoute>} 
      />
      <Route 
        path="/" 
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
        path="/consultants" 
        element={<ProtectedRoute><Layout><Consultants /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/consultants/:consultantId" 
        element={<ProtectedRoute><Layout><ConsultantProfile /></Layout></ProtectedRoute>} 
      />
      <Route 
        path="/settings" 
        element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
          <ChatSupport />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
