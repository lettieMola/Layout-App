import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterOption } from "@shared/schema";
import { FILTER_OPTIONS } from "@/lib/constants";
import { Filter } from "lucide-react";

interface FilterControlsProps {
  onFilterSelect: (filter: FilterOption) => void;
  selectedFilter?: FilterOption | null;
  className?: string;
}

export default function FilterControls({ onFilterSelect, selectedFilter, className }: FilterControlsProps) {
  const getFilterPreview = (filter: FilterOption) => {
    // Create a simple visual representation of the filter
    const baseClass = "w-8 h-8 rounded border-2";
    
    switch (filter.name.toLowerCase()) {
      case 'original':
        return <div className={`${baseClass} bg-gradient-to-br from-gray-100 to-gray-300`} />;
      case 'clarendon':
        return <div className={`${baseClass} bg-gradient-to-br from-blue-200 to-blue-400`} />;
      case 'gingham':
        return <div className={`${baseClass} bg-gradient-to-br from-pink-200 to-pink-400`} />;
      case 'moon':
        return <div className={`${baseClass} bg-gradient-to-br from-gray-300 to-gray-600`} />;
      case 'lark':
        return <div className={`${baseClass} bg-gradient-to-br from-yellow-200 to-yellow-400`} />;
      case 'reyes':
        return <div className={`${baseClass} bg-gradient-to-br from-amber-200 to-amber-400`} />;
      case 'juno':
        return <div className={`${baseClass} bg-gradient-to-br from-green-200 to-green-400`} />;
      case 'slumber':
        return <div className={`${baseClass} bg-gradient-to-br from-purple-200 to-purple-400`} />;
      case 'crema':
        return <div className={`${baseClass} bg-gradient-to-br from-orange-200 to-orange-400`} />;
      case 'ludwig':
        return <div className={`${baseClass} bg-gradient-to-br from-red-200 to-red-400`} />;
      default:
        return <div className={`${baseClass} bg-gradient-to-br from-gray-100 to-gray-300`} />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {FILTER_OPTIONS.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter?.id === filter.id ? "default" : "outline"}
              className="flex flex-col gap-2 h-auto py-3 hover-elevate"
              onClick={() => onFilterSelect(filter)}
              data-testid={`button-filter-${filter.id}`}
            >
              {getFilterPreview(filter)}
              <span className="text-xs font-medium text-center">{filter.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}