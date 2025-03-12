
import { toast } from '@/components/ui/use-toast';

export type GeminiAIModel = 'gemini-pro' | 'gemini-pro-vision';

export interface GeminiAIRequestParams {
  model: GeminiAIModel;
  prompt: string;
  image?: string; // Base64 encoded image data
  temperature?: number;
  maxTokens?: number;
}

export interface GeminiAIResponse {
  text: string;
  model: string;
}

class GeminiAIService {
  private API_KEY: string | null = null;
  private API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

  setApiKey(key: string) {
    this.API_KEY = key;
    localStorage.setItem('gemini_api_key', key);
  }

  getApiKey(): string | null {
    if (!this.API_KEY) {
      this.API_KEY = localStorage.getItem('gemini_api_key');
    }
    return this.API_KEY;
  }

  async generateText({ model, prompt, temperature = 0.7, maxTokens = 1024 }: GeminiAIRequestParams): Promise<GeminiAIResponse> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API key in settings",
        variant: "destructive",
      });
      throw new Error('API key is required');
    }

    try {
      const response = await fetch(`${this.API_ENDPOINT}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated');
      }

      return {
        text: data.candidates[0].content.parts[0].text,
        model: model
      };
    } catch (error) {
      console.error('Error generating text with Gemini:', error);
      toast({
        title: "AI Error",
        description: error instanceof Error ? error.message : "Failed to connect to Gemini AI",
        variant: "destructive",
      });
      throw error;
    }
  }

  async generateTextWithImage({ model, prompt, image, temperature = 0.7, maxTokens = 1024 }: GeminiAIRequestParams): Promise<GeminiAIResponse> {
    if (model !== 'gemini-pro-vision') {
      throw new Error('Image generation requires gemini-pro-vision model');
    }
    
    if (!image) {
      throw new Error('Image data is required for vision model');
    }

    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API key in settings",
        variant: "destructive",
      });
      throw new Error('API key is required');
    }

    try {
      const response = await fetch(`${this.API_ENDPOINT}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: image.replace(/^data:image\/\w+;base64,/, '')
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated');
      }

      return {
        text: data.candidates[0].content.parts[0].text,
        model: model
      };
    } catch (error) {
      console.error('Error generating text with Gemini:', error);
      toast({
        title: "AI Error",
        description: error instanceof Error ? error.message : "Failed to connect to Gemini AI",
        variant: "destructive",
      });
      throw error;
    }
  }
}

export const geminiAIService = new GeminiAIService();
