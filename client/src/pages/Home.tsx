import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DESIGN_OPTIONS, GRID_LAYOUTS } from "@/lib/constants";
import { Search, Grid3X3, Palette, Settings, Instagram, MessageCircle, Award, User, Compass, PlusCircle, LayoutGrid, AppWindow, Sparkles, Home as HomeIcon, Heart, User as UserIcon } from "lucide-react";
import { useLocation, useRoute } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");

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
    if (optionId === 'design-2') {
      setLocation('/mirror');
    } else if (optionId === 'design-hd') {
      setLocation('/editor?tab=ai');
    } else {
      setLocation('/editor');
    }
  };

  const renderLayoutPreview = (layout: any) => {
    return (
      <div className="grid gap-px w-12 h-12 p-2">
        {layout.layout.map((row: number[], rowIndex: number) => (
          <div key={rowIndex} className="flex gap-px">
            {row.map((cell: number, colIndex: number) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex-1 aspect-square rounded-sm ${cell > 0 ? 'bg-foreground/20' : 'bg-muted'}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        <Button
          variant={activeTab === "home" ? "default" : "ghost"}
          size="sm"
          className="flex flex-col gap-1 h-auto py-2"
          onClick={() => setActiveTab("home")}
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Button>
        <Button
          variant={activeTab === "search" ? "default" : "ghost"}
          size="sm"
          className="flex flex-col gap-1 h-auto py-2"
          onClick={() => setActiveTab("search")}
        >
          <Search className="w-5 h-5" />
          <span className="text-xs">Search</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex flex-col gap-1 h-auto py-2 rounded-full border-2 border-primary"
          onClick={() => setLocation('/editor')}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-xs">Create</span>
        </Button>
        <Button
          variant={activeTab === "heart" ? "default" : "ghost"}
          size="sm"
          className="flex flex-col gap-1 h-auto py-2"
          onClick={() => setActiveTab("heart")}
        >
          <Heart className="w-5 h-5" />
          <span className="text-xs">Activity</span>
        </Button>
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          size="sm"
          className="flex flex-col gap-1 h-auto py-2"
          onClick={() => setActiveTab("profile")}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-2">
          <h1 className="text-xl font-bold text-foreground">LayoutForge</h1>
          <Button variant="ghost" size="sm" onClick={() => setLocation('/gallery')}>
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates, layouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
            data-testid="input-search"
          />
        </div>

        {/* Stories/Highlights */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">FEATURED</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {DESIGN_OPTIONS.slice(0, 4).map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="flex flex-col gap-2 h-16 w-16 p-2 rounded-full hover-elevate flex-shrink-0"
                onClick={() => handleDesignOptionSelect(option.id)}
                data-testid={`button-design-${option.id}`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Grid Layouts */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Popular Layouts</h2>
          <div className="grid grid-cols-3 gap-3">
            {GRID_LAYOUTS.slice(0, 6).map((layout) => (
              <Card
                key={layout.id}
                className="hover-elevate cursor-pointer aspect-square"
                onClick={() => handleGridSelect(layout.id)}
              >
                <CardContent className="p-3 flex flex-col items-center justify-center gap-2 h-full">
                  {renderLayoutPreview(layout)}
                  <span className="text-xs font-medium text-center">{layout.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={() => setLocation('/layouts')}
            data-testid="button-view-all-layouts"
          >
            View All Layouts
          </Button>
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

      <BottomNavigation />
    </div>
  );
}
