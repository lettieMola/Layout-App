import React from 'react';

const ImagePicker = ({ onImageSelect }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-picker">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="image-upload"
      />
      <label htmlFor="image-upload" className="upload-button">
        <i className="fas fa-upload"></i> Upload Image
      </label>
    </div>
  );
};

export default ImagePicker;