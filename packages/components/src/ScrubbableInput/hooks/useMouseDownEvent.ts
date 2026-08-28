import { MouseEvent, RefObject } from 'react';

// types
import { TCoordinates } from '../types';

export type TUseMouseDownEvent = (event: MouseEvent) => void;

export const useMouseDownEvent = (
  inputRef: RefObject<HTMLDivElement | null>,
  onMouseDown: () => void,
  setMousePosition: (coordinates: TCoordinates) => void,
): TUseMouseDownEvent => {
  const handleMouseDown = (event: MouseEvent): void => {
    setMousePosition({ x: event.clientX, y: event.clientY });
    onMouseDown();

    if (inputRef.current) {
      // rejects (e.g. when the browser refuses lock outside a top-level document) without ever
      // stopping the drag itself — the lock is a nice-to-have, not a requirement
      inputRef.current.requestPointerLock().catch(() => {});
    }
  };

  return handleMouseDown;
};
