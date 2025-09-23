import React from "react";

interface GridItemProps {
  layout: any;
  onClick?: () => void;
}

const GridItem: React.FC<GridItemProps> = ({ layout, onClick }) => (
  <div
    className="hover-elevate cursor-pointer rounded-lg border p-2 flex flex-col items-center gap-2 transition"
    onClick={onClick}
  >
    <div className="grid gap-px w-16 h-16">
      {layout.layout?.map?.((row: number[], rowIndex: number) => (
        <div key={rowIndex} className="flex gap-px">
          {row.map((cell: number, colIndex: number) => (
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

export default GridItem;