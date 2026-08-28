// types
import { TCoordinates } from '../types';

export type TUseMouseUpEvent = () => void;

export const useMouseUpEvent = (
  onMouseUp: () => void,
  setMousePosition: (coordinates: TCoordinates | null) => void,
): TUseMouseUpEvent => {
  const handleMouseUp = (): void => {
    setMousePosition(null);
    onMouseUp();
    document.exitPointerLock();
  };

  return handleMouseUp;
};
