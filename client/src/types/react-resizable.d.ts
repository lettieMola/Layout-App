// Minimal type declarations for `react-resizable` to satisfy TypeScript.
// This is a lightweight fallback. If upstream publishes official types
// or @types/react-resizable becomes available, you can remove this file.

declare module 'react-resizable' {
  import * as React from 'react';

  export interface ResizeCallbackData {
    node: Element | null;
    size: { width: number; height: number };
  }

  export interface ResizableProps extends React.HTMLAttributes<HTMLElement> {
    width?: number;
    height?: number;
    axis?: 'both' | 'x' | 'y' | 'none';
    minConstraints?: [number, number];
    maxConstraints?: [number, number];
    onResize?: (e: MouseEvent | TouchEvent | Event, data: ResizeCallbackData) => void;
    onResizeStart?: (e: MouseEvent | TouchEvent | Event, data: ResizeCallbackData) => void;
    onResizeStop?: (e: MouseEvent | TouchEvent | Event, data: ResizeCallbackData) => void;
    draggableOpts?: any;
    resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'se' | 'nw' | 'ne'>;
  }

  export class Resizable extends React.Component<ResizableProps> {}

  export class ResizableBox extends React.Component<ResizableProps> {}

  export default Resizable;
}
