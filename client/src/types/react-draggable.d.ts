declare module 'react-draggable' {
  import React, { ReactNode } from 'react';

  export interface DraggableData {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
  }

  export type DraggableEvent = React.DragEvent<HTMLElement> | React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>;

  export interface DraggableProps {
    axis?: 'both' | 'x' | 'y' | 'none';
    defaultPosition?: { x: number; y: number };
    position?: { x: number; y: number };
    bounds?: boolean | string | { left?: number; top?: number; right?: number; bottom?: number };
    onStart?: (event: DraggableEvent, data: DraggableData) => boolean | void;
    onDrag?: (event: DraggableEvent, data: DraggableData) => boolean | void;
    onStop?: (event: DraggableEvent, data: DraggableData) => boolean | void;
    children: ReactNode;
  }

  export class Draggable extends React.Component<DraggableProps> {}

  export default Draggable;
}

