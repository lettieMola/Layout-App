import React from 'react';

const MirroringControls = ({ mirrorLayout, onLayoutChange }) => {
  const mirrorLayouts = [
    { id: 'mirror-1', name: 'Vertical', type: 'vertical', parts: 2 },
    { id: 'mirror-2', name: 'Horizontal', type: 'horizontal', parts: 2 },
    { id: 'mirror-3', name: 'Quad', type: 'quad', parts: 4 },
    { id: 'mirror-4', name: 'Vertical 3', type: 'vertical', parts: 3 },
    { id: 'mirror-5', name: 'Horizontal 3', type: 'horizontal', parts: 3 }
  ];

  return (
    <div className="mirroring-controls">
      <h3><i className="fas fa-copy"></i> Mirroring Options</h3>
      <div className="controls-grid">
        {mirrorLayouts.map((layout, index) => (
          <div
            key={layout.id}
            className={`control-item ${mirrorLayout.type === layout.type && mirrorLayout.parts === layout.parts ? 'active' : ''}`}
            onClick={() => onLayoutChange(layout)}
          >
            <div className="control-preview">
              {layout.type === 'vertical' && (
                <div className="preview-vertical">
                  <div className="preview-part"></div>
                  <div className="preview-part mirrored"></div>
                </div>
              )}
              {layout.type === 'horizontal' && (
                <div className="preview-horizontal">
                  <div className="preview-part"></div>
                  <div className="preview-part mirrored"></div>
                </div>
              )}
              {layout.type === 'quad' && (
                <div className="preview-quad">
                  <div className="preview-row">
                    <div className="preview-part"></div>
                    <div className="preview-part mirrored"></div>
                  </div>
                  <div className="preview-row">
                    <div className="preview-part mirrored"></div>
                    <div className="preview-part mirrored"></div>
                  </div>
                </div>
              )}
            </div>
            <span>{layout.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MirroringControls;