import ToolBar from '../ToolBar';

export default function ToolBarExample() {
  const handleAction = (action: string) => {
    console.log(`${action} triggered`);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <ToolBar 
        onUndo={() => handleAction('Undo')}
        onRedo={() => handleAction('Redo')}
        onReset={() => handleAction('Reset')}
        onSave={() => handleAction('Save')}
        onDownload={() => handleAction('Download')}
        canUndo={true}
        canRedo={false}
      />
    </div>
  );
}