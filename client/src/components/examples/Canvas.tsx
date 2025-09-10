import Canvas from '../Canvas';
import { GRID_LAYOUTS } from '@/lib/constants';

export default function CanvasExample() {
  // Mock images for demonstration
  const mockImages = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop' },
  ];

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Grid Layout Example</h3>
        <Canvas 
          images={mockImages}
          layout={GRID_LAYOUTS[2]} // 2x2 grid
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Mirror Layout Example</h3>
        <Canvas 
          images={[mockImages[0]]}
          layout={null}
          mirror={{ type: 'vertical', parts: 2 }}
        />
      </div>
    </div>
  );
}