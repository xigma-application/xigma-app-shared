import { renderHook } from '@testing-library/react';

// hooks
import { useMouseMoveEvent } from '../useMouseMoveEvent';

const position = { x: 0, y: 0 };

// jsdom's MouseEvent constructor ignores movementX, so pin it onto the instance afterwards
const mouseMoveEvent = (movementX: number, shiftKey = false): MouseEvent => {
  const event = new MouseEvent('mousemove', { bubbles: true, shiftKey });
  Object.defineProperty(event, 'movementX', { value: movementX });

  return event;
};

describe('useMouseMoveEvent', () => {
  beforeAll(() => {
    // mock
    window.innerHeight = 1000;
    window.innerWidth = 1000;
  });

  it('should move the value at the slow speed by default', () => {
    // mock
    const onChange = vi.fn();

    // before
    renderHook(() => useMouseMoveEvent(100, 0, false, position, onChange, vi.fn(), 10));

    // action
    window.dispatchEvent(mouseMoveEvent(10));

    // result
    expect(onChange).toHaveBeenCalledWith(15);
  });

  it('should move the value faster while shift is held', () => {
    // mock
    const onChange = vi.fn();

    // before
    renderHook(() => useMouseMoveEvent(100, 0, false, position, onChange, vi.fn(), 10));

    // action
    window.dispatchEvent(mouseMoveEvent(10, true));

    // result
    expect(onChange).toHaveBeenCalledWith(30);
  });

  it('should clamp the value to the max/min bounds', () => {
    // mock
    const onChange = vi.fn();

    // before
    renderHook(() => useMouseMoveEvent(100, 0, false, position, onChange, vi.fn(), 100));

    // action
    window.dispatchEvent(mouseMoveEvent(50));

    // result
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('should keep the value untouched when it does not move and looping is off', () => {
    // mock
    const onChange = vi.fn();

    // before
    renderHook(() => useMouseMoveEvent(100, 0, false, position, onChange, vi.fn(), 50));

    // action
    window.dispatchEvent(mouseMoveEvent(0));

    // result
    expect(onChange).toHaveBeenCalledWith(50);
  });

  it('should wrap around to the opposite bound when loop is enabled', () => {
    // mock
    const onChange = vi.fn();

    // before
    renderHook(() => useMouseMoveEvent(100, 0, true, position, onChange, vi.fn(), 100));

    // action
    window.dispatchEvent(mouseMoveEvent(50));

    // result
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('should not listen while there is no active drag', () => {
    // mock
    const onChange = vi.fn();

    // before
    renderHook(() => useMouseMoveEvent(100, 0, false, null, onChange, vi.fn(), 10));

    // action
    window.dispatchEvent(mouseMoveEvent(10));

    // result
    expect(onChange).not.toHaveBeenCalled();
  });
});
