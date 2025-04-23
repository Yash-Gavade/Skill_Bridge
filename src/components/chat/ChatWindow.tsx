import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input immediately after sending
    setInput("");
    setIsLoading(true);

    try {
      // Call the process_query API with proper headers
      const response = await axios.post('http://75.101.145.1:8000/process_query', 
        { query: input },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Chatbot API response:", response.data);
      
      // Extract the output_text from the response
      let messageText = "";
      if (response.data && typeof response.data === 'object') {
        // Check if output_text exists in the response
        if (response.data.output_text) {
          messageText = response.data.output_text;
        } else if (response.data.response) {
          messageText = response.data.response;
        } else {
          // If neither exists, stringify the whole response
          messageText = JSON.stringify(response.data);
        }
      } else if (typeof response.data === 'string') {
        // If response data is a string, use it directly
        messageText = response.data;
      } else {
        messageText = "Received a response, but couldn't display it properly.";
      }
      
      // Add the response to messages
      setMessages(prev => [...prev, {
        text: messageText,
        isUser: false
      }]);
    } catch (error) {
      console.error("Error querying chatbot API:", error);
      setMessages(prev => [...prev, {
        text: "Sorry, there was an error processing your request. Please try again later.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 w-96 h-[500px]",
        "bg-background border rounded-lg shadow-xl",
        "flex flex-col transition-all duration-300 transform",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Chat Support</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 text-center p-4">
            <p>Ask me anything about finding the right consultants for your projects!</p>
          </div>
        )}
        
        {messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[80%] p-3 rounded-lg",
              message.isUser
                ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                : "bg-muted rounded-bl-none"
            )}
          >
            {/* Format message text to preserve line breaks */}
            <div 
              dangerouslySetInnerHTML={{
                __html: message.text.replace(/\n/g, '<br>')
              }}
            />
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 max-w-[80%] p-3 rounded-lg bg-muted rounded-bl-none">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
