import { MouseEvent as ReactMouseEvent, RefObject, useState } from 'react';

// hooks
import { useMouseDownEvent } from './useMouseDownEvent';
import { useMouseMoveEvent } from './useMouseMoveEvent';
import { useMouseUpEvent } from './useMouseUpEvent';

// types
import { TCoordinates } from '../types';

export type TUseScrubbableInputEvents = {
  mousePosition: TCoordinates | null;
  onMouseDown: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseUp: (event: ReactMouseEvent<HTMLElement>) => void;
};

export const useScrubbableInputEvents = (
  inputRef: RefObject<HTMLDivElement | null>,
  loop: boolean,
  max: number,
  min: number,
  onChange: (value: number) => void,
  onMouseDown: () => void,
  onMouseUp: () => void,
  value: number,
): TUseScrubbableInputEvents => {
  const [mousePosition, setMousePosition] = useState<TCoordinates | null>(null);

  useMouseMoveEvent(max, min, loop, mousePosition, onChange, setMousePosition, value);

  return {
    mousePosition,
    onMouseDown: useMouseDownEvent(inputRef, onMouseDown, setMousePosition),
    onMouseUp: useMouseUpEvent(onMouseUp, setMousePosition),
  };
};
