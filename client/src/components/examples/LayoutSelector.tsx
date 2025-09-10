import LayoutSelector from '../LayoutSelector';
import { useState } from 'react';
import { GridLayout } from '@shared/schema';

export default function LayoutSelectorExample() {
  const [selectedLayout, setSelectedLayout] = useState<GridLayout | null>(null);

  const handleLayoutSelect = (layout: GridLayout) => {
    console.log('Layout selected:', layout);
    setSelectedLayout(layout);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <LayoutSelector 
        onLayoutSelect={handleLayoutSelect} 
        selectedLayout={selectedLayout}
      />
    </div>
  );
}