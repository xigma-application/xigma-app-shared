import { useEffect } from 'react';

// types
import { TCoordinates } from '../types';

// utils
import { getRevertValue } from '../utils/getRevertValue';
import { handleUpdateMousePosition } from '../utils/handleUpdateMousePosition';

export type TUseMouseMoveEvent = void;

const FAST_SPEED = 2;
const SLOW_SPEED = 0.5;

export const useMouseMoveEvent = (
  max: number,
  min: number,
  loop: boolean,
  mousePosition: TCoordinates | null,
  onChange: (value: number) => void,
  setMousePosition: (coordinates: TCoordinates) => void,
  value: number,
): TUseMouseMoveEvent => {
  const handleMouseMove = (event: MouseEvent): void => {
    const speed = event.shiftKey ? FAST_SPEED : SLOW_SPEED;
    const convertedValue = Math.round(Math.max(min, Math.min(max, value + event.movementX * speed)));

    const shouldUseRevertValue = convertedValue === value && loop;
    const targetValue = shouldUseRevertValue ? getRevertValue(convertedValue, max, min, value) : convertedValue;

    handleUpdateMousePosition(event, mousePosition, setMousePosition);
    onChange(targetValue);
  };

  useEffect(() => {
    if (mousePosition) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return (): void => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePosition]);
};
