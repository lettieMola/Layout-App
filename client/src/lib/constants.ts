import { GridLayout, MirrorLayout, FilterOption, AICapability } from "@shared/schema";

export const GRID_LAYOUTS: GridLayout[] = [
  {
    id: 'grid-1',
    name: '1x1',
    shape: 'rect',
    rows: 1,
    cols: 1,
    layout: [[1]],
  },
  {
    id: 'grid-2',
    name: '1x2',
    shape: 'rect',
    rows: 1,
    cols: 2,
    layout: [[1, 2]],
  },
  {
    id: 'grid-3',
    name: '2x2',
    shape: 'rect',
    rows: 2,
    cols: 2,
    layout: [
      [1, 2],
      [3, 4],
    ],
  },
  {
    id: 'grid-4',
    name: 'Heart',
    shape: 'heart',
    rows: 2,
    cols: 2,
    layout: [
      [0, 1],
      [1, 1],
    ],
  },
  {
    id: 'grid-5',
    name: 'Chiefs',
    shape: 'custom',
    rows: 3,
    cols: 3,
    layout: [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ],
  },
  {
    id: 'grid-6',
    name: 'Hexagon',
    shape: 'hexagon',
    rows: 1,
    cols: 1,
    layout: [[1]],
  },
  {
    id: 'grid-7',
    name: 'L-Frame',
    shape: 'custom',
    rows: 2,
    cols: 2,
    layout: [
      [1, 0],
      [1, 1],
    ],
  },
  {
    id: 'grid-8',
    name: '3x2',
    shape: 'rect',
    rows: 3,
    cols: 2,
    layout: [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
  },
];

export const MIRROR_LAYOUTS: MirrorLayout[] = [
  { type: 'vertical', parts: 2 },
  { type: 'horizontal', parts: 2 },
  { type: 'quad', parts: 4 },
  { type: 'vertical', parts: 3 },
  { type: 'horizontal', parts: 3 },
];

export const DESIGN_OPTIONS = [
  { id: 'design-1', name: 'Collage', icon: 'grid-3x3' },
  { id: 'design-2', name: 'Design', icon: 'palette' },
  { id: 'design-3', name: 'Customize', icon: 'settings' },
  { id: 'design-4', name: 'Instagram', icon: 'instagram' },
  { id: 'design-5', name: 'WhatsApp', icon: 'message-circle' },
  { id: 'design-6', name: 'Logo', icon: 'award' },
  { id: 'design-7', name: 'Face Pr', icon: 'user' },
];

export const FILTER_OPTIONS: FilterOption[] = [
  { id: 'filter-1', name: 'Original', type: 'normal', value: 0 },
  { id: 'filter-2', name: 'Clarendon', type: 'filter', value: 1 },
  { id: 'filter-3', name: 'Gingham', type: 'filter', value: 2 },
  { id: 'filter-4', name: 'Moon', type: 'filter', value: 3 },
  { id: 'filter-5', name: 'Lark', type: 'filter', value: 4 },
  { id: 'filter-6', name: 'Reyes', type: 'filter', value: 5 },
  { id: 'filter-7', name: 'Juno', type: 'filter', value: 6 },
  { id: 'filter-8', name: 'Slumber', type: 'filter', value: 7 },
  { id: 'filter-9', name: 'Crema', type: 'filter', value: 8 },
  { id: 'filter-10', name: 'Ludwig', type: 'filter', value: 9 },
];

export const AI_CAPABILITIES: AICapability[] = [
  { id: 'ai-1', name: 'BG Removal', description: 'Remove image background automatically', icon: 'scissors' },
  { id: 'ai-2', name: 'Style Transfer', description: 'Apply artistic styles to your images', icon: 'paintbrush' },
  { id: 'ai-3', name: 'Face Enhance', description: 'Enhance facial features automatically', icon: 'smile' },
  { id: 'ai-4', name: 'Object Recog', description: 'Identify and tag objects in images', icon: 'tag' },
  { id: 'ai-5', name: 'Colorize', description: 'Add color to black and white photos', icon: 'palette' },
  { id: 'ai-6', name: 'Upscale', description: 'Increase image resolution', icon: 'zoom-in' },
];