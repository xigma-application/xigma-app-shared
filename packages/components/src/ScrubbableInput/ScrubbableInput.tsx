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
  children?: ReactNode;
  disabled?: boolean;
  loop?: boolean;
  max: number;
  min: number;
  onChange: (value: number) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  value: number;
};

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
