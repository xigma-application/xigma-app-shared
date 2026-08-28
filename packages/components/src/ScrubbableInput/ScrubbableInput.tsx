import { createPortal } from 'react-dom';
import { FC, ReactNode, useRef } from 'react';

// components
import Icon from '../Icon/Icon';

// hooks
import { useScrubbableInputEvents } from './hooks/useScrubbableInputEvents';

// styles
import './scrubbable-input.scss';

const noop = (): void => {};

export type TScrubbableInputProps = {
  /** Content the scrubber is wrapped around (a label, an input, an icon, ...). */
  children?: ReactNode;
  /** Disables the scrubber — pointer events are ignored. */
  disabled?: boolean;
  /** When the value hits a bound, wrap around to the opposite bound instead of stopping. */
  loop?: boolean;
  /** Upper bound of the value. */
  max: number;
  /** Lower bound of the value. */
  min: number;
  /** Called with the next clamped value on every drag step. */
  onChange: (value: number) => void;
  /** Called once when a drag gesture starts. */
  onMouseDown?: () => void;
  /** Called once when a drag gesture ends. */
  onMouseUp?: () => void;
  /** The current value. */
  value: number;
};

/**
 * Turns any content into a horizontal scrubber — press it and drag left or right to change a
 * number. Hold `Shift` while dragging to move 4× faster.
 */
export const ScrubbableInput: FC<TScrubbableInputProps> = ({
  children,
  disabled = false,
  loop = false,
  max,
  min,
  onChange,
  onMouseDown = noop,
  onMouseUp = noop,
  value,
}) => {
  const inputRef = useRef<HTMLDivElement>(null);

  const { mousePosition, ...events } = useScrubbableInputEvents(inputRef, loop, max, min, onChange, onMouseDown, onMouseUp, value);
  const className = disabled ? 'ScrubbableInput ScrubbableInput--disabled' : 'ScrubbableInput';

  return (
    <div className={className} ref={inputRef} {...events}>
      {children}
      {mousePosition &&
        createPortal(
          <Icon
            className="ScrubbableInput__handle"
            height={14}
            name="EWResize"
            style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }}
            width={25}
          />,
          document.body,
        )}
    </div>
  );
};

export default ScrubbableInput;
