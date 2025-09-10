import { forwardRef, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { CollageImage, GridLayout, MirrorLayout } from "@shared/schema";
import { ImageIcon, Grid3X3 } from "lucide-react";

interface CanvasProps {
  images: CollageImage[];
  layout: GridLayout | null;
  mirror?: MirrorLayout;
  filters?: any[];
  className?: string;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ images, layout, mirror, filters, className }, ref) => {
    const renderMirrorLayout = () => {
      if (images.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mb-2" />
            <p>Upload images to create your collage</p>
          </div>
        );
      }

      const imageUri = images[0].uri;
      
      switch (mirror?.type) {
        case 'vertical':
          return (
            <div className="flex w-full h-64">
              <div className="flex-1">
                <img src={imageUri} alt="Original" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <img 
                  src={imageUri} 
                  alt="Mirrored" 
                  className="w-full h-full object-cover scale-x-[-1]" 
                />
              </div>
            </div>
          );
        case 'horizontal':
          return (
            <div className="flex flex-col w-full h-64">
              <div className="flex-1">
                <img src={imageUri} alt="Original" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <img 
                  src={imageUri} 
                  alt="Mirrored" 
                  className="w-full h-full object-cover scale-y-[-1]" 
                />
              </div>
            </div>
          );
        case 'quad':
          return (
            <div className="grid grid-cols-2 grid-rows-2 w-full h-64">
              <img src={imageUri} alt="Original" className="w-full h-full object-cover" />
              <img src={imageUri} alt="Mirrored X" className="w-full h-full object-cover scale-x-[-1]" />
              <img src={imageUri} alt="Mirrored Y" className="w-full h-full object-cover scale-y-[-1]" />
              <img src={imageUri} alt="Mirrored XY" className="w-full h-full object-cover scale-[-1]" />
            </div>
          );
        default:
          return (
            <div className="w-full h-64">
              <img src={imageUri} alt="Single" className="w-full h-full object-cover" />
            </div>
          );
      }
    };

    const renderGridLayout = () => {
      if (!layout) {
        return (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Grid3X3 className="w-12 h-12 mb-2" />
            <p>Select a layout to start</p>
          </div>
        );
      }

      if (images.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mb-2" />
            <p>Add images to create your collage</p>
          </div>
        );
      }

      const gridStyle = {
        gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
      };

      return (
        <div className="grid gap-1 w-full h-64 p-2" style={gridStyle}>
          {layout.layout.flat().map((cell, index) => {
            if (cell === 0) return <div key={index} className="bg-transparent" />;
            
            const imageIndex = (cell - 1) % images.length;
            const imageUri = images[imageIndex]?.uri;
            
            return (
              <div key={index} className="bg-muted rounded overflow-hidden">
                {imageUri && (
                  <img 
                    src={imageUri} 
                    alt={`Collage part ${index}`} 
                    className="w-full h-full object-cover hover-elevate"
                    data-testid={`image-cell-${index}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <Card className={`p-4 ${className}`} ref={ref} data-testid="canvas">
        <div className="space-y-4">
          {mirror ? renderMirrorLayout() : renderGridLayout()}
        </div>
      </Card>
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;