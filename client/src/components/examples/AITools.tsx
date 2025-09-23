import AITools from '../AITools';

export default function AIToolsExample() {
  // Mock images for demonstration
  const mockImages = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop' },
  ];

  const handleAiProcessComplete = (imageId: string, result: string, effectName: string) => {
    console.log('AI processing complete:', { imageId, result, effectName });
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <AITools 
        images={mockImages}
        onAiProcessComplete={handleAiProcessComplete} selectedImageId={null} onImageSelect={function (imageId: string | null): void {
          throw new Error('Function not implemented.');
        } }      />
    </div>
  );
}