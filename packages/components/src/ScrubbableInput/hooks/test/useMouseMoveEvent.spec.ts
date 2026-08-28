import { fireEvent, renderHook } from '@testing-library/react';

// hooks
import { useMouseMoveEvent } from '../useMouseMoveEvent';

const position = { x: 0, y: 0 };

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
    fireEvent.mouseMove(window, { movementX: 10, shiftKey: false });

    // result
    expect(onChange).toHaveBeenCalledWith(15);
  });

  it('should move the value faster while shift is held', () => {
    // mock
    const onChange = vi.fn();

    // before
    renderHook(() => useMouseMoveEvent(100, 0, false, position, onChange, vi.fn(), 10));

    // action
    fireEvent.mouseMove(window, { movementX: 10, shiftKey: true });

    // result
    expect(onChange).toHaveBeenCalledWith(30);
  });

  it('should clamp the value to the max/min bounds', () => {
    // mock
    const onChange = vi.fn();

    // before
    renderHook(() => useMouseMoveEvent(100, 0, false, position, onChange, vi.fn(), 100));

    // action
    fireEvent.mouseMove(window, { movementX: 50, shiftKey: false });

    // result
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('should wrap around to the opposite bound when loop is enabled', () => {
    // mock
    const onChange = vi.fn();
    const event = new MouseEvent('mousemove', { bubbles: true });
    Object.defineProperty(event, 'movementX', { value: 50 });

    // before
    renderHook(() => useMouseMoveEvent(100, 0, true, position, onChange, vi.fn(), 100));

    // action
    window.dispatchEvent(event);

    // result
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('should not listen while there is no active drag', () => {
    // mock
    const onChange = vi.fn();

    // before
    renderHook(() => useMouseMoveEvent(100, 0, false, null, onChange, vi.fn(), 10));

    // action
    fireEvent.mouseMove(window, { movementX: 10, shiftKey: false });

    // result
    expect(onChange).not.toHaveBeenCalled();
  });
});
