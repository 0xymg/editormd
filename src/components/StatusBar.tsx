import React, { useState } from 'react';
import { Palette } from 'lucide-react';

interface StatusBarProps {
  text: string;
}

export default function StatusBar({ text }: StatusBarProps) {
  const [bgColor, setBgColor] = useState('#007ACC');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const getWordCount = (str: string) => {
    return str
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getCharCount = (str: string) => {
    return str.length;
  };

  const wordCount = getWordCount(text);
  const charCount = getCharCount(text);

  const colors = [
    '#007ACC',
    '#102E4A',
    '#FF6201',
    '#E3170A',
    '#6B46C1',
    '#2D3748',
    '#1A365D',
    '#2C7A7B',
    '#820933',
    '#121113',
  ];

  return (
    <div className="relative">
      <div
        style={{ backgroundColor: bgColor }}
        className="h-6 text-white text-xs flex items-center justify-between px-4 select-none"
      >
        <div className="flex items-center space-x-4">
          <span>{`${wordCount} Words`}</span>
          <span>{`${charCount} Characters`}</span>
        </div>

        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="hover:bg-white/10 p-1 rounded"
          title="Change Status Bar Color"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>

      {showColorPicker && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                className="w-6 h-6 rounded hover:ring-2 ring-offset-2 ring-blue-500"
                onClick={() => {
                  setBgColor(color);
                  setShowColorPicker(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
