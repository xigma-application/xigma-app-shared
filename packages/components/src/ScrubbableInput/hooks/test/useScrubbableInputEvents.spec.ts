import { RefObject } from 'react';
import { renderHook } from '@testing-library/react';

// hooks
import { useScrubbableInputEvents } from '../useScrubbableInputEvents';

const inputRef = { current: {} } as RefObject<HTMLDivElement>;

describe('useScrubbableInputEvents', () => {
  it('should expose the idle position and the pointer handlers', () => {
    // before
    const { result } = renderHook(() => useScrubbableInputEvents(inputRef, false, 100, 0, vi.fn(), vi.fn(), vi.fn(), 0));

    // result
    expect(result.current).toStrictEqual({
      mousePosition: null,
      onMouseDown: expect.any(Function),
      onMouseUp: expect.any(Function),
    });
  });
});
