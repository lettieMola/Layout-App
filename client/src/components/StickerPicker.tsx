import React, { useState } from 'react';

type StickerEntry = { id: string; src: string; animated?: boolean };

interface Props {
  stickers?: StickerEntry[];
  onSelect: (src: string, animated?: boolean) => void;
}

export default function StickerPicker({ stickers = [], onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="font-semibold mb-2">Stickers</div>
      <div className="flex gap-2 mb-2 flex-wrap">
        {stickers.map(s => (
          <img key={s.id} src={s.src} alt={s.id} className="w-12 h-12 cursor-pointer border rounded" onClick={() => onSelect(s.src, s.animated)} />
        ))}
      </div>
    </div>
  );
}
