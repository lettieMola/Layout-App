import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useCollageStore } from '../store/useCollageStore';
import Canvas from '../components/Canvas';
import ImagePicker from '../components/ImagePicker';
import MirroringControls from '../components/MirroringControls';
import TopToolbar from '../components/TopToolbar';
import AICapabilities from '../components/AICapabilities';
import LayoutSelector from '../components/LayoutSelector';

const EditorScreen = () => {
  const {
    images,
    selectedLayout,
    selectedMirror,
    addImage,
    removeImage,
    setLayout,
    setMirrorLayout,
    undo,
    redo,
    reset,
    saveProject,
    canUndo,
    canRedo
  } = useCollageStore();

  const [activeTab, setActiveTab] = useState('layouts');
  const [notification, setNotification] = useState(null);
  const canvasRef = useRef();

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownload = async () => {
    if (canvasRef.current) {
      try {
        const dataUrl = await toPng(canvasRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = 'collage.png';
        link.href = dataUrl;
        link.click();
        showNotification('Collage downloaded successfully!');
      } catch (error) {
        console.error('Error downloading image:', error);
        showNotification('Error downloading collage');
      }
    }
  };

  const handleAiProcessComplete = (imageIndex, result, effectName) => {
    const updatedImages = [...images];
    updatedImages[imageIndex] = {
      ...updatedImages[imageIndex],
      uri: result
    };
    
    showNotification(`${effectName} applied successfully!`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai':
        return <AICapabilities images={images} onAiProcessComplete={handleAiProcessComplete} />;
      case 'mirror':
        return <MirroringControls mirrorLayout={selectedMirror} onLayoutChange={setMirrorLayout} />;
      case 'layouts':
        return <LayoutSelector onLayoutSelect={setLayout} />;
      default:
        return <LayoutSelector onLayoutSelect={setLayout} />;
    }
  };

  return (
    <div className="editor-screen">
      <TopToolbar
        onUndo={undo}
        onRedo={redo}
        onReset={reset}
        onDownload={handleDownload}
        onSave={saveProject}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      <div className="editor-content">
        <div className="canvas-container">
          <Canvas
            images={images}
            layout={selectedLayout}
            mirror={selectedMirror}
            onRef={canvasRef}
          />
          
          <ImagePicker onImageSelect={addImage} />
          
          {images.length > 0 && (
            <div className="image-thumbnails">
              {images.map((image, index) => (
                <div key={image.id} className="thumbnail">
                  <img src={image.uri} alt={`Thumbnail ${index}`} />
                  <button onClick={() => removeImage(image.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="editor-controls">
          <div className="control-tabs">
            <button 
              className={activeTab === 'layouts' ? 'active' : ''}
              onClick={() => setActiveTab('layouts')}
            >
              <i className="fas fa-th"></i> Layouts
            </button>
            <button 
              className={activeTab === 'mirror' ? 'active' : ''}
              onClick={() => setActiveTab('mirror')}
            >
              <i className="fas fa-copy"></i> Mirror
            </button>
            <button 
              className={activeTab === 'ai' ? 'active' : ''}
              onClick={() => setActiveTab('ai')}
            >
              <i className="fas fa-robot"></i> AI Tools
            </button>
          </div>
          
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {notification && (
        <div className="notification">
          <i className="fas fa-check-circle"></i>
          {notification}
        </div>
      )}
    </div>
    
  );
};

export default EditorScreen;