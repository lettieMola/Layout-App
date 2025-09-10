import { useState } from 'react';

export const useCollageStore = () => {
  const [images, setImages] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedMirror, setSelectedMirror] = useState({ type: 'vertical', parts: 2 });
  const [filters, setFilters] = useState([]);
  const [aiEffects, setAiEffects] = useState([]);
  const [history, setHistory] = useState([{ images: [], layout: null, filters: [], mirror: { type: 'vertical', parts: 2 } }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addImage = (uri) => {
    const newImages = [...images, { id: Date.now(), uri }];
    const newHistory = history.slice(0, historyIndex + 1);
    const currentState = { images: newImages, selectedLayout, filters, aiEffects, mirror: selectedMirror };
    
    setImages(newImages);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  const removeImage = (id) => {
    const newImages = images.filter(img => img.id !== id);
    const newHistory = history.slice(0, historyIndex + 1);
    const currentState = { images: newImages, selectedLayout, filters, aiEffects, mirror: selectedMirror };
    
    setImages(newImages);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  const setLayout = (layout) => {
    const newHistory = history.slice(0, historyIndex + 1);
    const currentState = { images, selectedLayout: layout, filters, aiEffects, mirror: selectedMirror };
    
    setSelectedLayout(layout);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  const setMirrorLayout = (mirror) => {
    const newHistory = history.slice(0, historyIndex + 1);
    const currentState = { images, selectedLayout, filters, aiEffects, mirror };
    
    setSelectedMirror(mirror);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  const addFilter = (filter) => {
    const newFilters = [...filters, filter];
    const newHistory = history.slice(0, historyIndex + 1);
    const currentState = { images, selectedLayout, filters: newFilters, aiEffects, mirror: selectedMirror };
    
    setFilters(newFilters);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  const removeFilter = (filterId) => {
    const newFilters = filters.filter(f => f.id !== filterId);
    const newHistory = history.slice(0, historyIndex + 1);
    const currentState = { images, selectedLayout, filters: newFilters, aiEffects, mirror: selectedMirror };
    
    setFilters(newFilters);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  const addAiEffect = (effect) => {
    const newAiEffects = [...aiEffects, effect];
    const newHistory = history.slice(0, historyIndex + 1);
    const currentState = { images, selectedLayout, filters, aiEffects: newAiEffects, mirror: selectedMirror };
    
    setAiEffects(newAiEffects);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setImages(previousState.images);
      setSelectedLayout(previousState.selectedLayout);
      setFilters(previousState.filters);
      setAiEffects(previousState.aiEffects);
      setSelectedMirror(previousState.mirror);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setImages(nextState.images);
      setSelectedLayout(nextState.selectedLayout);
      setFilters(nextState.filters);
      setAiEffects(nextState.aiEffects);
      setSelectedMirror(nextState.mirror);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const reset = () => {
    setImages([]);
    setSelectedLayout(null);
    setFilters([]);
    setAiEffects([]);
    setSelectedMirror({ type: 'vertical', parts: 2 });
    setHistory([{ images: [], layout: null, filters: [], aiEffects: [], mirror: { type: 'vertical', parts: 2 } }]);
    setHistoryIndex(0);
  };

  const saveProject = () => {
    const projectData = {
      images,
      selectedLayout,
      filters,
      aiEffects,
      mirror: selectedMirror,
      timestamp: Date.now()
    };
    localStorage.setItem(`collage-project-${Date.now()}`, JSON.stringify(projectData));
    return projectData;
  };

  const loadProject = (projectData) => {
    setImages(projectData.images);
    setSelectedLayout(projectData.selectedLayout);
    setFilters(projectData.filters);
    setAiEffects(projectData.aiEffects);
    setSelectedMirror(projectData.mirror);
    setHistory([projectData]);
    setHistoryIndex(0);
  };

  return {
    images,
    selectedLayout,
    selectedMirror,
    filters,
    aiEffects,
    addImage,
    removeImage,
    setLayout,
    setMirrorLayout,
    addFilter,
    removeFilter,
    addAiEffect,
    undo,
    redo,
    reset,
    saveProject,
    loadProject,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};