import { useState, useRef, useEffect } from "react";
import { useCollageStore } from "@/hooks/useCollageStore";
import { toPng } from 'html-to-image';
import Canvas from "@/components/Canvas";
import ImagePicker from "@/components/ImagePicker";
import LayoutSelector from "@/components/LayoutSelector";
import MirrorControls from "@/components/MirrorControls";
import AITools from "@/components/AITools";
import FilterControls from "@/components/FilterControls";
import ToolBar from "@/components/ToolBar";
import BottomNavigation from "@/components/BottomNavigation";
import ImageThumbnails from "@/components/ImageThumbnails";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { GRID_LAYOUTS } from "@/lib/constants";
import { FilterOption } from "@shared/schema";

export default function Editor() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('layouts');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    images,
    selectedLayout,
    selectedMirror,
    addImage,
    removeImage,
    setLayout,
    setMirrorLayout,
    undo,
    redo,
    reset,
    saveProject,
    loadProject,
    canUndo,
    canRedo
  } = useCollageStore();

  // Initialize with first layout if none selected
  const currentLayout = selectedLayout || GRID_LAYOUTS[0];

  // Load existing collage if collageId is provided in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const collageId = urlParams.get('collageId');
    
    if (collageId && loadProject) {
      setIsLoading(true);
      loadProject(collageId)
        .then(() => {
          toast({
            title: "Collage Loaded",
            description: "Your collage has been loaded successfully",
          });
        })
        .catch((error) => {
          console.error('Failed to load collage:', error);
          toast({
            title: "Load Failed",
            description: "Failed to load the collage",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [location, loadProject, toast]);

  const handleDownload = async () => {
    if (!canvasRef.current) {
      toast({
        title: "Error",
        description: "Canvas not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataUrl = await toPng(canvasRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `collage-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Success",
        description: "Collage downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error",
        description: "Failed to download collage",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    saveProject();
    toast({
      title: "Success",
      description: "Project saved successfully!",
    });
  };

  const handleAiProcessComplete = (imageIndex: number, result: string, effectName: string) => {
    toast({
      title: "AI Processing Complete",
      description: `${effectName} applied successfully!`,
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'images':
        return <ImagePicker onImageSelect={addImage} />;
      case 'layouts':
        return (
          <LayoutSelector 
            onLayoutSelect={setLayout} 
            selectedLayout={currentLayout}
          />
        );
      case 'mirror':
        return (
          <MirrorControls 
            mirrorLayout={selectedMirror}
            onLayoutChange={setMirrorLayout}
          />
        );
      case 'filters':
        return (
          <FilterControls 
            onFilterSelect={setSelectedFilter}
            selectedFilter={selectedFilter}
          />
        );
      case 'ai':
        return (
          <AITools 
            images={images}
            onAiProcessComplete={handleAiProcessComplete}
          />
        );
      default:
        return (
          <LayoutSelector 
            onLayoutSelect={setLayout} 
            selectedLayout={currentLayout}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-lg font-semibold">Editor</h1>
          
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2">
        <ToolBar
          onUndo={undo}
          onRedo={redo}
          onReset={reset}
          onSave={handleSave}
          onDownload={handleDownload}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Canvas */}
        <Canvas
          ref={canvasRef}
          images={images}
          layout={activeTab === 'mirror' ? null : currentLayout}
          mirror={activeTab === 'mirror' ? selectedMirror : undefined}
          filters={selectedFilter ? [selectedFilter] : []}
        />

        {/* Image Thumbnails */}
        {images.length > 0 && (
          <ImageThumbnails
            images={images}
            onRemoveImage={removeImage}
          />
        )}

        {/* Tab Content */}
        <div className="space-y-4">
          {renderTabContent()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t bg-background">
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          imageCount={images.length}
        />
      </div>
    </div>
  );
}