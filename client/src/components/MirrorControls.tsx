import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MirrorLayout } from "@shared/schema";
import { MIRROR_LAYOUTS } from "@/lib/constants";
import { Copy, FlipHorizontal, FlipVertical, Grid2X2 } from "lucide-react";

interface MirrorControlsProps {
  mirrorLayout: MirrorLayout;
  onLayoutChange: (mirror: MirrorLayout) => void;
  className?: string;
}

export default function MirrorControls({ mirrorLayout, onLayoutChange, className }: MirrorControlsProps) {
  const getMirrorIcon = (type: MirrorLayout['type']) => {
    switch (type) {
      case 'horizontal':
        return <FlipHorizontal className="w-4 h-4" />;
      case 'quad':
        return <Grid2X2 className="w-4 h-4" />;
      case 'vertical':
      default:
        return <FlipVertical className="w-4 h-4" />;
    }
  };

  const getMirrorName = (layout: MirrorLayout) => {
    if (layout.type === 'vertical') {
      return layout.parts === 3 ? 'Vertical 3' : 'Vertical';
    }
    if (layout.type === 'horizontal') {
      return layout.parts === 3 ? 'Horizontal 3' : 'Horizontal';
    }
    return 'Quad';
  };

  const renderMirrorPreview = (layout: MirrorLayout) => {
    const baseClass = "bg-primary/20 rounded-sm";
    const mirroredClass = "bg-primary/40 rounded-sm";

    switch (layout.type) {
      case 'vertical':
        return (
          <div className="flex gap-1 w-12 h-8">
            <div className={baseClass + " flex-1"} />
            <div className={mirroredClass + " flex-1"} />
            {layout.parts === 3 && <div className={baseClass + " flex-1"} />}
          </div>
        );
      case 'horizontal':
        return (
          <div className="flex flex-col gap-1 w-8 h-12">
            <div className={baseClass + " flex-1"} />
            <div className={mirroredClass + " flex-1"} />
            {layout.parts === 3 && <div className={baseClass + " flex-1"} />}
          </div>
        );
      case 'quad':
        return (
          <div className="grid grid-cols-2 gap-1 w-8 h-8">
            <div className={baseClass} />
            <div className={mirroredClass} />
            <div className={mirroredClass} />
            <div className={baseClass} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Copy className="w-5 h-5" />
          Mirror Effects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MIRROR_LAYOUTS.map((layout, index) => (
            <Button
              key={`${layout.type}-${layout.parts}`}
              variant={
                mirrorLayout.type === layout.type && mirrorLayout.parts === layout.parts
                  ? "default"
                  : "outline"
              }
              className="flex flex-col gap-2 h-auto py-4 hover-elevate"
              onClick={() => onLayoutChange(layout)}
              data-testid={`button-mirror-${layout.type}-${layout.parts}`}
            >
              <div className="flex items-center gap-2">
                {getMirrorIcon(layout.type)}
                <span className="text-xs font-medium">{getMirrorName(layout)}</span>
              </div>
              {renderMirrorPreview(layout)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}