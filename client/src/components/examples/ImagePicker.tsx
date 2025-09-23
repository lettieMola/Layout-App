import ImagePicker from '../ImagePicker';

export default function ImagePickerExample() {
  const handleImageSelect = (img: any) => {
    console.log('Image selected:', img);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <ImagePicker onImageSelect={handleImageSelect} />
    </div>
  );
}