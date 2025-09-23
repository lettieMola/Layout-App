import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Plus, ImageIcon, X } from "lucide-react";

export interface EditorImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  filter?: string;
  brightness?: number;
  contrast?: number;
  rotation?: number;
  flippedX?: boolean;
  flippedY?: boolean;
  crop?: { x: number; y: number; width: number; height: number } | null;
}

interface ImagePickerProps {
  onImageSelect: (img: EditorImage) => void;
  className?: string;
}

export default function ImagePicker({ onImageSelect, className }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const processFile = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const img: EditorImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            src: e.target.result as string,
            x: 10,
            y: 10,
            width: 100,
            height: 100,
            filter: '',
            brightness: 1,
            contrast: 1,
            rotation: 0,
            flippedX: false,
            flippedY: false,
            crop: null,
          };
          onImageSelect(img);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(processFile);
    setSelectedFiles([]);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      imageFiles.forEach(processFile);
      setSelectedFiles([]);
    }
  }, [processFile]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
        data-testid="input-file-upload"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleImageUpload}
        className="hidden"
        data-testid="input-camera-capture"
      />

      {/* Drag and Drop Area */}
      <Card
        className={`p-8 border-2 border-dashed transition-all duration-200 rounded-xl ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-105 shadow-lg'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:shadow-md'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center text-center py-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all ${
            isDragOver ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted hover:bg-muted/80'
          }`}>
            <ImageIcon className="w-10 h-10" />
          </div>

          <h3 className="text-lg font-semibold mb-2">Add images to create your collage</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Drag and drop your photos here, or use the options below to get started
          </p>

          {/* Upload options */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <Button
              onClick={triggerCameraInput}
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
              data-testid="button-camera"
            >
              <Camera className="w-7 h-7" />
              <span className="text-sm font-medium">Camera</span>
            </Button>
            <Button
              onClick={triggerFileInput}
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
              data-testid="button-upload"
            >
              <Upload className="w-7 h-7" />
              <span className="text-sm font-medium">Gallery</span>
            </Button>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Supports JPG, PNG, GIF up to 10MB each
          </div>
        </CardContent>
      </Card>

      {/* Selected files preview */}
      {selectedFiles.length > 0 && (
        <Card className="p-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Selected Files ({selectedFiles.length})</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}