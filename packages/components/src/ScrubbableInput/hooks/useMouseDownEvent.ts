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
      inputRef.current.requestPointerLock();
    }
  };

  return handleMouseDown;
};
