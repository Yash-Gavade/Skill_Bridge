
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConsultantCard } from "@/components/consultants/ConsultantCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Grid2X2, List } from "lucide-react";
import { AddConsultantModal } from "@/components/modals/AddConsultantModal";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjectsStore, Consultant, ConsultantStatus } from "@/store/projectsStore";

export default function Consultants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ConsultantStatus | null>(null);
  const navigate = useNavigate();

  const { consultants } = useProjectsStore();
  const consultantsData = Object.values(consultants) as Consultant[];
  console.log("🚀 ~ Consultants ~ consultantsData:", consultantsData)

  // Filter consultants based on search query and status filter
  const filteredConsultants = consultantsData.filter((consultant) => {
    const matchesSearch = 
      consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      consultant.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (!statusFilter) return matchesSearch;
    return matchesSearch && consultant.status === statusFilter;
  });

  const statusCounts = consultantsData.reduce((acc, consultant) => {
    acc[consultant.status] = (acc[consultant.status] || 0) + 1;
    return acc;
  }, {} as Record<ConsultantStatus, number>);

  const statusColors: Record<ConsultantStatus, string> = {
    "available": "bg-green-100 text-green-800",
    "assigned": "bg-blue-100 text-blue-800",
    "busy": "bg-amber-100 text-amber-800",
    "leave": "bg-gray-100 text-gray-800",
    "in_selection": "bg-purple-100 text-purple-800",
    "interviewing": "bg-indigo-100 text-indigo-800",
    "unavailable": "bg-red-100 text-red-800"
  };

  const statusLabels: Record<ConsultantStatus, string> = {
    "available": "Available",
    "assigned": "Assigned",
    "busy": "Busy",
    "leave": "On Leave",
    "in_selection": "In Selection Process",
    "interviewing": "Interviewing with Client",
    "unavailable": "Unavailable"
  };

  const handleViewProfile = (consultantId: string) => {
    navigate(`/consultants/${consultantId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Consultants</h1>
        <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} />
          Add Consultant
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full sm:max-w-xs relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search consultants..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Status
                {statusFilter && <Badge variant="secondary" className="ml-1">1</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setStatusFilter(null)}
                className={!statusFilter ? "bg-accent text-accent-foreground" : ""}
              >
                All
              </DropdownMenuItem>
              {Object.keys(statusLabels).map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setStatusFilter(status as ConsultantStatus)}
                  className={statusFilter === status ? "bg-accent text-accent-foreground" : ""}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{statusLabels[status as ConsultantStatus]}</span>
                    <Badge variant="outline" className="ml-2">
                      {statusCounts[status as ConsultantStatus] || 0}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none ${viewMode === "table" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("table")}
            >
              <List size={18} />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultants.map((consultant) => (
            <div key={consultant.id} onClick={() => handleViewProfile(consultant.id)}>
              <ConsultantCard consultant={consultant} />
            </div>
          ))}
          <div 
            className="border border-dashed rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-colors"
            onClick={() => setAddModalOpen(true)}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
              <Plus size={24} className="text-gray-400" />
            </div>
            <p className="mt-4 font-medium">Add Consultant</p>
            <p className="text-sm text-gray-500">Upload CV or add manually</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultants.map((consultant) => (
                <TableRow key={consultant.id}>
                  <TableCell className="font-medium">{consultant.name}</TableCell>
                  <TableCell>{consultant.role}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {consultant.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-gray-50 text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {consultant.skills.length > 2 && (
                        <Badge variant="outline" className="bg-gray-50 text-xs">
                          +{consultant.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[consultant.status]}>
                      {statusLabels[consultant.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{consultant.location}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(consultant.id);
                      }}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={consultant.status !== "available"}
                    >
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredConsultants.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No consultants found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
      
      <AddConsultantModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen} 
      />
    </div>
  );
}
