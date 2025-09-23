import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DESIGN_OPTIONS, GRID_LAYOUTS } from '../constants/layouts';

const HomeScreen = () => {
  const navigate = useNavigate();

  const handleGridSelect = (layout) => {
    navigate('/editor', { state: { layout } });
  };

  const handleDesignOptionSelect = (option) => {
    // Handle different design options
    console.log('Selected option:', option);
    navigate('/editor');
  };

  return (
    <div className="home-screen">
      <h1># Search layout, Styles, Grid...</h1>
      
      <div className="design-options">
        <h2>All Tools</h2>
        <div className="options-grid">
          {DESIGN_OPTIONS.map(option => (
            <div 
              key={option.id} 
              className="design-option"
              onClick={() => handleDesignOptionSelect(option)}
            >
              <span className="option-icon">{option.icon}</span>
              <span className="option-name">{option.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="category-section">
        <h2>Callage</h2>
        <div className="category-tags">
          <span className="category-tag">Beauty</span>
          <span className="category-tag">Colour</span>
        </div>
      </div>

      <div className="grid-section">
        <h2>Grid</h2>
        <div className="grid-list">
          {GRID_LAYOUTS.map(layout => (
            <div 
              key={layout.id} 
              className="grid-item" 
              onClick={() => handleGridSelect(layout)}
            >
              <div className="grid-preview">
                {layout.name}
              </div>
              <span>{layout.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;