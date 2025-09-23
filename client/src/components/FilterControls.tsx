import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterOption } from "@shared/schema";
import { Filter, Sparkles } from "lucide-react";

const FILTER_STYLES: { [key: string]: string } = {
  "Original": "",
  "Clarendon": "brightness(1.1) contrast(1.1) saturate(1.5)",
  "Gingham": "brightness(1.05) hue-rotate(350deg)",
  "Moon": "grayscale(1) brightness(1.1) contrast(1.1)",
  "Lark": "contrast(0.9) brightness(1.2) saturate(1.1)",
  "Reyes": "sepia(0.25) brightness(1.1) contrast(0.85) saturate(0.75)",
  "Juno": "contrast(1.2) brightness(1.1) saturate(1.3) hue-rotate(10deg)",
  "Slumber": "saturate(0.66) brightness(1.05) contrast(0.9)",
  "Crema": "sepia(0.5) contrast(0.9) brightness(1.1)",
  "Ludwig": "contrast(1.05) brightness(0.95) saturate(1.5)",
  "Aden": "contrast(0.9) brightness(1.2) saturate(0.85)",
  "Perpetua": "contrast(1.1) brightness(1.05) saturate(1.1)",
  "Amaro": "saturate(1.3) brightness(1.1) contrast(0.9)",
  "Mayfair": "contrast(1.1) brightness(1.15) saturate(1.1)",
  "Rise": "contrast(0.9) brightness(1.05) saturate(1.2)",
  "Hudson": "contrast(1.2) brightness(0.9) saturate(1.1)",
  "Valencia": "contrast(1.1) brightness(1.05) sepia(0.15)",
  "X-Pro II": "contrast(1.3) brightness(0.8) saturate(1.2)",
  "Sierra": "contrast(0.85) brightness(1.2) saturate(1.3)",
  "Willow": "grayscale(0.3) contrast(1.1) brightness(1.1)",
  "Lo-fi": "saturate(1.1) contrast(1.5)",
  "Inkwell": "grayscale(1) contrast(1.1) brightness(1.1)",
  "Hefe": "contrast(1.3) brightness(0.95) saturate(0.9)",
  "Nashville": "sepia(0.4) saturate(1.5) contrast(1.2)",
  "Stinson": "brightness(1.15) contrast(0.9) saturate(1.1)",
  "Vesper": "contrast(1.3) brightness(1.05) saturate(1.2)",
  "Earlybird": "sepia(0.2) brightness(1.15) contrast(0.9)",
  "Brannan": "contrast(1.4) brightness(0.9) saturate(1.2)",
  "Sutro": "brightness(1.1) contrast(1.2) saturate(0.8)",
  "Toaster": "sepia(0.3) saturate(1.5) contrast(0.9)",
  "Walden": "brightness(1.1) contrast(1.1) saturate(1.3)",
  "1977": "contrast(1.1) brightness(1.1) saturate(1.3) sepia(0.3)",
  "Kelvin": "contrast(1.1) brightness(1.15) saturate(1.2)",
  "Lofi": "saturate(1.1) contrast(1.5)",
  "Gotham": "contrast(1.2) brightness(0.9) saturate(1.1)",
};

interface FilterControlsProps {
  onFilterSelect: (filter: FilterOption | null) => void;
  selectedFilter?: FilterOption | null;
  className?: string;
}

export default function FilterControls({ onFilterSelect, selectedFilter, className }: FilterControlsProps) {
  const FILTER_OPTIONS: FilterOption[] = Object.keys(FILTER_STYLES).map((name, index) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    value: index,
    type: 'css',
    css: FILTER_STYLES[name]
  }));

  const handleFilterChange = (filterId: string) => {
    const filter = FILTER_OPTIONS.find(f => f.id === filterId);
    onFilterSelect(filterId === 'original' ? null : filter || null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            value={selectedFilter?.id || 'original'}
            onValueChange={handleFilterChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a filter" />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map((filter) => (
                <SelectItem key={filter.id} value={filter.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{
                        background: `linear-gradient(45deg, #f0f0f0, #d0d0d0)`,
                        filter: filter.css || 'none'
                      }}
                    />
                    {filter.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
