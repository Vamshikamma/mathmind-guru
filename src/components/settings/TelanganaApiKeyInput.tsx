
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { geminiAIService } from '@/services/geminiAI';

const TelanganaApiKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check if there's a saved API key specific to Telangana RTC
    const savedKey = localStorage.getItem('telangana_gemini_api_key') || geminiAIService.getApiKey();
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

    // Save the API key both in the service and as a Telangana-specific key
    geminiAIService.setApiKey(apiKey.trim());
    localStorage.setItem('telangana_gemini_api_key', apiKey.trim());
    setSaved(true);
    toast({
      title: "Success",
      description: "Telangana RTC Assistant API key saved successfully",
    });
  };

  return (
    <div className="space-y-4 p-4 glass-card rounded-xl">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="telanganaApiKey">Telangana RTC Assistant API Key (Gemini)</Label>
        <div className="flex gap-2">
          <Input
            id="telanganaApiKey"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setSaved(false);
            }}
            type="password"
            placeholder="Enter your Gemini API key for Telangana RTC"
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
          . This key will be used for the Telangana RTC Assistant.
        </p>
      </div>
    </div>
  );
};

export default TelanganaApiKeyInput;
