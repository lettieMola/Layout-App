import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FlipVertical, FlipHorizontal, Grid2x2, Download, Trash2, ArrowLeft, Save } from "lucide-react";
import { useLocation } from "wouter";
import ToolBar from "@/components/ToolBar";
import { apiRequest } from "@/lib/queryClient";

type MirrorMode = "original" | "vertical" | "horizontal" | "quad";

const mirrorOptions: { mode: MirrorMode; label: string; icon: React.ElementType }[] = [
  { mode: "original", label: "Original", icon: Upload },
  { mode: "vertical", label: "Vertical", icon: FlipHorizontal },
  { mode: "horizontal", label: "Horizontal", icon: FlipVertical },
  { mode: "quad", label: "Quad", icon: Grid2x2 },
];

export default function Mirror() {
  const [image, setImage] = useState<string | null>(null);
  const [mirrorMode, setMirrorMode] = useState<MirrorMode>("vertical");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || !image) {
      toast({ title: "No image to download", description: "Please upload an image first.", variant: "destructive" });
      return;
    }
    try {
      const dataUrl = await toPng(previewRef.current, { 
        quality: 0.95, 
        backgroundColor: '#ffffff',
        pixelRatio: 2, // Increase pixel ratio for HD output
        canvasWidth: previewRef.current.offsetWidth * 2,
        canvasHeight: previewRef.current.offsetHeight * 2,
      });
      const link = document.createElement("a");
      link.download = `mirrored-collage-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "Download Started", description: "Your mirrored collage is downloading." });
    } catch (error) {
      console.error("Download failed:", error);
      toast({ title: "Download Failed", description: "Could not generate the image.", variant: "destructive" });
    }
  }, [image, toast]);

  const handleSave = useCallback(async () => {
    if (!previewRef.current || !image) {
      toast({ title: "No image to save", description: "Please upload an image first.", variant: "destructive" });
      return;
    }
    const name = prompt("Enter a name for your collage:", `Mirrored Image ${new Date().toLocaleTimeString()}`);
    if (!name) return;

    try {
      const dataUrl = await toPng(previewRef.current, { quality: 0.95, backgroundColor: '#ffffff' });
      const collageData = {
        name,
        images: [{ id: Date.now().toString(), uri: dataUrl }],
        layout: null, // Mirrored images don't have a grid layout
        preview: dataUrl, // Use the generated image as a preview
      };
      await apiRequest('POST', '/api/collages', collageData);
      toast({ title: "Saved!", description: "Your mirrored collage has been saved to the gallery." });
    } catch (error) {
      console.error("Save failed:", error);
      toast({ title: "Save Failed", description: "Could not save the collage.", variant: "destructive" });
    }
  }, [image, toast]);

  const handleReset = () => {
    setImage(null);
    setMirrorMode("vertical");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({ title: "Canvas Reset", description: "You can now start over." });
  };

  const renderPreview = () => {
    if (!image) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50 rounded-lg">
          <Upload className="w-16 h-16 mb-4" />
          <p className="font-semibold">Upload an image to get started</p>
          <p className="text-sm">Click the button or drag and drop an image here</p>
        </div>
      );
    }

    const img = (transform = "") => <img src={image} alt="Mirrored" className="w-full h-full object-cover" style={{ transform }} />;

    switch (mirrorMode) {
      case "original": return <div className="w-full h-full">{img()}</div>;
      case "vertical": return <div className="w-full h-full grid grid-cols-2">{img()}{img("scaleX(-1)")}</div>;
      case "horizontal": return <div className="w-full h-full grid grid-rows-2">{img()}{img("scaleY(-1)")}</div>;
      case "quad": return <div className="w-full h-full grid grid-cols-2 grid-rows-2">{img()}{img("scaleX(-1)")}{img("scaleY(-1)")}{img("scale(-1, -1)")}</div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/')}><ArrowLeft /></Button>
          <h1 className="text-2xl font-bold">Mirror Tool</h1>
          <div className="w-10"></div>
        </div>

        <ToolBar
          onSave={handleSave}
          onDownload={handleDownload}
          onReset={handleReset}
          canUndo={false} canRedo={false} onUndo={() => {}} onRedo={() => {}}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>1. Upload Image</CardTitle></CardHeader>
              <CardContent>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" data-testid="file-input" />
                <Button size="sm" onClick={() => fileInputRef.current?.click()} className="w-full" data-testid="upload-button">
                  <Upload className="w-4 h-4 mr-2" /> Upload Image
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>2. Select Mirror Mode</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {mirrorOptions.map(({ mode, label, icon: Icon }) => (
                  <Button key={mode} variant={mirrorMode === mode ? "default" : "outline"} onClick={() => setMirrorMode(mode)} className="h-auto flex-col gap-1 py-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>3. Export</CardTitle></CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm" onClick={handleDownload} className="flex-1" disabled={!image}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button size="sm" onClick={handleReset} variant="destructive" className="flex-1" disabled={!image}>
                  <Trash2 className="w-4 h-4 mr-2" /> Reset
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Preview */}
          <div>
            <Card>
              <CardHeader><CardTitle>Real-time Preview</CardTitle></CardHeader>
              <CardContent>
                <div ref={previewRef} className="aspect-square w-full bg-muted rounded-lg overflow-hidden">
                  {renderPreview()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}