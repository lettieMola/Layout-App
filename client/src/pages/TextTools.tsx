import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";

interface TextToolsProps {
  onAddText: () => void;
  className?: string;
}

export default function TextTools({ onAddText, className }: TextToolsProps) {
  return (
    <Card className={className}>
      <CardHeader><CardTitle className="flex items-center gap-2"><Type className="w-5 h-5" />Add Text</CardTitle></CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Text editing functionality coming soon.</p>
      </CardContent>
    </Card>
  );
}
