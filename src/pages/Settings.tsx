import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/context/ThemeContext";
import {
    AlertTriangle,
    Bell,
    Clock,
    Mail,
    Palette,
    Save,
    Shield,
    UploadCloud,
    User
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, setTheme } = useTheme();
  
  // Profile Settings
  const [name, setName] = useState("Yash Gavade");
  const [email, setEmail] = useState("yash.gavade@skillbridge.com");
  const [jobTitle, setJobTitle] = useState("Project Manager");
  const [timeZone, setTimeZone] = useState("UTC+0");
  const [language, setLanguage] = useState("en");
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [consultantUpdates, setConsultantUpdates] = useState(true);
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(false);
  
  // Appearance Settings
  const [compactMode, setCompactMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [loginAlerts, setLoginAlerts] = useState(true);
  
  const handleSaveProfile = () => {
    toast.success("Profile settings saved successfully", { duration: 1000 });
  };
  
  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated", { duration: 1000 });
  };
  
  const handleSaveAppearance = () => {
    toast.success("Appearance settings updated", { duration: 1000 });
  };
  
  const handleSaveSecurity = () => {
    toast.success("Security settings updated", { duration: 1000 });
  };
  
  // Apply theme change immediately
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`, { duration: 1000 });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette size={16} />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={16} />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-xl">YG</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="mt-2 gap-2">
                    <UploadCloud size={16} />
                    Change Photo
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input 
                        id="job-title" 
                        value={jobTitle} 
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter your phone number" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select value={timeZone} onValueChange={setTimeZone}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">Greenwich Mean Time (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="UTC+5:30">Indian Standard Time (UTC+5:30)</SelectItem>
                      <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2" onClick={handleSaveProfile}>
                <Save size={16} />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control which notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                <Separator />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <Label className="text-base">Project Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about project status changes and milestones
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={projectUpdates} 
                    onCheckedChange={setProjectUpdates} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <User size={18} className="text-primary" />
                    </div>
                    <div>
                      <Label className="text-base">Consultant Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about consultant availability and assignments
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={consultantUpdates} 
                    onCheckedChange={setConsultantUpdates} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <Clock size={18} className="text-primary" />
                    </div>
                    <div>
                      <Label className="text-base">Meeting Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive reminders about upcoming meetings and interviews
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={meetingReminders} 
                    onCheckedChange={setMeetingReminders} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <AlertTriangle size={18} className="text-primary" />
                    </div>
                    <div>
                      <Label className="text-base">System Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Important system notifications and service updates
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={systemAlerts} 
                    onCheckedChange={setSystemAlerts} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2" onClick={handleSaveNotifications}>
                <Save size={16} />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Color Theme</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div 
                      className={`
                        border rounded-md p-3 cursor-pointer transition-all
                        ${theme === 'light' ? 'ring-2 ring-primary' : ''}
                        hover:bg-accent
                      `}
                      onClick={() => handleThemeChange('light')}
                    >
                      <div className="h-10 bg-white border rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-center">Light</p>
                    </div>
                    <div 
                      className={`
                        border rounded-md p-3 cursor-pointer transition-all
                        ${theme === 'dark' ? 'ring-2 ring-primary' : ''}
                        hover:bg-accent
                      `}
                      onClick={() => handleThemeChange('dark')}
                    >
                      <div className="h-10 bg-gray-900 border rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-center">Dark</p>
                    </div>
                    <div 
                      className={`
                        border rounded-md p-3 cursor-pointer transition-all
                        ${theme === 'system' ? 'ring-2 ring-primary' : ''}
                        hover:bg-accent
                      `}
                      onClick={() => handleThemeChange('system')}
                    >
                      <div className="h-10 bg-gradient-to-r from-white to-gray-900 border rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-center">System</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact layout to fit more content on screen
                      </p>
                    </div>
                    <Switch 
                      checked={compactMode} 
                      onCheckedChange={setCompactMode} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Switch 
                      checked={highContrastMode} 
                      onCheckedChange={setHighContrastMode} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable interface animations and transitions
                      </p>
                    </div>
                    <Switch 
                      checked={animationsEnabled} 
                      onCheckedChange={setAnimationsEnabled} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2" onClick={handleSaveAppearance}>
                <Save size={16} />
                Save Appearance
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security and authentication options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Two-factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch 
                  checked={twoFactorAuth} 
                  onCheckedChange={setTwoFactorAuth} 
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label className="text-base">Change Password</Label>
                <div className="grid grid-cols-1 gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="w-full sm:w-auto">Update Password</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after a period of inactivity
                  </p>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email alerts for new login attempts
                    </p>
                  </div>
                  <Switch 
                    checked={loginAlerts} 
                    onCheckedChange={setLoginAlerts} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2" onClick={handleSaveSecurity}>
                <Save size={16} />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
