import Canvas from '../Canvas';
import { GRID_LAYOUTS } from '@/lib/constants';
import { GridLayout } from '@shared/schema';

export default function CanvasExample() {
  // Mock images for demonstration (match EditorImage shape)
  const mockImages = [
    { id: '1', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', x: 0, y: 0, width: 200, height: 200 },
    { id: '2', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop', x: 0, y: 0, width: 200, height: 200 },
    { id: '3', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', x: 0, y: 0, width: 200, height: 200 },
  ];

  const gridLayout2x2: GridLayout = {
    id: 'grid-2x2',
    name: '2x2',
    shape: 'rect',
    rows: 2,
    cols: 2,
    layout: [
      [0, 1],
      [2, 3]
    ]
  };

  const singleLayout: GridLayout = {
    id: 'single',
    name: 'Single',
    shape: 'rect',
    rows: 1,
    cols: 1,
    layout: [[0]]
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Grid Layout Example</h3>
        <Canvas 
          images={mockImages}
          layout={gridLayout2x2}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Single Image Example</h3>
        <Canvas 
          images={[mockImages[0]]}
          layout={singleLayout}
        />
      </div>
    </div>
  );
}