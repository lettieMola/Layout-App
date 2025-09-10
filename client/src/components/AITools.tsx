import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AI_CAPABILITIES } from "@/lib/constants";
import { Bot, Loader2, Scissors, Paintbrush, Smile, Tag, Palette, ZoomIn } from "lucide-react";
import { CollageImage, AIEffect } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIToolsProps {
  images: CollageImage[];
  selectedImageId: string | null;
  onAiProcessComplete: (imageId: string, result: string, effectName: string) => void;
  onImageSelect: (imageId: string | null) => void;
  className?: string;
}

export default function AITools({ images, selectedImageId, onAiProcessComplete, onImageSelect, className }: AIToolsProps) {
  const [processing, setProcessing] = useState<string | null>(null);
  const [assistantMessage, setAssistantMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const getCapabilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'scissors':
        return <Scissors className="w-4 h-4" />;
      case 'paintbrush':
        return <Paintbrush className="w-4 h-4" />;
      case 'smile':
        return <Smile className="w-4 h-4" />;
      case 'tag':
        return <Tag className="w-4 h-4" />;
      case 'palette':
        return <Palette className="w-4 h-4" />;
      case 'zoom-in':
        return <ZoomIn className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const handleAiAction = async (capabilityId: string, capabilityName: string) => {
    if (images.length === 0) {
      toast({
        title: "No Images",
        description: "Please add an image first",
        variant: "destructive",
      });
      return;
    }

    const targetImage = selectedImageId 
      ? images.find(img => img.id === selectedImageId)
      : images[0];
    
    if (!targetImage) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to process",
        variant: "destructive",
      });
      return;
    }

    setProcessing(capabilityId);
    setAssistantMessage(`🤖 Applying ${capabilityName}... please wait`);

    try {
      // Call new AI processing endpoint
      const response = await apiRequest('POST', '/api/ai/process', {
        imageData: targetImage.uri,
        effect: capabilityId as AIEffect,
        options: {}
      });
      
      const result = await response.json();
      
      if (result.success) {
        setAssistantMessage(`✅ ${capabilityName} applied successfully!`);
        onAiProcessComplete(targetImage.id, result.processedImage, capabilityName);
        toast({
          title: "AI Processing Complete",
          description: result.message || `${capabilityName} applied successfully`,
        });
      } else {
        setAssistantMessage(`❌ ${result.message || 'AI processing failed'}`);
        toast({
          title: "AI Processing Failed",
          description: result.message || "Please try again",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('AI processing error:', error);
      setAssistantMessage('❌ AI processing failed. Please try again.');
      toast({
        title: "Error",
        description: "AI processing failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
      setTimeout(() => setAssistantMessage(null), 5000);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {AI_CAPABILITIES.map((capability) => (
            <Button
              key={capability.id}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4 hover-elevate"
              onClick={() => handleAiAction(capability.id, capability.name)}
              disabled={processing === capability.id}
              data-testid={`button-ai-${capability.id}`}
            >
              {processing === capability.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                getCapabilityIcon(capability.icon)
              )}
              <span className="text-xs font-medium text-center">{capability.name}</span>
            </Button>
          ))}
        </div>

        {assistantMessage && (
          <Card className="p-3 bg-muted/50">
            <p className="text-sm text-center" data-testid="text-ai-message">
              {assistantMessage}
            </p>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}