export const GRID_LAYOUTS = [
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
    rows: 1,
    cols: 1,
    layout: [[1]],
  }
];

export const DESIGN_OPTIONS = [
  { id: 'design-1', name: 'Collage', icon: 'grid-outline' },
  { id: 'design-2', name: 'Design', icon: 'shapes-outline' },
  { id: 'design-3', name: 'Customize', icon: 'brush-outline' }
];