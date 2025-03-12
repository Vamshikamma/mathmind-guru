
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
  ClipboardCheck,
  Settings,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ChatBubble from '@/components/ui/chat-bubble';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ApiKeyInput from '@/components/settings/ApiKeyInput';
import { geminiAIService, GeminiAIModel } from '@/services/geminiAI';
import { toast } from '@/components/ui/use-toast';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: string;
  isLoading?: boolean;
}

const DEFAULT_SYSTEM_PROMPT = `You are a friendly, helpful AI tutor specializing in Mathematics, Physics, and Chemistry for school students. 
Provide clear, concise explanations with step-by-step breakdowns when solving problems. 
Use simple language and relevant examples that help students understand concepts deeply. 
For mathematical expressions, use clear formatting.
Keep your responses focused on educational content and appropriate for school-age students.`;

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [currentModel, setCurrentModel] = useState<GeminiAIModel>('gemini-pro');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if API key exists, if not, show settings dialog
    const apiKey = geminiAIService.getApiKey();
    if (!apiKey) {
      setSettingsOpen(true);
    }
  }, []);
  
  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    
    const userMessage: Message = {
      content: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add loading message
    const loadingMessage: Message = {
      content: "Thinking...",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      let response;
      const fullPrompt = `${systemPrompt}\n\nUser: ${input}`;
      
      if (selectedImage) {
        // Use vision model for image
        response = await geminiAIService.generateTextWithImage({
          model: 'gemini-pro-vision',
          prompt: fullPrompt,
          image: selectedImage
        });
        setSelectedImage(null);
      } else {
        // Use text model
        response = await geminiAIService.generateText({
          model: currentModel,
          prompt: fullPrompt
        });
      }
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      // Add AI response
      const aiResponse: Message = {
        content: response.text,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev.filter(msg => !msg.isLoading), aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      // Add error message
      const errorMessage: Message = {
        content: "Sorry, I encountered an error. Please check your API key and try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev.filter(msg => !msg.isLoading), errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setImageUploadOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
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
                    <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Settings className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>AI Settings</DialogTitle>
                        <DialogDescription>
                          Configure your AI tutor settings and API keys
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <ApiKeyInput />
                        
                        <div className="space-y-2">
                          <Label htmlFor="model">AI Model</Label>
                          <Tabs defaultValue={currentModel} onValueChange={(value) => setCurrentModel(value as GeminiAIModel)}>
                            <TabsList className="w-full">
                              <TabsTrigger value="gemini-pro" className="flex-1">Gemini Pro</TabsTrigger>
                              <TabsTrigger value="gemini-pro-vision" className="flex-1">Gemini Pro Vision</TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Info className="w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <h3 className="font-semibold mb-2">About AI Tutor</h3>
                      <p className="text-sm text-muted-foreground">
                        Your personal AI tutor is powered by Google Gemini to help you learn and understand concepts in Mathematics, Physics, and Chemistry. Ask questions, solve problems, and get step-by-step explanations.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
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
                            className={message.isLoading ? "opacity-70" : ""}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  {selectedImage && (
                    <div className="mb-3 relative">
                      <div className="relative rounded-lg overflow-hidden border border-border">
                        <img 
                          src={selectedImage} 
                          alt="Selected" 
                          className="w-24 h-24 object-cover" 
                        />
                        <button 
                          className="absolute top-1 right-1 bg-background/80 p-1 rounded-full"
                          onClick={() => setSelectedImage(null)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask anything..."
                      className="pr-24 resize-none"
                      rows={3}
                      disabled={isProcessing}
                    />
                    
                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full"
                        disabled={isProcessing}
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                      
                      <Dialog open={imageUploadOpen} onOpenChange={setImageUploadOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-full"
                            disabled={isProcessing}
                          >
                            <ImagePlus className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload an Image</DialogTitle>
                            <DialogDescription>
                              Upload a handwritten problem, diagram, or textbook page for analysis
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div 
                              className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-12 text-center cursor-pointer hover:bg-muted/30 transition"
                              onClick={handleImageClick}
                            >
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                              />
                              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                              <p className="text-sm font-medium">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground mt-1">PNG, JPG or JPEG (max 5MB)</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        onClick={handleSend}
                        size="icon"
                        className="rounded-full"
                        disabled={(!input.trim() && !selectedImage) || isProcessing}
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
                          onClick={() => setInput("Can you explain the concept of derivatives in calculus with step-by-step examples?")}
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
                          onClick={() => setInput("Help me understand Newton's laws of motion with real-world examples")}
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
                          onClick={() => setInput("What is the periodic table and how is it organized? Which elements are most reactive?")}
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
                        
                        <button
                          className="w-full p-3 text-left rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                          onClick={() => setInput("Can you solve this step-by-step: Find the integral of 3x² + 2x - 5")}
                        >
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Solve an Integration</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Get step-by-step guidance on calculus problems
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
