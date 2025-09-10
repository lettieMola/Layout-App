import DriveIntegration from '../DriveIntegration';

export default function DriveIntegrationExample() {
  const handleCollageRestore = (collageData: any) => {
    console.log('Collage restored from Google Drive:', collageData);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <DriveIntegration 
        onCollageRestore={handleCollageRestore}
      />
    </div>
  );
}