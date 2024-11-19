'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Header from './Header';
import TabSwitcher from './TabSwitcher';
import StatusBar from './StatusBar';
import Popover from './Popover';
import { defaultMarkdown } from '@/utils/defaultContent';
import { useMarkdownActions } from '@/hooks/useMarkdownActions';
import { useUndoRedo } from '@/hooks/useUndoRedo';

const MarkdownPreview = dynamic(() => import('./MarkdownPreview'), {
  ssr: false,
});

export default function Editor() {
  const {
    state: markdown,
    setState: setMarkdown,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo(defaultMarkdown);
  
  const [activeTab, setActiveTab] = React.useState<'edit' | 'preview'>('edit');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [checkedItems, setCheckedItems] = React.useState<Set<string>>(new Set());
  const [popoverType, setPopoverType] = React.useState<'link' | 'image' | null>(null);

  const { handleToolAction, handleFileImport, handleExport } = useMarkdownActions(
    markdown,
    setMarkdown,
    textareaRef
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newCheckedItems = new Set(checkedItems);
    if (checked) {
      newCheckedItems.add(index.toString());
    } else {
      newCheckedItems.delete(index.toString());
    }
    setCheckedItems(newCheckedItems);
  };

  const handleAction = (action: string) => {
    if (action === 'link') {
      setPopoverType('link');
    } else if (action === 'image') {
      setPopoverType('image');
    } else {
      handleToolAction(action);
    }
  };

  const handlePopoverSubmit = (text: string, url: string) => {
    if (popoverType === 'link') {
      handleToolAction(`link:${text}|${url}`);
    } else if (popoverType === 'image') {
      handleToolAction(`image:${text}|${url}`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header
        onImport={handleFileImport}
        onExport={handleExport}
        onAction={handleAction}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 p-4 overflow-hidden">
        <div className="h-full bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {/* Editor Panel */}
            <div
              className={`h-full flex flex-col ${
                activeTab === 'edit' || 'hidden sm:block'
              }`}
            >
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 w-full p-4 font-mono text-sm bg-white focus:outline-none resize-none overflow-y-auto"
                placeholder="Enter markdown here..."
              />
            </div>

            {/* Preview Panel */}
            <div
              className={`h-full overflow-auto ${
                activeTab === 'preview' || 'hidden sm:block'
              }`}
            >
              <MarkdownPreview 
                content={markdown} 
                checkedItems={checkedItems}
                onCheckboxChange={handleCheckboxChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      <StatusBar text={markdown} />

      {popoverType && (
        <Popover
          isOpen={true}
          onClose={() => setPopoverType(null)}
          onSubmit={handlePopoverSubmit}
          type={popoverType}
        />
      )}
    </div>
  );
}