import { useState, useCallback } from 'react';
import { CollageImage, GridLayout, MirrorLayout, FilterOption } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface CollageState {
  images: CollageImage[];
  selectedLayout: GridLayout | null;
  selectedMirror: MirrorLayout;
  filters: FilterOption[];
  history: CollageState[];
  historyIndex: number;
}

export function useCollageStore() {
  const [state, setState] = useState<CollageState>({
    images: [],
    selectedLayout: null,
    selectedMirror: { type: 'vertical', parts: 2 },
    filters: [],
    history: [],
    historyIndex: 0,
  });

  const saveToHistory = useCallback((newState: Partial<CollageState>) => {
    setState(prev => {
      const updatedState = { ...prev, ...newState };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push({ ...updatedState });
      
      return {
        ...updatedState,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const addImage = useCallback((uri: string) => {
    const newImage: CollageImage = {
      id: Date.now().toString(),
      uri,
    };
    
    setState(prev => {
      const newImages = [...prev.images, newImage];
      const newState = { ...prev, images: newImages };
      
      // Save to history
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newState);
      
      return {
        ...newState,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const removeImage = useCallback((id: string) => {
    setState(prev => {
      const newImages = prev.images.filter(img => img.id !== id);
      const newState = { ...prev, images: newImages };
      
      // Save to history
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newState);
      
      return {
        ...newState,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const setLayout = useCallback((layout: GridLayout) => {
    setState(prev => {
      const newState = { ...prev, selectedLayout: layout };
      
      // Save to history
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newState);
      
      return {
        ...newState,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const setMirrorLayout = useCallback((mirror: MirrorLayout) => {
    setState(prev => {
      const newState = { ...prev, selectedMirror: mirror };
      
      // Save to history
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newState);
      
      return {
        ...newState,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const previousState = prev.history[prev.historyIndex - 1];
        return {
          ...previousState,
          history: prev.history,
          historyIndex: prev.historyIndex - 1,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const nextState = prev.history[prev.historyIndex + 1];
        return {
          ...nextState,
          history: prev.history,
          historyIndex: prev.historyIndex + 1,
        };
      }
      return prev;
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      images: [],
      selectedLayout: null,
      selectedMirror: { type: 'vertical', parts: 2 },
      filters: [],
      history: [],
      historyIndex: 0,
    });
  }, []);

  const saveProject = useCallback(async (name?: string) => {
    const projectData = {
      name: name || `Collage ${Date.now()}`,
      images: state.images,
      layout: state.selectedLayout,
      filters: state.filters,
      mirrorSettings: state.selectedMirror,
    };
    
    try {
      const savedCollage = await apiRequest('/api/collages', {
        method: 'POST',
        body: JSON.stringify(projectData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Project saved successfully!', savedCollage);
      return savedCollage;
    } catch (error) {
      console.error('Failed to save project:', error);
      // Fallback to localStorage
      localStorage.setItem(`collage-project-${Date.now()}`, JSON.stringify(projectData));
      return projectData;
    }
  }, [state]);

  const loadProject = useCallback(async (collageId: string) => {
    try {
      const collage = await apiRequest(`/api/collages/${collageId}`);
      
      setState({
        images: collage.images || [],
        selectedLayout: collage.layout || null,
        selectedMirror: collage.mirrorSettings || { type: 'vertical', parts: 2 },
        filters: collage.filters || [],
        history: [],
        historyIndex: 0,
      });
      
      console.log('Project loaded successfully!', collage);
      return collage;
    } catch (error) {
      console.error('Failed to load project:', error);
      throw error;
    }
  }, []);

  return {
    ...state,
    addImage,
    removeImage,
    setLayout,
    setMirrorLayout,
    undo,
    redo,
    reset,
    saveProject,
    loadProject,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
  };
}