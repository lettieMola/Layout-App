import React from 'react';
import { GRID_LAYOUTS } from '../constants/layouts';

const LayoutSelector = ({ onLayoutSelect }) => {
  const renderLayoutPreview = (layout) => {
    return (
      <div className={`layout-preview ${layout.shape}`}>
        {layout.layout.flat().map((cell, index) => (
          cell > 0 ? <div key={index} className="layout-cell"></div> : <div key={index} className="empty-cell"></div>
        ))}
      </div>
    );
  };

  return (
    <div className="layout-selector">
      <h3><i className="fas fa-th"></i> Grid Layouts</h3>
      <div className="layout-grid">
        {GRID_LAYOUTS.map(layout => (
          <div 
            key={layout.id} 
            className="layout-item"
            onClick={() => onLayoutSelect(layout)}
          >
            {renderLayoutPreview(layout)}
            <span>{layout.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;