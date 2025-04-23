
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Calendar } from "lucide-react";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";

const stats = [
  { 
    title: "Active Projects", 
    value: 14, 
    change: "+3",
    changeType: "increase",
    icon: FileText
  },
  { 
    title: "Available Consultants", 
    value: 8, 
    change: "+2",
    changeType: "increase",
    icon: Users
  },
  { 
    title: "Consultant Utilization", 
    value: "76%", 
    change: "+5%",
    changeType: "increase",
    icon: Calendar
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to SkillBridge HQ</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <div className={`flex items-center mt-2 text-sm ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span>{stat.change}</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-primary-50 rounded-full">
                  <stat.icon size={20} className="text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <NotificationsPanel />
      </div>
    </div>
  );
}
