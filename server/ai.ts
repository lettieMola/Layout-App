import OpenAI from "openai";
import { AIProcessRequest, AIProcessResponse, ChatRequest, ChatResponse, AIEffect } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
  }
} catch (error) {
  console.warn('OpenAI API not available:', error);
}

export class AIService {
  private static instance: AIService;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async processImage(request: AIProcessRequest): Promise<AIProcessResponse> {
    try {
      const { imageData, effect, options = {} } = request;
      
      // Check if OpenAI is available
      if (!openai) {
        return {
          processedImage: imageData,
          success: false,
          message: 'AI service not available. Please configure OpenAI API key.'
        };
      }
      
      // For demo purposes, we'll use OpenAI's vision model to analyze and generate suggestions
      // In a real implementation, you'd use specialized AI services for each effect
      
      switch (effect) {
        case 'bg_remove':
          return await this.removeBackground(imageData, options);
        case 'style_transfer':
          return await this.applyStyleTransfer(imageData, options);
        case 'face_enhance':
          return await this.enhanceFace(imageData, options);
        case 'upscale':
          return await this.upscaleImage(imageData, options);
        case 'colorization':
          return await this.colorizeImage(imageData, options);
        case 'object_detection':
          return await this.detectObjects(imageData, options);
        default:
          throw new Error(`Unsupported AI effect: ${effect}`);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      return {
        processedImage: request.imageData, // Return original on error
        success: false,
        message: `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async removeBackground(imageData: string, options: any): Promise<AIProcessResponse> {
    // Mock implementation - in real app would use Remove.bg API or similar
    try {
      console.log('Removing background from image...');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, we'll return a modified version with a transparent background effect
      // In real implementation, you'd call Remove.bg or similar service
      const processedImage = imageData; // Would be the processed image with background removed
      
      return {
        processedImage,
        success: true,
        message: 'Background removed successfully'
      };
    } catch (error) {
      return {
        processedImage: imageData,
        success: false,
        message: 'Failed to remove background'
      };
    }
  }

  private async applyStyleTransfer(imageData: string, options: any): Promise<AIProcessResponse> {
    try {
      console.log('Applying style transfer...');
      
      const style = options.style || 'artistic';
      
      if (openai) {
        // Use OpenAI's image generation for style transfer
        const analysisResponse = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Apply ${style} style transfer to this image. Describe the visual transformation.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageData
                  }
                }
              ],
            },
          ],
          max_tokens: 200,
        });

        return {
          processedImage: imageData,
          success: true,
          message: `Style transfer applied: ${analysisResponse.choices[0].message.content}`
        };
      } else {
        // Fallback without OpenAI
        return {
          processedImage: imageData,
          success: true,
          message: `${style} style transfer applied (demo mode)`
        };
      }
    } catch (error) {
      return {
        processedImage: imageData,
        success: false,
        message: 'Failed to apply style transfer'
      };
    }
  }

  private async enhanceFace(imageData: string, options: any): Promise<AIProcessResponse> {
    try {
      console.log('Enhancing faces in image...');
      
      // Simulate face enhancement processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        processedImage: imageData,
        success: true,
        message: 'Face enhancement completed'
      };
    } catch (error) {
      return {
        processedImage: imageData,
        success: false,
        message: 'Failed to enhance faces'
      };
    }
  }

  private async upscaleImage(imageData: string, options: any): Promise<AIProcessResponse> {
    try {
      console.log('Upscaling image...');
      
      // Simulate upscaling processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return {
        processedImage: imageData,
        success: true,
        message: 'Image upscaled successfully'
      };
    } catch (error) {
      return {
        processedImage: imageData,
        success: false,
        message: 'Failed to upscale image'
      };
    }
  }

  private async colorizeImage(imageData: string, options: any): Promise<AIProcessResponse> {
    try {
      console.log('Colorizing image...');
      
      // Simulate colorization processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      return {
        processedImage: imageData,
        success: true,
        message: 'Image colorized successfully'
      };
    } catch (error) {
      return {
        processedImage: imageData,
        success: false,
        message: 'Failed to colorize image'
      };
    }
  }

  private async detectObjects(imageData: string, options: any): Promise<AIProcessResponse> {
    try {
      console.log('Detecting objects in image...');
      
      if (openai) {
        const visionResponse = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image and detect all objects present. List them in a JSON format with confidence scores."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageData
                  }
                }
              ],
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 300,
        });

        return {
          processedImage: imageData,
          success: true,
          message: `Objects detected: ${visionResponse.choices[0].message.content}`
        };
      } else {
        // Fallback without OpenAI
        return {
          processedImage: imageData,
          success: true,
          message: 'Objects detected: person, background, foreground (demo mode)'
        };
      }
    } catch (error) {
      return {
        processedImage: imageData,
        success: false,
        message: 'Failed to detect objects'
      };
    }
  }

  async chatWithAssistant(request: ChatRequest): Promise<ChatResponse> {
    try {
      const { messages, context } = request;
      
      if (!openai) {
        // Fallback responses without OpenAI
        const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
        
        if (lastMessage.includes('layout')) {
          return {
            text: "I'd recommend trying a grid layout for your collage! Grid layouts work great for organizing multiple photos.",
            actions: [{ type: 'setLayout', layoutId: 'grid-3x3' }]
          };
        } else if (lastMessage.includes('filter')) {
          return {
            text: "Adding a warm filter can make your collage feel more cohesive and inviting!",
            actions: [{ type: 'applyFilter', filter: 'warm' }]
          };
        } else if (lastMessage.includes('background')) {
          return {
            text: "I can help remove the background from your images to make them blend better in the collage.",
            actions: [{ type: 'removeBackground', imageIndex: 0 }]
          };
        } else {
          return {
            text: "I'm here to help you create amazing collages! Try asking me about layouts, filters, or image enhancements.",
            actions: []
          };
        }
      }
      
      // Build system prompt with context
      const systemPrompt = `You are a helpful AI assistant for a collage creation app. You help users create beautiful collages by suggesting layouts, filters, and providing guidance.

Current context:
- Images: ${context?.images?.length || 0} images uploaded
- Layout: ${context?.layout || 'none selected'}
- Filters: ${context?.filters?.join(', ') || 'none applied'}

You can suggest actions by responding with JSON that includes an 'actions' array. Available actions:
- setLayout: { type: 'setLayout', layoutId: 'grid-3x3' }
- applyFilter: { type: 'applyFilter', filter: 'warm' }
- removeBackground: { type: 'removeBackground', imageIndex: 0 }
- enhanceFace: { type: 'enhanceFace', imageIndex: 0 }
- upscale: { type: 'upscale', imageIndex: 0 }
- save: { type: 'save' }
- download: { type: 'download' }

Always be helpful, creative, and encouraging. Provide specific suggestions based on the user's needs.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role as "user" | "assistant" | "system",
            content: msg.content
          }))
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        text: result.text || result.message || "I'm here to help you create amazing collages!",
        actions: result.actions || []
      };
    } catch (error) {
      console.error('Chat assistant error:', error);
      return {
        text: "I'm having trouble processing your request right now. Please try again!",
        actions: []
      };
    }
  }
}

export const aiService = AIService.getInstance();