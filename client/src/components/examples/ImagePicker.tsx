import ImagePicker from '../ImagePicker';

export default function ImagePickerExample() {
  const handleImageSelect = (uri: string) => {
    console.log('Image selected:', uri);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <ImagePicker onImageSelect={handleImageSelect} />
    </div>
  );
}