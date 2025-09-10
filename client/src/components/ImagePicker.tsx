import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, Plus } from "lucide-react";

interface ImagePickerProps {
  onImageSelect: (uri: string) => void;
  className?: string;
}

export default function ImagePicker({ onImageSelect, className }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        data-testid="input-file-upload"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        className="hidden"
        data-testid="input-camera-capture"
      />

      {/* Upload options */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <Plus className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">Add Images</h3>
          <p className="text-sm text-muted-foreground">
            Upload photos or take a new picture to start creating your collage
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={triggerCameraInput}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4"
              data-testid="button-camera"
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm">Camera</span>
            </Button>
            
            <Button 
              onClick={triggerFileInput}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4"
              data-testid="button-upload"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm">Gallery</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick upload button for when images exist */}
      <Button 
        onClick={triggerFileInput}
        variant="ghost"
        size="sm"
        className="w-full"
        data-testid="button-add-more"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add More Images
      </Button>
    </div>
  );
}