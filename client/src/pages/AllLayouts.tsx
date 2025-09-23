import { GRID_LAYOUTS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function AllLayouts() {
  const [, setLocation] = useLocation();

  const handleGridSelect = (layoutId: string) => {
    setLocation(`/editor?layout=${layoutId}`);
  };

  const renderLayoutPreview = (layout: any) => {
    return (
      <div className="grid gap-px w-16 h-16 p-2">
        {layout.layout.map((row: number[], rowIndex: number) => (
          <div key={rowIndex} className="flex gap-px">
            {row.map((cell: number, colIndex: number) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex-1 aspect-square rounded-sm ${cell > 0 ? 'bg-foreground/20' : 'bg-muted'
                  }`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/')}><ArrowLeft /></Button>
          <h1 className="text-2xl font-bold">All Layouts</h1>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {GRID_LAYOUTS.map((layout) => (
            <Card key={layout.id} className="hover-elevate cursor-pointer" onClick={() => handleGridSelect(layout.id)}>
              <CardContent className="p-2 flex flex-col items-center gap-2">
                {renderLayoutPreview(layout)}
                <span className="text-xs font-medium text-center">{layout.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}