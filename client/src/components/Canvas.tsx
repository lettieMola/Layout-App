
import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import { ImageIcon, Grid3X3 } from "lucide-react";
import { MirrorLayout, FilterOption, GridLayout } from "@shared/schema";

interface EditorImage {
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
interface EditorSticker {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
interface EditorText {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

interface CanvasProps {
  images: EditorImage[];
  layout: GridLayout | null;
  stickers?: EditorSticker[];
  texts?: EditorText[];
  className?: string;
  mirror?: MirrorLayout;
  filters?: FilterOption[];
  selectedFilter?: FilterOption | null;
}


const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ images, layout, stickers = [], texts = [], className, mirror, selectedFilter }, ref) => {
    if (mirror && images.length > 0) {
      const firstImage = images[0];
      const img = (transform = "") => <img src={firstImage.src} alt="Mirrored" className="w-full h-full object-cover" style={{ transform }} />;
      
      let mirrorContent;
      switch (mirror.type) {
        case "vertical": mirrorContent = <div className="w-full h-full grid grid-cols-2">{img()}{img("scaleX(-1)")}</div>; break;
        case "horizontal": mirrorContent = <div className="w-full h-full grid grid-rows-2">{img()}{img("scaleY(-1)")}</div>; break;
        case "quad": mirrorContent = <div className="w-full h-full grid grid-cols-2 grid-rows-2">{img()}{img("scaleX(-1)")}{img("scaleY(-1)")}{img("scale(-1, -1)")}</div>; break;
        default: mirrorContent = <div className="w-full h-full">{img()}</div>;
      }

      return (
        <Card className={`p-4 relative ${className}`} ref={ref} data-testid="canvas">
          <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden">{mirrorContent}</div>
        </Card>
      );
    }

    if (!layout) {
      return (
        <Card className={`p-4 ${className}`} ref={ref} data-testid="canvas">
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25">
            <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mb-4">
              <Grid3X3 className="w-8 h-8 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Choose Your Layout</h3>
            <p className="text-sm text-center max-w-xs">Select a layout from the options above to start creating your collage</p>
          </div>
        </Card>
      );
    }

    if (images.length === 0) {
      return (
        <Card className={`p-4 ${className}`} ref={ref} data-testid="canvas">
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium">Add images to create your collage</p>
          </div>
        </Card>
      );
    }

    // Render layout cells with images
    return (
      <Card className={`p-4 relative ${className}`} ref={ref} data-testid="canvas">
        <div className="grid gap-1 w-full h-64 p-2" style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)`, gridTemplateRows: `repeat(${layout.rows}, 1fr)` }}>
          {layout.layout.flat().map((cell: number, idx: number) => {
            if (cell === 0) return <div key={idx} className="bg-transparent" />;
            const imageIndex = (cell - 1) % images.length;
            const image = images[imageIndex];
            return (
              <div key={idx} className="bg-muted rounded overflow-hidden">
                {image && (
                  <img
                    src={image.src}
                    alt={`Collage part ${idx}`}
                    className="w-full h-full object-cover"
                    style={{
                      filter: selectedFilter?.css || undefined,
                      WebkitFilter: selectedFilter?.css || undefined
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* Stickers */}
        {stickers.map((sticker) => (
          <img
            key={sticker.id}
            src={sticker.src}
            alt="sticker"
            className="absolute cursor-move"
            style={{ left: sticker.x, top: sticker.y, width: sticker.width, height: sticker.height }}
          />
        ))}
        {/* Text overlays */}
        {texts.map((text) => (
          <div
            key={text.id}
            className="absolute cursor-move"
            style={{
              left: text.x,
              top: text.y,
              fontSize: text.fontSize,
              color: text.color,
              fontFamily: text.fontFamily,
            }}
          >
            {text.text}
          </div>
        ))}
      </Card>
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;