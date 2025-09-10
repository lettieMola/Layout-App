import FilterControls from '../FilterControls';
import { useState } from 'react';
import { FilterOption } from '@shared/schema';

export default function FilterControlsExample() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(null);

  const handleFilterSelect = (filter: FilterOption) => {
    console.log('Filter selected:', filter);
    setSelectedFilter(filter);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <FilterControls 
        onFilterSelect={handleFilterSelect}
        selectedFilter={selectedFilter}
      />
    </div>
  );
}