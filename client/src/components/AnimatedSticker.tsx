import React from 'react';

interface Props {
  src: string;
  width?: number;
  height?: number;
}

export default function AnimatedSticker({ src, width = 64, height = 64 }: Props) {
  // Try to render as Lottie JSON if src ends with .json
  if (src.endsWith('.json')) {
    try {
      // Dynamically import lottie-react to avoid adding hard dependency unless used
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Lottie = require('lottie-react').default;
      return <Lottie animationData={require(`${src}`)} style={{ width, height }} />;
    } catch (e) {
      // fallback to img
    }
  }
  return <img src={src} alt="animated sticker" style={{ width, height }} />;
}
