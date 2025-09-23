import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sticker } from "lucide-react";

interface StickerPickerProps {
  onSelect: (stickerSrc: string) => void;
  className?: string;
}

export default function StickerPicker({ onSelect, className }: StickerPickerProps) {
  const demoStickers = [
    { id: 'cool', src: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png', alt: 'Cool sunglasses emoji' },
    { id: 'love', src: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60d.png', alt: 'Heart eyes emoji' },
    { id: 'wow', src: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62e.png', alt: 'Wow face emoji' },
    { id: 'star', src: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2b50.png', alt: 'Star emoji' },
    { id: 'fire', src: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f525.png', alt: 'Fire emoji' },
    { id: 'party', src: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f389.png', alt: 'Party popper emoji' },
  ];

  return (
    <Card className={className}>
      <CardHeader><CardTitle className="flex items-center gap-2"><Sticker className="w-5 h-5" />Stickers</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-4 gap-4">
        {demoStickers.map(sticker => (
          <Button key={sticker.id} variant="ghost" className="h-auto p-2 hover-elevate" onClick={() => onSelect(sticker.src)}><img src={sticker.src} alt={sticker.alt} className="w-12 h-12" /></Button>
        ))}
      </CardContent>
    </Card>
  );
}