import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AI_CAPABILITIES } from "@/lib/constants";
import { Bot, Loader2, Scissors, Paintbrush, Smile, Tag, Palette, ZoomIn } from "lucide-react";
import { CollageImage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AIToolsProps {
  images: CollageImage[];
  onAiProcessComplete: (imageIndex: number, result: string, effectName: string) => void;
  className?: string;
}

export default function AITools({ images, onAiProcessComplete, className }: AIToolsProps) {
  const [processing, setProcessing] = useState<string | null>(null);
  const [assistantMessage, setAssistantMessage] = useState<string | null>(null);

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
      setAssistantMessage('Please add an image first');
      setTimeout(() => setAssistantMessage(null), 3000);
      return;
    }

    setProcessing(capabilityId);
    setAssistantMessage(`🤖 Applying ${capabilityName}... please wait`);

    try {
      // Call backend AI processing
      const response = await apiRequest('POST', '/api/process-image', {
        imageData: images[0].uri,
        effect: capabilityId,
        filter: capabilityName
      });
      
      const result = await response.json();
      
      setAssistantMessage(`✅ ${capabilityName} applied successfully!`);
      onAiProcessComplete(0, result.processedImage, capabilityName);
      
    } catch (error) {
      console.error('AI processing error:', error);
      setAssistantMessage('❌ AI processing failed. Please try again.');
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