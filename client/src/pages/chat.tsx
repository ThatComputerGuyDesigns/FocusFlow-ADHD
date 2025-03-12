import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Message } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

const contextualTips = {
  empty: "Try asking about ADHD management strategies or breaking down a complex task.",
  focus: "I can help you create a focus plan or suggest concentration techniques.",
  overwhelmed: "Feeling overwhelmed? Let's break down your tasks into smaller steps.",
  time: "Need help with time management? I can suggest strategies that work for ADHD.",
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showTip, setShowTip] = useState(true);

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages", {
        content,
        isUser: true
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setMessage("");
      setShowTip(false);

      if (response.error) {
        toast({
          title: "AI Assistant Unavailable",
          description: "Your message was sent, but our AI assistant is temporarily unavailable. Please try again later.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, sendMessage.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage.mutate(message);
    }
  };

  // Get contextual tip based on message content
  const getCurrentTip = () => {
    const lowercaseMsg = message.toLowerCase();
    if (!message) return contextualTips.empty;
    if (lowercaseMsg.includes("focus") || lowercaseMsg.includes("concentrate")) return contextualTips.focus;
    if (lowercaseMsg.includes("overwhelm") || lowercaseMsg.includes("stress")) return contextualTips.overwhelmed;
    if (lowercaseMsg.includes("time") || lowercaseMsg.includes("schedule")) return contextualTips.time;
    return contextualTips.empty;
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto border-2 border-primary/10">
        <CardHeader className="space-y-1 bg-primary/5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle>ADHD Support Chat</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>I'm your ADHD-friendly AI assistant. I can help with:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Task breakdown</li>
                    <li>Focus strategies</li>
                    <li>Time management</li>
                    <li>Coping techniques</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] p-6" ref={scrollAreaRef}>
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-xs opacity-70">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  Loading...
                </motion.p>
              )}
              {sendMessage.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.span
                          className="h-2 w-2 rounded-full bg-primary"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span
                          className="h-2 w-2 rounded-full bg-primary"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.span
                          className="h-2 w-2 rounded-full bg-primary"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                      <p className="text-sm">AI is thinking...</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>

          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="space-y-2">
              {showTip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-muted-foreground mb-2"
                >
                  💡 {getCurrentTip()}
                </motion.div>
              )}
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything about managing ADHD..."
                  className="min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-[60px] w-[60px]"
                  disabled={sendMessage.isPending}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}