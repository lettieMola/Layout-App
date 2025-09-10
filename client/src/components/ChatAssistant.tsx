import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Loader2, X } from "lucide-react";
import { ChatMessage, ChatRequest, AssistantAction } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    images: string[];
    layout: string | null;
    filters: string[];
  };
  onActionExecute: (action: AssistantAction) => void;
  className?: string;
}

export default function ChatAssistant({ 
  isOpen, 
  onClose, 
  context, 
  onActionExecute, 
  className 
}: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your collage creation assistant. I can help you with layouts, filters, and image enhancements. What would you like to create today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsProcessing(true);

    try {
      const chatRequest: ChatRequest = {
        messages: [...messages, userMessage],
        context: {
          images: context.images,
          layout: context.layout || undefined,
          filters: context.filters
        }
      };

      const response = await apiRequest('POST', '/api/chat', chatRequest);
      const result = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Execute any suggested actions
      if (result.actions && result.actions.length > 0) {
        for (const action of result.actions) {
          onActionExecute(action);
        }
        
        toast({
          title: "Actions Applied",
          description: `${result.actions.length} suggestion(s) applied to your collage`,
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm having trouble processing your request right now. Please try again!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    "Help me choose a layout",
    "What filters work well?",
    "Remove background from image",
    "Make my collage more vibrant"
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className={`fixed right-4 bottom-4 w-80 h-96 shadow-lg z-50 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          AI Assistant
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          data-testid="button-close-chat"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex flex-col h-80">
        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 mb-4">
          <div className="space-y-3 pr-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                    <Bot className="w-3 h-3" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                
                {message.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                    <User className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick suggestions */}
        {messages.length <= 1 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-1">
              {quickSuggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover-elevate text-xs"
                  onClick={() => handleQuickSuggestion(suggestion)}
                  data-testid={`badge-suggestion-${index}`}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your collage..."
            disabled={isProcessing}
            data-testid="input-chat-message"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isProcessing}
            data-testid="button-send-chat"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}