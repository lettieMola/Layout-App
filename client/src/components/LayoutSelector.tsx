import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GridLayout } from "@shared/schema";
import { GRID_LAYOUTS } from "@/lib/constants";
import { Grid3X3, Heart, Hexagon } from "lucide-react";

interface LayoutSelectorProps {
  onLayoutSelect: (layout: GridLayout) => void;
  selectedLayout?: GridLayout | null;
  className?: string;
}

export default function LayoutSelector({ onLayoutSelect, selectedLayout, className }: LayoutSelectorProps) {
  const getLayoutIcon = (shape: GridLayout['shape']) => {
    switch (shape) {
      case 'heart':
        return <Heart className="w-4 h-4" />;
      case 'hexagon':
        return <Hexagon className="w-4 h-4" />;
      default:
        return <Grid3X3 className="w-4 h-4" />;
    }
  };

  const renderLayoutPreview = (layout: GridLayout) => {
    return (
      <div className="grid gap-1 w-12 h-12 p-2">
        {layout.layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex-1 aspect-square rounded-sm ${
                  cell > 0 ? 'bg-primary/20' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5" />
          Grid Layouts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GRID_LAYOUTS.map((layout) => (
            <Button
              key={layout.id}
              variant={selectedLayout?.id === layout.id ? "default" : "outline"}
              className="flex flex-col gap-2 h-auto py-4 hover-elevate"
              onClick={() => onLayoutSelect(layout)}
              data-testid={`button-layout-${layout.id}`}
            >
              <div className="flex items-center gap-2">
                {getLayoutIcon(layout.shape)}
                <span className="text-xs font-medium">{layout.name}</span>
              </div>
              {renderLayoutPreview(layout)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}