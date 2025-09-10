import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Undo, Redo, RotateCcw, Save, Download } from "lucide-react";

interface ToolBarProps {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSave: () => void;
  onDownload: () => void;
  canUndo: boolean;
  canRedo: boolean;
  className?: string;
}

export default function ToolBar({ 
  onUndo, 
  onRedo, 
  onReset, 
  onSave, 
  onDownload, 
  canUndo, 
  canRedo, 
  className 
}: ToolBarProps) {
  return (
    <Card className={`p-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            data-testid="button-undo"
            className="hover-elevate"
          >
            <Undo className="w-4 h-4" />
            <span className="sr-only">Undo</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            data-testid="button-redo"
            className="hover-elevate"
          >
            <Redo className="w-4 h-4" />
            <span className="sr-only">Redo</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            data-testid="button-reset"
            className="hover-elevate"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="sr-only">Reset</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            data-testid="button-save"
            className="hover-elevate"
          >
            <Save className="w-4 h-4" />
            <span className="sr-only">Save</span>
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={onDownload}
            data-testid="button-download"
            className="hover-elevate"
          >
            <Download className="w-4 h-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}