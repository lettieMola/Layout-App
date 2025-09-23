import { useState, useRef, useEffect, useCallback } from "react";
import { useCollageStore } from "@/hooks/useCollageStore";
import { toPng } from 'html-to-image';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageCircle, Image as ImageIcon, Grid3x3, AppWindow, Filter, Bot, Sticker, Type, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { GRID_LAYOUTS } from "@/lib/constants";
import Canvas from "@/components/Canvas";
import ImagePicker, { EditorImage } from "@/components/ImagePicker";
import LayoutSelector from "@/components/LayoutSelector";
import FilterControls from "@/components/FilterControls";
import AITools from "@/components/AITools";
import ToolBar from "@/components/ToolBar";
import ImageThumbnails from "@/components/ImageThumbnails";
import ChatAssistant from "@/components/ChatAssistant";
import StickerPicker from "@/components/StickerPicker";
import MirroringControls from "@/pages/Mirror";
import { FilterOption, CollageImage, GridLayout } from "@shared/schema";
import TextTools from "@/pages/TextTools";

export default function Editor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('');
  const [isChatOpen, setChatOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(null);

  const {
    images, selectedLayout, selectedMirror, selectedImageId,
    addImage, removeImage, setLayout, setMirrorLayout, selectImage, replaceImage,
    undo, redo, reset, saveProject, loadProject,
    canUndo, canRedo
  } = useCollageStore();

  const [location] = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const collageId = params.get('collageId');
    const initialTab = params.get('tab');
    
    if (images.length === 0 && !collageId) {
      setActiveTab('images');
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
    if (collageId && loadProject) {
      setIsLoading(true);
      loadProject(collageId)
        .then(() => {
          toast({ title: "Collage Loaded", description: "Your collage has been loaded successfully" });
        })
        .catch((err) => {
          console.error("Failed to load collage:", err);
          toast({ title: "Load Failed", description: "Failed to load the collage", variant: "destructive" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [location, loadProject, toast, images.length]);

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) {
      toast({ title: "Error", description: "Canvas not found", variant: "destructive" });
      return;
    }
    try {
      const dataUrl = await toPng(canvasRef.current, { 
        quality: 0.95,
        pixelRatio: 2, // Increase pixel ratio for HD output
        canvasWidth: canvasRef.current.offsetWidth * 2,
        canvasHeight: canvasRef.current.offsetHeight * 2,
      });
      const link = document.createElement('a');
      link.download = `collage-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "Success", description: "Collage downloaded successfully!" });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({ title: "Error", description: "Failed to download collage", variant: "destructive" });
    }
  }, [toast]);

  const handleSave = () => {
    saveProject();
    toast({ title: "Success", description: "Project saved successfully!" });
  };

  const handleAiProcessComplete = (imageId: string, newImageUri: string, effectName: string) => {
    replaceImage(imageId, newImageUri);
    toast({ title: "AI Processing Complete", description: `${effectName} applied successfully!` });
  };

  const handleImageAdd = (image: EditorImage) => {
    if (typeof image === 'string') {
      addImage(image);
    } else {
      addImage(image.src);
    }
  };

  const renderTabContent = () => {
    const layout: GridLayout = selectedLayout || GRID_LAYOUTS[0]; // Ensure layout is always defined
    switch (activeTab) {
      case 'images': return <ImagePicker onImageSelect={handleImageAdd} />;
      case 'layouts': return <LayoutSelector onLayoutSelect={setLayout} selectedLayout={layout} />;
      case 'mirror': return <MirroringControls />;
      case 'filters': return <FilterControls onFilterSelect={setSelectedFilter} selectedFilter={selectedFilter} />;
      case 'stickers': return <StickerPicker onSelect={() => {}} />;
      case 'text': return <TextTools onAddText={() => {}} />;
      case 'ai': return <AITools images={images} selectedImageId={selectedImageId} onAiProcessComplete={handleAiProcessComplete} onImageSelect={selectImage} />;
      default: return <ImagePicker onImageSelect={handleImageAdd} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16" data-testid="editor-page">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-background/95 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={() => setLocation('/')} data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-lg font-semibold">Create Collage</h1>
        <Button variant="ghost" size="sm" onClick={() => setChatOpen(true)} data-testid="button-open-chat">
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Toolbar */}
      <div className="p-3 border-b bg-background">
        <ToolBar onUndo={undo} onRedo={redo} onReset={reset} onSave={handleSave} onDownload={handleDownload} canUndo={canUndo} canRedo={canRedo} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <Canvas ref={canvasRef} images={images.map(img => ({...img, src: img.uri})) as EditorImage[]} layout={activeTab === 'mirror' ? null : selectedLayout || GRID_LAYOUTS[0]} mirror={activeTab === 'mirror' ? selectedMirror : undefined} selectedFilter={selectedFilter} />
          {images.length > 0 && <ImageThumbnails images={images.map(img => ({...img, src: img.uri})) as EditorImage[]} onRemoveImage={removeImage} />}
        </div>
        <div className="pt-4">
          {renderTabContent()}
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="p-3 border-t bg-background flex justify-around">
        {[
          { id: 'images', label: 'Images', icon: ImageIcon },
          { id: 'layouts', label: 'Layouts', icon: Grid3x3 },
          { id: 'filters', label: 'Filters', icon: Filter },
          { id: 'mirror', label: 'Mirror', icon: AppWindow },
          { id: 'stickers', label: 'Stickers', icon: Sticker },
          { id: 'text', label: 'Text', icon: Type },
          { id: 'ai', label: 'AI', icon: Sparkles },
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'secondary' : 'ghost'}
            size="sm"
            className="flex flex-col h-auto w-16 gap-1 rounded-lg py-2"
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-xs">{tab.label}</span>
          </Button>
        ))}
      </div>

      <ChatAssistant isOpen={isChatOpen} onClose={() => setChatOpen(false)} context={{ images: images.map(i => i.uri), layout: selectedLayout?.id ?? null, filters: [] }} onActionExecute={() => {}} />
    </div>
  );
}