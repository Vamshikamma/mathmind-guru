
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, BrainCircuit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ApiKeyInput from '@/components/settings/ApiKeyInput';
import { geminiAIService, GeminiAIModel } from '@/services/geminiAI';

const DEFAULT_SYSTEM_PROMPT = `You are a friendly, helpful AI tutor specializing in Mathematics, Physics, and Chemistry for school students. 
Provide clear, concise explanations with step-by-step breakdowns when solving problems. 
Use simple language and relevant examples that help students understand concepts deeply. 
For mathematical expressions, use clear formatting.
Keep your responses focused on educational content and appropriate for school-age students.`;

const formSchema = z.object({
  model: z.enum(["gemini-pro", "gemini-pro-vision"]),
  systemPrompt: z.string().min(10, {
    message: "System prompt must be at least 10 characters.",
  }),
  temperature: z.coerce.number().min(0).max(1),
  maxTokens: z.coerce.number().min(100).max(30000),
});

const Settings = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "gemini-pro" as GeminiAIModel,
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 1024,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Save settings to localStorage
    localStorage.setItem('ai_settings', JSON.stringify(values));
    toast({
      title: "Settings Saved",
      description: "Your AI tutor settings have been updated",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="page-container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Tutor Settings</h1>
                <p className="text-muted-foreground">Configure your AI learning experience</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* API Key Section */}
              <section className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-primary" />
                  <span>API Configuration</span>
                </h2>
                <div className="space-y-4">
                  <ApiKeyInput />
                </div>
              </section>

              {/* AI Model Settings */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="glass-card rounded-xl p-6 space-y-6">
                  <h2 className="text-xl font-semibold mb-2">AI Model Settings</h2>

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="gemini-pro" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Gemini Pro (Text-only)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="gemini-pro-vision" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Gemini Pro Vision (Text + Images)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          Select which Google Gemini model to use for your AI tutor.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="systemPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter system prompt"
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This prompt guides how the AI tutor behaves and responds.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature: {field.value}</FormLabel>
                          <FormControl>
                            <Input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Lower values (0.1-0.4) make responses more focused and deterministic.
                            Higher values (0.7-1.0) make responses more creative and varied.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxTokens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Tokens</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Maximum length of the AI response (1024 recommended).
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
