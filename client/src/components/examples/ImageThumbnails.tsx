import ImageThumbnails from '../ImageThumbnails';

export default function ImageThumbnailsExample() {
  // Mock images for demonstration (EditorImage shape)
  const mockImages = [
    { id: '1', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', x: 0, y: 0, width: 120, height: 120 },
    { id: '2', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop', x: 0, y: 0, width: 120, height: 120 },
    { id: '3', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', x: 0, y: 0, width: 120, height: 120 },
  ];

  const handleRemoveImage = (id: string) => {
    console.log('Remove image:', id);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <ImageThumbnails 
        images={mockImages}
        onRemoveImage={handleRemoveImage}
      />
    </div>
  );
}