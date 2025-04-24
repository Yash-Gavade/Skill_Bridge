import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    CheckCircle2,
    MessageCircle,
    MessageSquare,
    Send,
    XCircle
} from "lucide-react";
import { useState } from 'react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'project_invitation' | 'system';
  projectId?: string;
  projectName?: string;
}

interface ConsultantMessageProps {
  consultantId: string;
  consultantName: string;
  consultantAvatar?: string;
  consultantInitials: string;
  currentUserId: string;
  currentUserName: string;
  children?: React.ReactNode;
}

export function ConsultantMessage({
  consultantId,
  consultantName,
  consultantAvatar,
  consultantInitials,
  currentUserId,
  currentUserName,
  children
}: ConsultantMessageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const [projectInvite, setProjectInvite] = useState({
    isInviting: false,
    projectId: 'p1',
    projectName: 'Website Redesign Project'
  });
  
  // Mock message history
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      senderId: currentUserId,
      receiverId: consultantId,
      content: `Hello ${consultantName}, I noticed your profile and wanted to discuss potential opportunities.`,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      read: true,
      type: 'text'
    },
    {
      id: 'm2',
      senderId: consultantId,
      receiverId: currentUserId,
      content: `Hi ${currentUserName}, thanks for reaching out! I'd be happy to discuss opportunities.`,
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      read: true,
      type: 'text'
    },
    {
      id: 'm3',
      senderId: currentUserId,
      receiverId: consultantId,
      content: `Great! We have a new project that might be a good fit for your skills.`,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
      type: 'text'
    },
    {
      id: 'm4',
      senderId: currentUserId,
      receiverId: consultantId,
      content: `Project Invitation: Website Redesign Project`,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      type: 'project_invitation',
      projectId: 'p1',
      projectName: 'Website Redesign Project'
    }
  ]);

  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      senderId: currentUserId,
      receiverId: consultantId,
      content: messageText,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const sendProjectInvitation = () => {
    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      senderId: currentUserId,
      receiverId: consultantId,
      content: `Project Invitation: ${projectInvite.projectName}`,
      timestamp: new Date(),
      read: false,
      type: 'project_invitation',
      projectId: projectInvite.projectId,
      projectName: projectInvite.projectName
    };
    
    setMessages([...messages, newMessage]);
    setProjectInvite({ ...projectInvite, isInviting: false });
    setActiveTab('messages');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircle size={16} />
            <span>Message</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {consultantAvatar ? (
                <img src={consultantAvatar} alt={consultantName} className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback>{consultantInitials}</AvatarFallback>
              )}
            </Avatar>
            <span>{consultantName}</span>
          </DialogTitle>
          <DialogDescription>
            Send messages or project invitations to this consultant
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="invite">Project Invitation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto border rounded-md p-3 mb-4 bg-slate-50 min-h-[250px]">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-3 max-w-[80%] ${message.senderId === currentUserId ? 'ml-auto' : 'mr-auto'}`}
                >
                  {message.type === 'project_invitation' ? (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Project Invitation</span>
                      </div>
                      <p className="text-sm mb-2">{message.projectName}</p>
                      {message.senderId === currentUserId ? (
                        <div className="text-xs text-gray-500">Waiting for response...</div>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
                            <CheckCircle2 className="h-3 w-3" /> Accept
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
                            <XCircle className="h-3 w-3" /> Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      className={`p-3 rounded-lg ${
                        message.senderId === currentUserId 
                          ? 'bg-primary text-white' 
                          : 'bg-white border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div 
                        className={`text-xs mt-1 ${
                          message.senderId === currentUserId 
                            ? 'text-primary-50' 
                            : 'text-gray-500'
                        }`}
                      >
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea 
                placeholder="Type your message..." 
                className="min-h-[80px]"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button className="shrink-0" onClick={sendMessage}>
                <Send size={16} />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="invite" className="space-y-4">
            {projectInvite.isInviting ? (
              <>
                <div className="border rounded-md p-4 bg-blue-50">
                  <h3 className="font-medium mb-2">
                    {projectInvite.projectName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    You are about to invite {consultantName} to this project. They will be able to accept or decline this invitation.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-blue-100">
                      UI/UX
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100">
                      React
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100">
                      Figma
                    </Badge>
                  </div>
                </div>
                
                <Textarea 
                  placeholder="Add a personal message to this invitation (optional)"
                  className="min-h-[100px]"
                />
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setProjectInvite({ ...projectInvite, isInviting: false })}
                  >
                    Cancel
                  </Button>
                  <Button onClick={sendProjectInvitation}>
                    Send Invitation
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Select a project to invite {consultantName} to:
                </p>
                
                <div className="space-y-3">
                  <div 
                    className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setProjectInvite({
                      isInviting: true,
                      projectId: 'p1',
                      projectName: 'Website Redesign Project'
                    })}
                  >
                    <h3 className="font-medium">Website Redesign Project</h3>
                    <p className="text-sm text-gray-600">Acme Corp</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-blue-50">
                        UI/UX
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50">
                        React
                      </Badge>
                    </div>
                  </div>
                  
                  <div 
                    className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setProjectInvite({
                      isInviting: true,
                      projectId: 'p2',
                      projectName: 'Mobile App Development'
                    })}
                  >
                    <h3 className="font-medium">Mobile App Development</h3>
                    <p className="text-sm text-gray-600">TechStart Inc</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-blue-50">
                        React Native
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50">
                        Firebase
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 