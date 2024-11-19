import React from 'react';
import { Upload, Download, Undo2, Redo2 } from 'lucide-react';
import Toolbox from './Toolbox';

interface HeaderProps {
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onAction: (action: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Header({ 
  onImport, 
  onExport, 
  onAction,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-gray-900">EditorMD</h1>
          <div className="flex items-center space-x-1 mr-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded ${
                canUndo 
                  ? 'hover:bg-gray-100 text-gray-700 hover:text-gray-900' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded ${
                canRedo 
                  ? 'hover:bg-gray-100 text-gray-700 hover:text-gray-900' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
          <Toolbox onAction={onAction} />
        </div>
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".md,.markdown"
              onChange={onImport}
              className="hidden"
            />
            <Upload className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </label>

          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 border rounded-lg p-2 text-gray-500 hover:bg-black hover:text-white"
          >
            <Download className="h-5 w-5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}