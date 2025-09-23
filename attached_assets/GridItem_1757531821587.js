import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GRID_LAYOUTS } from "@/lib/constants";
import GridItem from "@/components/GridItem";
import { useLocation } from "wouter";
import React from "react";

/**
 * @typedef {Object} GridItemProps
 * @property {any} layout
 * @property {() => void} [onClick]
 */

export default function GridItem({ layout, onClick }) {
  return (
    <div
      className="hover-elevate cursor-pointer rounded-lg border p-2 flex flex-col items-center gap-2 transition"
      onClick={onClick}
    >
      <div className="grid gap-px w-16 h-16">
        {layout.layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-px">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex-1 aspect-square rounded-sm ${
                  cell > 0 ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="text-xs font-medium text-center">{layout.name}</span>
    </div>
  );
}

export default function AllLayouts() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">All Grid Layouts</h1>
          <Button variant="outline" onClick={() => setLocation("/")}>
            Back
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {GRID_LAYOUTS.map((layout) => (
            <Card key={layout.id} className="p-2">
              <GridItem
                layout={layout}
                onClick={() => setLocation(`/editor?layout=${layout.id}`)}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}