export const MirrorLayout = {
  type: 'vertical' | 'horizontal' | 'quad',
  parts: 2 | 3 | 4
};

export const GridLayout = {
  id: String,
  name: String,
  shape: "rect" | "heart" | "clover" | "hexagon" | "circle" | "custom",
  rows: Number,
  cols: Number,
  layout: Array
};

export const Template = {
  id: String,
  name: String,
  image: String,
  placeholders: Array
};

export const DesignOption = {
  id: String,
  name: String,
  icon: String
};

export const FilterOption = {
  id: String,
  name: String,
  type: String,
  value: Number
};

export const AICapability = {
  id: String,
  name: String,
  description: String,
  icon: String
};