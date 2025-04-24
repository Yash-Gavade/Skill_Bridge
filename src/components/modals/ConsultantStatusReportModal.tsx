import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Consultant, ConsultantStatus, useProjectsStore } from "@/store/projectsStore";
import { CheckSquare, Clock, Download, FileText, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

interface ConsultantStatusReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultantStatusReportModal({
  open,
  onOpenChange,
}: ConsultantStatusReportModalProps) {
  const { consultants, projects } = useProjectsStore();
  const consultantsList = Object.values(consultants) as Consultant[];
  const projectsList = Object.values(projects);
  const [consultantSearch, setConsultantSearch] = useState("");
  
  // Calculate statistics
  const stats = useMemo(() => {
    // Status counts
    const statusCounts: Record<string, number> = {};
    consultantsList.forEach(consultant => {
      statusCounts[consultant.status] = (statusCounts[consultant.status] || 0) + 1;
    });
    
    // Calculate utilization rate
    const assignedCount = statusCounts["assigned"] || 0;
    const utilizationRate = Math.round((assignedCount / consultantsList.length) * 100);
    
    // Project statistics
    const activeProjects = projectsList.filter(p => 
      p.workflowPhase !== "completed" && p.workflowPhase !== "unassigned"
    ).length;
    
    // Skill statistics - get top 5 skills
    const skillCounts: Record<string, number> = {};
    consultantsList.forEach(consultant => {
      consultant.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    
    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }));
      
    return {
      statusCounts,
      utilizationRate,
      totalConsultants: consultantsList.length,
      activeProjects,
      topSkills,
      statusLabels: {
        "available": "Available",
        "assigned": "Assigned",
        "busy": "Busy",
        "leave": "On Leave",
        "in_selection": "In Selection Process",
        "interviewing": "Interviewing with Client",
        "unavailable": "Unavailable"
      },
      statusColors: {
        "available": "bg-green-100 text-green-800",
        "assigned": "bg-blue-100 text-blue-800",
        "busy": "bg-amber-100 text-amber-800",
        "leave": "bg-gray-100 text-gray-800",
        "in_selection": "bg-purple-100 text-purple-800",
        "interviewing": "bg-indigo-100 text-indigo-800",
        "unavailable": "bg-red-100 text-red-800"
      }
    };
  }, [consultantsList, projectsList]);
  
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Filter consultants based on search
  const filteredConsultants = consultantsList.filter(consultant =>
    consultant.name.toLowerCase().includes(consultantSearch.toLowerCase()) ||
    consultant.role.toLowerCase().includes(consultantSearch.toLowerCase()) ||
    consultant.skills.some(skill => skill.toLowerCase().includes(consultantSearch.toLowerCase()))
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Monthly Consultant Status Report</DialogTitle>
          <DialogDescription>
            Consultant status and utilization report for {currentMonth}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="status">Status Breakdown</TabsTrigger>
            <TabsTrigger value="skills">Skills Distribution</TabsTrigger>
            <TabsTrigger value="consultants">Individual Consultants</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Consultants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">{stats.totalConsultants}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Utilization Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CheckSquare className="h-5 w-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">{stats.utilizationRate}%</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">{stats.activeProjects}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(stats.statusLabels).map(([status, label]) => (
                    <div key={status} className="flex items-center gap-2">
                      <Badge className={stats.statusColors[status as ConsultantStatus]}>
                        {label}: {stats.statusCounts[status] || 0}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Available: {stats.statusCounts["available"] || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Assigned: {stats.statusCounts["assigned"] || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                      <span className="text-sm">Other: {
                        (stats.totalConsultants - 
                        (stats.statusCounts["available"] || 0) - 
                        (stats.statusCounts["assigned"] || 0))
                      }</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center items-center mt-6 h-48">
                  <div className="w-48 h-48 relative rounded-full border-8 border-gray-100 flex items-center justify-center">
                    <div 
                      className="absolute inset-0 rounded-full" 
                      style={{
                        background: `conic-gradient(
                          #10B981 0% ${(stats.statusCounts["available"] || 0) / stats.totalConsultants * 100}%, 
                          #3B82F6 ${(stats.statusCounts["available"] || 0) / stats.totalConsultants * 100}% ${((stats.statusCounts["available"] || 0) + (stats.statusCounts["assigned"] || 0)) / stats.totalConsultants * 100}%, 
                          #D1D5DB ${((stats.statusCounts["available"] || 0) + (stats.statusCounts["assigned"] || 0)) / stats.totalConsultants * 100}% 100%
                        )`,
                        clipPath: 'circle(50% at center)'
                      }}
                    ></div>
                    <div className="bg-white rounded-full h-32 w-32 z-10 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{stats.utilizationRate}%</span>
                      <span className="text-xs text-gray-500">Utilization</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(stats.statusLabels).map(([status, label]) => {
                    const count = stats.statusCounts[status] || 0;
                    const percentage = Math.round((count / stats.totalConsultants) * 100) || 0;
                    
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge className={stats.statusColors[status as ConsultantStatus]}>
                              {label}
                            </Badge>
                            <span className="text-sm font-medium">{count} consultants</span>
                          </div>
                          <span className="text-sm text-gray-500">{percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-4">Consultant Status by Month</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm w-24">January</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden flex">
                        <div className="h-full bg-green-500" style={{ width: "30%" }}></div>
                        <div className="h-full bg-blue-500" style={{ width: "45%" }}></div>
                        <div className="h-full bg-amber-500" style={{ width: "15%" }}></div>
                        <div className="h-full bg-gray-300" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm w-24">February</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden flex">
                        <div className="h-full bg-green-500" style={{ width: "25%" }}></div>
                        <div className="h-full bg-blue-500" style={{ width: "50%" }}></div>
                        <div className="h-full bg-amber-500" style={{ width: "15%" }}></div>
                        <div className="h-full bg-gray-300" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm w-24">March</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden flex">
                        <div className="h-full bg-green-500" style={{ width: "20%" }}></div>
                        <div className="h-full bg-blue-500" style={{ width: "55%" }}></div>
                        <div className="h-full bg-amber-500" style={{ width: "15%" }}></div>
                        <div className="h-full bg-gray-300" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm w-24">Current</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden flex">
                        <div className="h-full bg-green-500" style={{ width: `${(stats.statusCounts["available"] || 0) / stats.totalConsultants * 100}%` }}></div>
                        <div className="h-full bg-blue-500" style={{ width: `${(stats.statusCounts["assigned"] || 0) / stats.totalConsultants * 100}%` }}></div>
                        <div className="h-full bg-amber-500" style={{ width: `${(stats.statusCounts["busy"] || 0) / stats.totalConsultants * 100}%` }}></div>
                        <div className="h-full bg-gray-300" style={{ width: `${((stats.totalConsultants - 
                          (stats.statusCounts["available"] || 0) - 
                          (stats.statusCounts["assigned"] || 0) -
                          (stats.statusCounts["busy"] || 0)) / stats.totalConsultants * 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                      <span>Assigned</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
                      <span>Busy</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div>
                      <span>Other</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Skills Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stats.topSkills.map(({ skill, count }) => {
                    const percentage = Math.round((count / stats.totalConsultants) * 100);
                    
                    return (
                      <div key={skill} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{skill}</span>
                          <span className="text-sm text-gray-500">{count} consultants ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <div className="flex flex-col items-center">
                    <h3 className="text-sm font-medium mb-4">Skills Overlap</h3>
                    <div className="relative w-64 h-64">
                      {stats.topSkills.slice(0, 3).map(({ skill, count }, index) => {
                        const size = 100 + (count / stats.totalConsultants) * 100;
                        const colors = ['rgba(16, 185, 129, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(249, 115, 22, 0.7)'];
                        const positions = [
                          { top: '10%', left: '30%' },
                          { top: '45%', left: '10%' },
                          { top: '45%', left: '50%' }
                        ];
                        
                        return (
                          <div 
                            key={skill}
                            className="absolute rounded-full flex items-center justify-center text-xs font-medium text-white"
                            style={{
                              width: `${size}px`,
                              height: `${size}px`,
                              backgroundColor: colors[index],
                              ...positions[index]
                            }}
                          >
                            {skill}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Skills by Project Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-3">Web Development</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>React.js</span>
                        <span>65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>JavaScript</span>
                        <span>80%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Node.js</span>
                        <span>45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TypeScript</span>
                        <span>40%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-3">Data Science</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Python</span>
                        <span>70%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Machine Learning</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SQL</span>
                        <span>60%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Visualization</span>
                        <span>40%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="consultants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Individual Consultant Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search consultants by name, role or skills..."
                    className="pl-8"
                    value={consultantSearch}
                    onChange={(e) => setConsultantSearch(e.target.value)}
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Utilization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConsultants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No consultants match your search
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredConsultants.map((consultant) => {
                          // Calculate utilization for this consultant
                          // (This is a simplified metric - you might want to replace with actual data)
                          const utilizationStatus = 
                            consultant.status === "assigned" ? "100%" :
                            consultant.status === "busy" ? "75%" :
                            consultant.status === "in_selection" ? "50%" :
                            consultant.status === "interviewing" ? "25%" : 
                            "0%";
                            
                          return (
                            <TableRow key={consultant.id}>
                              <TableCell className="font-medium">
                                {consultant.name}
                              </TableCell>
                              <TableCell>{consultant.role}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {consultant.skills.slice(0, 2).map((skill) => (
                                    <Badge 
                                      key={skill} 
                                      variant="outline" 
                                      className="bg-gray-50 text-xs"
                                    >
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
                                <Badge className={stats.statusColors[consultant.status]}>
                                  {stats.statusLabels[consultant.status]}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary" 
                                      style={{ 
                                        width: utilizationStatus,
                                        backgroundColor: 
                                          utilizationStatus === "100%" ? "#EF4444" : // Red for assigned (100%)
                                          utilizationStatus === "0%" ? "#10B981" :   // Green for available (0%)
                                          "#F59E0B"                                  // Amber for in-progress states
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">{utilizationStatus}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    {filteredConsultants.length} consultants found
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Export report as CSV
                    </span>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Utilization by Consultant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-end gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>In Progress (Interviewing/Selection)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Assigned</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {filteredConsultants.slice(0, 5).map((consultant) => {
                    // Create utilization history based on status for this example
                    const utilizationHistory = [
                      Math.round(Math.random() * 100),
                      Math.round(Math.random() * 100),
                      Math.round(Math.random() * 100),
                      Math.round(Math.random() * 100),
                      consultant.status === "assigned" ? 100 : 
                        consultant.status === "available" ? 0 : 
                        Math.round(Math.random() * 70)
                    ];
                    
                    // Calculate average utilization
                    const avgUtilization = Math.round(
                      utilizationHistory.reduce((sum, val) => sum + val, 0) / utilizationHistory.length
                    );
                    
                    return (
                      <div key={consultant.id} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-medium">{consultant.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {consultant.role}
                            </span>
                          </div>
                          <Badge className={stats.statusColors[consultant.status]}>
                            {stats.statusLabels[consultant.status]}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1 h-6">
                          {utilizationHistory.map((value, idx) => {
                            // Adjust color logic based on value (100% = assigned/red, 0% = available/green)
                            const color = 
                              value > 80 ? "#EF4444" : // Red for high utilization (assigned)
                              value < 20 ? "#10B981" : // Green for low utilization (available)
                              "#F59E0B";              // Amber for medium utilization (in process)
                            
                            return (
                              <div 
                                key={idx}
                                className="flex-1 h-full first:rounded-l-md last:rounded-r-md" 
                                style={{ backgroundColor: color }}
                                title={`Week ${idx + 1}: ${value}% utilized`}
                              ></div>
                            );
                          })}
                        </div>
                        
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">Past 4 weeks</span>
                          <span className="text-xs font-medium">Avg: {avgUtilization}%</span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredConsultants.length > 5 && (
                    <div className="text-center text-sm text-muted-foreground py-2">
                      Showing 5 out of {filteredConsultants.length} consultants
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 