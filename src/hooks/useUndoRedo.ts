import { useState, useCallback } from 'react';

interface HistoryState {
  past: string[];
  present: string;
  future: string[];
}

export function useUndoRedo(initialState: string) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory((currentHistory) => {
      const previous = currentHistory.past[currentHistory.past.length - 1];
      const newPast = currentHistory.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [currentHistory.present, ...currentHistory.future],
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory((currentHistory) => {
      const next = currentHistory.future[0];
      const newFuture = currentHistory.future.slice(1);

      return {
        past: [...currentHistory.past, currentHistory.present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  const updatePresent = useCallback((newPresent: string) => {
    if (newPresent === history.present) return;

    setHistory((currentHistory) => ({
      past: [...currentHistory.past, currentHistory.present],
      present: newPresent,
      future: [],
    }));
  }, [history.present]);

  return {
    state: history.present,
    setState: updatePresent,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}