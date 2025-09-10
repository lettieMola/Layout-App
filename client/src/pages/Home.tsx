import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DESIGN_OPTIONS, GRID_LAYOUTS } from "@/lib/constants";
import { Search, Grid3X3, Palette, Settings, Instagram, MessageCircle, Award, User } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const getDesignIcon = (iconName: string) => {
    switch (iconName) {
      case 'grid-3x3':
        return <Grid3X3 className="w-6 h-6" />;
      case 'palette':
        return <Palette className="w-6 h-6" />;
      case 'settings':
        return <Settings className="w-6 h-6" />;
      case 'instagram':
        return <Instagram className="w-6 h-6" />;
      case 'message-circle':
        return <MessageCircle className="w-6 h-6" />;
      case 'award':
        return <Award className="w-6 h-6" />;
      case 'user':
        return <User className="w-6 h-6" />;
      default:
        return <Grid3X3 className="w-6 h-6" />;
    }
  };

  const handleGridSelect = (layoutId: string) => {
    setLocation(`/editor?layout=${layoutId}`);
  };

  const handleDesignOptionSelect = (optionId: string) => {
    console.log('Selected design option:', optionId);
    setLocation('/editor');
  };

  const renderLayoutPreview = (layout: any) => {
    return (
      <div className="grid gap-px w-12 h-12 p-2">
        {layout.layout.map((row: number[], rowIndex: number) => (
          <div key={rowIndex} className="flex gap-px">
            {row.map((cell: number, colIndex: number) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex-1 aspect-square rounded-sm ${
                  cell > 0 ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Collage Creator</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Birthday, Love, Sale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Design Options */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">All Tools</h2>
          <div className="grid grid-cols-4 gap-3">
            {DESIGN_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="flex flex-col gap-2 h-auto py-4 hover-elevate"
                onClick={() => handleDesignOptionSelect(option.id)}
                data-testid={`button-design-${option.id}`}
              >
                {getDesignIcon(option.icon)}
                <span className="text-xs font-medium text-center">{option.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Collage</h2>
          <div className="flex gap-2">
            <Badge variant="secondary" className="hover-elevate">Beauty</Badge>
            <Badge variant="secondary" className="hover-elevate">Colour</Badge>
          </div>
        </div>

        {/* Grid Layouts */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Grid Layouts</h2>
          <div className="grid grid-cols-3 gap-3">
            {GRID_LAYOUTS.slice(0, 6).map((layout) => (
              <Card 
                key={layout.id} 
                className="hover-elevate cursor-pointer"
                onClick={() => handleGridSelect(layout.id)}
              >
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  {renderLayoutPreview(layout)}
                  <span className="text-xs font-medium text-center">{layout.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setLocation('/editor')}
            data-testid="button-view-all-layouts"
          >
            View All Layouts
          </Button>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                size="lg" 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => setLocation('/editor')}
                data-testid="button-quick-start"
              >
                <span className="text-lg">Create New</span>
                <span className="text-xs opacity-75">Start fresh collage</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => setLocation('/gallery')}
                data-testid="button-view-gallery"
              >
                <span className="text-lg">My Gallery</span>
                <span className="text-xs opacity-75">View saved collages</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}