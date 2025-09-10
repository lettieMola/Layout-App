import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollageImage } from "@shared/schema";
import { X, GripVertical } from "lucide-react";

interface ImageThumbnailsProps {
  images: CollageImage[];
  onRemoveImage: (id: string) => void;
  className?: string;
}

export default function ImageThumbnails({ images, onRemoveImage, className }: ImageThumbnailsProps) {
  if (images.length === 0) return null;

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-sm font-semibold mb-3">Images ({images.length})</h3>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <div key={image.id} className="flex-shrink-0 relative group">
            <div className="w-16 h-16 rounded border overflow-hidden bg-muted">
              <img 
                src={image.uri} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover hover-elevate"
                data-testid={`thumbnail-${image.id}`}
              />
            </div>
            
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemoveImage(image.id)}
              data-testid={`button-remove-${image.id}`}
            >
              <X className="w-3 h-3" />
            </Button>
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}