import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, Copy, Bot, Filter, Image } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  imageCount?: number;
  className?: string;
}

export default function BottomNavigation({ 
  activeTab, 
  onTabChange, 
  imageCount = 0, 
  className 
}: BottomNavigationProps) {
  const tabs = [
    { id: 'images', label: 'Images', icon: Image },
    { id: 'layouts', label: 'Layouts', icon: Grid3X3 },
    { id: 'mirror', label: 'Mirror', icon: Copy },
    { id: 'filters', label: 'Filters', icon: Filter },
    { id: 'ai', label: 'AI Tools', icon: Bot },
  ];

  return (
    <Card className={`p-2 ${className}`}>
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col gap-1 h-auto py-2 hover-elevate relative"
              data-testid={`button-tab-${tab.id}`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.id === 'images' && imageCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-4 h-4 p-0 text-xs"
                  >
                    {imageCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}