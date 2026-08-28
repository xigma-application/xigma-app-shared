import { MouseEvent, RefObject } from 'react';
import { renderHook } from '@testing-library/react';

// hooks
import { useMouseDownEvent } from '../useMouseDownEvent';

describe('useMouseDownEvent', () => {
  it('should seed the position, notify the caller and request pointer lock', () => {
    // mock
    const setMousePosition = vi.fn();
    const onMouseDown = vi.fn();
    const requestPointerLock = vi.fn().mockResolvedValue(undefined);
    const inputRef = { current: { requestPointerLock } } as unknown as RefObject<HTMLDivElement>;

    // before
    const { result } = renderHook(() => useMouseDownEvent(inputRef, onMouseDown, setMousePosition));

    // action
    result.current({ clientX: 3, clientY: 4 } as MouseEvent);

    // result
    expect(setMousePosition).toHaveBeenCalledWith({ x: 3, y: 4 });
    expect(onMouseDown).toHaveBeenCalledTimes(1);
    expect(requestPointerLock).toHaveBeenCalledTimes(1);
  });

  it('should not request pointer lock when the ref is not attached', () => {
    // mock
    const inputRef = { current: null } as RefObject<HTMLDivElement | null>;

    // before
    const { result } = renderHook(() => useMouseDownEvent(inputRef, vi.fn(), vi.fn()));

    // result
    expect(() => result.current({ clientX: 0, clientY: 0 } as MouseEvent)).not.toThrow();
  });
});
