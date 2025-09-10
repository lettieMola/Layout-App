// 📌 Grid Layouts
export const GRID_LAYOUTS = [
  {
    id: 'grid-1',
    name: '1st',
    shape: 'rect',
    rows: 1,
    cols: 1,
    layout: [[1]],
  },
  {
    id: 'grid-2',
    name: '1st',
    shape: 'rect',
    rows: 1,
    cols: 2,
    layout: [[1, 2]],
  },
  {
    id: 'grid-3',
    name: '2st',
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
    name: 'Hart',
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
    name: 'Bitch',
    shape: 'custom',
    rows: 2,
    cols: 3,
    layout: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  {
    id: 'grid-8',
    name: '3:2',
    shape: 'rect',
    rows: 3,
    cols: 2,
    layout: [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
  },
  {
    id: 'grid-9',
    name: 'Top Heavy',
    shape: 'custom',
    rows: 2,
    cols: 2,
    layout: [
      [1, 1],
      [1, 0],
    ],
  },
  {
    id: 'grid-10',
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
    id: 'grid-11',
    name: 'Tail + Two',
    shape: 'custom',
    rows: 2,
    cols: 3,
    layout: [
      [1, 1, 1],
      [0, 1, 1],
    ],
  }
];

// 📌 Mirror Layouts
export const MIRROR_LAYOUTS = [
  { id: 'mirror-1', name: 'Vertical', type: 'vertical', parts: 2 },
  { id: 'mirror-2', name: 'Horizontal', type: 'horizontal', parts: 2 },
  { id: 'mirror-3', name: 'Quad', type: 'quad', parts: 4 },
  { id: 'mirror-4', name: 'Vertical 3', type: 'vertical', parts: 3 },
  { id: 'mirror-5', name: 'Horizontal 3', type: 'horizontal', parts: 3 },
];

// 📌 Design Options
export const DESIGN_OPTIONS = [
  { id: 'design-1', name: 'College', icon: 'fas fa-graduation-cap' },
  { id: 'design-2', name: 'Design', icon: 'fas fa-drafting-compass' },
  { id: 'design-3', name: 'Customize', icon: 'fas fa-sliders-h' },
  { id: 'design-4', name: 'Instagram Post', icon: 'fab fa-instagram' },
  { id: 'design-5', name: 'WhatsApp', icon: 'fab fa-whatsapp' },
  { id: 'design-6', name: 'Logo', icon: 'fas fa-certificate' },
  { id: 'design-7', name: 'Face Pr', icon: 'fas fa-user' },
];

// 📌 Filter Options
export const FILTER_OPTIONS = [
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

// 📌 AI Capabilities
export const AI_CAPABILITIES = [
  { id: 'ai-1', name: 'Background Removal', description: 'Remove image background automatically', icon: 'fas fa-cut' },
  { id: 'ai-2', name: 'Style Transfer', description: 'Apply artistic styles to your images', icon: 'fas fa-paint-brush' },
  { id: 'ai-3', name: 'Face Enhancement', description: 'Enhance facial features automatically', icon: 'fas fa-smile' },
  { id: 'ai-4', name: 'Object Recognition', description: 'Identify and tag objects in images', icon: 'fas fa-tags' },
  { id: 'ai-5', name: 'Colorize', description: 'Add color to black and white photos', icon: 'fas fa-palette' },
  { id: 'ai-6', name: 'Upscale', description: 'Increase image resolution', icon: 'fas fa-search-plus' },
];
