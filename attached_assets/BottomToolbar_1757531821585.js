import React from "react";
import { FaSyncAlt, FaArrowsAltH, FaArrowsAltV, FaMagic, FaSlidersH } from "react-icons/fa";
import "../App.css";

const BottomToolbar = ({ onRotate, onMirror, onFlip, onFilters, onAdjust }) => {
  return (
    <div className="bottom-toolbar">
      <button onClick={onRotate}>
        <FaSyncAlt className="toolbar-icon" />
        <span>Rotate</span>
      </button>
      <button onClick={onMirror}>
        <FaArrowsAltH className="toolbar-icon" />
        <span>Mirror</span>
      </button>
      <button onClick={onFlip}>
        <FaArrowsAltV className="toolbar-icon" />
        <span>Flip</span>
      </button>
      <button onClick={onFilters}>
        <FaMagic className="toolbar-icon" />
        <span>Filters</span>
      </button>
      <button onClick={onAdjust}>
        <FaSlidersH className="toolbar-icon" />
        <span>Adjust</span>
      </button>
    </div>
  );
};

export default BottomToolbar;
