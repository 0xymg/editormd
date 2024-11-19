import React, { useEffect, useRef } from 'react';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, url: string) => void;
  type: 'link' | 'image';
}

export default function Popover({
  isOpen,
  onClose,
  onSubmit,
  type,
}: PopoverProps) {
  const [text, setText] = React.useState('');
  const [url, setUrl] = React.useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setText('');
      setUrl('');
      firstInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(text, url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        ref={popoverRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
      >
        <h3 className="text-lg font-semibold mb-4">
          Insert {type === 'link' ? 'Link' : 'Image'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'link' ? 'Text' : 'Alt Text'}
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={type === 'link' ? 'Link text' : 'Image description'}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'link' ? 'URL' : 'Image URL'}
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                type === 'link'
                  ? 'https://example.com'
                  : 'https://example.com/image.jpg'
              }
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black  rounded-md"
            >
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
