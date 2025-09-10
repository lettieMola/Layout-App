import MirrorControls from '../MirrorControls';
import { useState } from 'react';
import { MirrorLayout } from '@shared/schema';

export default function MirrorControlsExample() {
  const [mirrorLayout, setMirrorLayout] = useState<MirrorLayout>({ type: 'vertical', parts: 2 });

  const handleLayoutChange = (layout: MirrorLayout) => {
    console.log('Mirror layout changed:', layout);
    setMirrorLayout(layout);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <MirrorControls 
        mirrorLayout={mirrorLayout}
        onLayoutChange={handleLayoutChange}
      />
    </div>
  );
}