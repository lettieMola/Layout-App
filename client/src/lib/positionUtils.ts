// Helpers for converting between pixels and percent coordinates and rotation math
export function pxToPercent(px: number, total: number) {
  if (!total) return 0;
  return (px / total) * 100;
}

export function percentToPx(percent: number, total: number) {
  return (percent / 100) * total;
}

export function clampPercent(p: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, p));
}

export function angleBetween(cx: number, cy: number, x: number, y: number) {
  const dx = x - cx;
  const dy = y - cy;
  const rad = Math.atan2(dy, dx);
  return (rad * 180) / Math.PI; // degrees
}
