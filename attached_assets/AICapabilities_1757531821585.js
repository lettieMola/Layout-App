import React, { useState } from 'react';
import { aiService } from '../services/aiService';

const AICapabilities = ({ images, onAiProcessComplete }) => {
  const [assistantMessage, setAssistantMessage] = useState(null);

  const aiCapabilities = [
    { id: 'ai-1', name: 'BG Removal', description: 'Remove image background automatically', icon: 'fas fa-cut' },
    { id: 'ai-2', name: 'Style Transfer', description: 'Apply artistic styles to your images', icon: 'fas fa-paint-brush' },
    { id: 'ai-3', name: 'Face Enhance', description: 'Enhance facial features automatically', icon: 'fas fa-smile' },
    { id: 'ai-4', name: 'Object Recog', description: 'Identify and tag objects in images', icon: 'fas fa-tags' },
    { id: 'ai-5', name: 'Colorize', description: 'Add color to black and white photos', icon: 'fas fa-palette' },
    { id: 'ai-6', name: 'Upscale', description: 'Increase image resolution', icon: 'fas fa-search-plus' }
  ];

  const handleAiAction = async (capability, imageIndex = 0) => {
    if (images.length === 0) {
      alert('Please add an image first');
      return;
    }

    const imageUri = images[imageIndex].uri;

    // Show assistant "working" message
    setAssistantMessage(`🤖 Applying ${capability.name}... please wait`);

    try {
      let result;
      switch (capability.id) {
        case 'ai-1':
          result = await aiService.removeBackground(imageUri);
          break;
        case 'ai-2':
          result = await aiService.applyStyle(imageUri, 'vintage');
          break;
        case 'ai-3':
          result = await aiService.enhanceFaces(imageUri);
          break;
        case 'ai-4':
          result = await aiService.recognizeObjects(imageUri);
          setAssistantMessage(`✅ Objects detected: ${result.join(', ')}`);
          setTimeout(() => setAssistantMessage(null), 5000); // Clear message after 5s
          return;
        case 'ai-5':
          result = await aiService.colorizeImage(imageUri);
          break;
        case 'ai-6':
          result = await aiService.upscaleImage(imageUri);
          break;
        default:
          return;
      }

      // Success message
      setAssistantMessage(`✅ ${capability.name} applied successfully!`);
      onAiProcessComplete(imageIndex, result, capability.name);

    } catch (error) {
      console.error('AI processing error:', error);
      setAssistantMessage('❌ AI processing failed. Please try again.');
    } finally {
        // Clear the message after 5 seconds
        setTimeout(() => setAssistantMessage(null), 5000);
    }
  };

  return (
    <div className="ai-capabilities">
      <h3><i className="fas fa-robot"></i> AI Tools</h3>
      <div className="ai-grid">
        {aiCapabilities.map(capability => (
          <div 
            key={capability.id} 
            className="ai-item"
            onClick={() => handleAiAction(capability)}
            title={capability.description}
          >
            <div className="ai-icon">
              <i className={capability.icon}></i>
            </div>
            <div className="ai-name">{capability.name}</div>
          </div>
        ))}
      </div>

      {assistantMessage && (
        <div className="ai-assistant-panel">
          {assistantMessage}
        </div>
      )}
    </div>
  );
};

export default AICapabilities;