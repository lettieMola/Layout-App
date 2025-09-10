import React from 'react';

const TopToolbar = ({ onUndo, onRedo, onReset, onDownload, onSave, canUndo, canRedo }) => {
  return (
    <div className="top-toolbar">
      <button onClick={onUndo} disabled={!canUndo}>
        <i className="fas fa-undo"></i> Undo
      </button>
      <button onClick={onRedo} disabled={!canRedo}>
        <i className="fas fa-redo"></i> Redo
      </button>
      <button onClick={onReset}>
        <i className="fas fa-sync-alt"></i> Reset
      </button>
      <button onClick={onSave}>
        <i className="fas fa-save"></i> Save
      </button>
      <button onClick={onDownload}>
        <i className="fas fa-download"></i> Download
      </button>
    </div>
  );
};

export default TopToolbar;