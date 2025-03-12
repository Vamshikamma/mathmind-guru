
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { geminiAIService } from '@/services/geminiAI';

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedKey = geminiAIService.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    geminiAIService.setApiKey(apiKey.trim());
    setSaved(true);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  return (
    <div className="space-y-4 p-4 glass-card rounded-xl">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="apiKey">Google Gemini API Key</Label>
        <div className="flex gap-2">
          <Input
            id="apiKey"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setSaved(false);
            }}
            type="password"
            placeholder="Enter your Gemini API key"
            className="flex-1"
          />
          <Button onClick={handleSave} disabled={saved}>
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Get your Gemini API key from{" "}
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline text-primary hover:opacity-80"
          >
            Google AI Studio
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;
