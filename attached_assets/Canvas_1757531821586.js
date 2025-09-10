import React from 'react';

const Canvas = ({ images, layout, mirror, filters, onRef }) => {
  const applyFilters = (imageUri) => {
    return imageUri;
  };

  const renderMirrorLayout = () => {
    if (images.length === 0) {
      return (
        <div className="placeholder">
          <i className="fas fa-image"></i>
          <p>Upload images to create your collage</p>
        </div>
      );
    }

    const imageUri = images[0].uri;
    
    switch (mirror.type) {
      case 'vertical':
        return (
          <div className="mirror-container vertical">
            <div className="mirror-part">
              <img src={applyFilters(imageUri)} alt="Original" />
            </div>
            <div className="mirror-part">
              <img src={applyFilters(imageUri)} alt="Mirrored" style={{ transform: 'scaleX(-1)' }} />
            </div>
          </div>
        );
      case 'horizontal':
        return (
          <div className="mirror-container horizontal">
            <div className="mirror-part">
              <img src={applyFilters(imageUri)} alt="Original" />
            </div>
            <div className="mirror-part">
              <img src={applyFilters(imageUri)} alt="Mirrored" style={{ transform: 'scaleY(-1)' }} />
            </div>
          </div>
        );
      case 'quad':
        return (
          <div className="mirror-container quad">
            <div className="mirror-row">
              <div className="mirror-part">
                <img src={applyFilters(imageUri)} alt="Original" />
              </div>
              <div className="mirror-part">
                <img src={applyFilters(imageUri)} alt="Mirrored" style={{ transform: 'scaleX(-1)' }} />
              </div>
            </div>
            <div className="mirror-row">
              <div className="mirror-part">
                <img src={applyFilters(imageUri)} alt="Mirrored" style={{ transform: 'scaleY(-1)' }} />
              </div>
              <div className="mirror-part">
                <img src={applyFilters(imageUri)} alt="Mirrored" style={{ transform: 'scale(-1, -1)' }} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderGridLayout = () => {
    if (!layout) {
      return (
        <div className="placeholder">
          <i className="fas fa-th"></i>
          <p>Select a layout to start</p>
        </div>
      );
    }

    if (images.length === 0) {
      return (
        <div className="placeholder">
          <i className="fas fa-image"></i>
          <p>Add images to create your collage</p>
        </div>
      );
    }

    return (
      <div className={`layout-container ${layout.shape}`}>
        {layout.layout.flat().map((cell, index) => {
          if (cell === 0) return null;
          
          const imageIndex = (cell - 1) % images.length;
          const imageUri = images[imageIndex]?.uri;
          
          return (
            <div key={index} className="layout-cell">
              {imageUri && (
                <img 
                  src={applyFilters(imageUri)} 
                  alt={`Collage part ${index}`} 
                  className="collage-image"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderLayout = () => {
    if (mirror) {
      return renderMirrorLayout();
    } else {
      return renderGridLayout();
    }
  };

  return (
    <div className="canvas" ref={onRef}>
      {renderLayout()}
    </div>
  );
};

export default Canvas;