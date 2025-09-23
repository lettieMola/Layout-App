export async function generateSticker(prompt: string) {
  // Placeholder: integrate with a real sticker generation API.
  // For now simulate delay and return a data-url placeholder or a built-in asset path.
  await new Promise(r => setTimeout(r, 1200));
  // Return a simple SVG data url with the prompt embedded (for demo only)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><rect width='100%' height='100%' fill='%23ffd54f' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='%23000'>${prompt}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
