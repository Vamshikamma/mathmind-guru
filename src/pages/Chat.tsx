
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ArrowUp, 
  CornerDownLeft, 
  BrainCircuit, 
  Mic, 
  ImagePlus, 
  Info, 
  Lightbulb,
  X, 
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatBubble from '@/components/ui/chat-bubble';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Chat = () => {
  const [messages, setMessages] = useState<{ content: string; isUser: boolean; timestamp: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      content: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        content: "I'm here to help you learn! What subject would you like to explore today?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="page-container py-8 h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* Main Chat Area */}
            <div className="lg:col-span-8 xl:col-span-9 h-full flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">AI Tutor</h1>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Info className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <h3 className="font-semibold mb-2">About AI Tutor</h3>
                    <p className="text-sm text-muted-foreground">
                      Your personal AI tutor is here to help you learn and understand concepts in Mathematics, Physics, and Chemistry. Ask questions, solve problems, and get step-by-step explanations.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-6">
                  <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-full flex flex-col items-center justify-center text-center p-8"
                      >
                        <BrainCircuit className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Welcome to AI Tutor!</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          Ask any question about Mathematics, Physics, or Chemistry. I'm here to help you learn and understand better.
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-6">
                        {messages.map((message, index) => (
                          <ChatBubble
                            key={index}
                            content={message.content}
                            isUser={message.isUser}
                            timestamp={message.timestamp}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask anything..."
                      className="pr-24 resize-none"
                      rows={3}
                    />
                    
                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full"
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full"
                      >
                        <ImagePlus className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        onClick={handleSend}
                        size="icon"
                        className="rounded-full"
                        disabled={!input.trim()}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Press <kbd className="px-1 py-0.5 rounded bg-muted">Enter</kbd> to send
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <kbd className="px-1 py-0.5 rounded bg-muted">Shift</kbd> + <kbd className="px-1 py-0.5 rounded bg-muted">Enter</kbd> for new line
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3 h-full">
              <Tabs defaultValue="suggestions" className="h-full flex flex-col">
                <TabsList className="w-full rounded-xl p-1">
                  <TabsTrigger value="suggestions" className="flex-1 rounded-lg">
                    Suggestions
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1 rounded-lg">
                    History
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex-1 mt-6">
                  <TabsContent value="suggestions" className="h-full">
                    <div className="glass-card rounded-2xl p-4 h-full">
                      <div className="space-y-3">
                        <button
                          className="w-full p-3 text-left rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                          onClick={() => setInput("Can you explain the concept of derivatives in calculus?")}
                        >
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Derivatives in Calculus</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Learn about rates of change and slopes
                              </p>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          className="w-full p-3 text-left rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                          onClick={() => setInput("Help me understand Newton's laws of motion")}
                        >
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Newton's Laws</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Explore the fundamental laws of physics
                              </p>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          className="w-full p-3 text-left rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                          onClick={() => setInput("What is the periodic table and how is it organized?")}
                        >
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Periodic Table</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Understand element organization and properties
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="h-full">
                    <div className="glass-card rounded-2xl p-4 h-full">
                      <div className="space-y-3">
                        <button className="w-full p-3 text-left rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                          <div className="flex items-start gap-2">
                            <ClipboardCheck className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Previous Questions</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                View your learning history
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
