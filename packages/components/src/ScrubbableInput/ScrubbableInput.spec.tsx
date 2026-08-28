import { act, fireEvent, render, screen } from '@testing-library/react';

// components
import ScrubbableInput from './ScrubbableInput';

const getRoot = (): HTMLElement => screen.getByText('child').parentElement as HTMLElement;

// jsdom's MouseEvent constructor ignores movementX, so pin it onto the instance afterwards
const mouseMoveEvent = (movementX: number): MouseEvent => {
  const event = new MouseEvent('mousemove', { bubbles: true });
  Object.defineProperty(event, 'movementX', { value: movementX });

  return event;
};

describe('ScrubbableInput', () => {
  it('should render its children', () => {
    // before
    render(
      <ScrubbableInput max={100} min={0} onChange={vi.fn()} value={0}>
        <span>child</span>
      </ScrubbableInput>,
    );

    // result
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('should mark the root as disabled when the disabled prop is set', () => {
    // before
    render(
      <ScrubbableInput disabled max={100} min={0} onChange={vi.fn()} value={0}>
        <span>child</span>
      </ScrubbableInput>,
    );

    // result
    expect(getRoot().className).toContain('ScrubbableInput--disabled');
  });

  it('should scrub the value on horizontal drag and surface the drag handle', () => {
    // mock
    const onChange = vi.fn();
    const onMouseDown = vi.fn();
    const onMouseUp = vi.fn();

    // before
    render(
      <ScrubbableInput max={100} min={0} onChange={onChange} onMouseDown={onMouseDown} onMouseUp={onMouseUp} value={10}>
        <span>child</span>
      </ScrubbableInput>,
    );

    // action
    fireEvent.mouseDown(getRoot(), { clientX: 40, clientY: 20 });

    // result
    expect(onMouseDown).toHaveBeenCalledTimes(1);
    expect(document.querySelector('svg')).toBeInTheDocument();

    // action
    act(() => {
      window.dispatchEvent(mouseMoveEvent(20));
    });

    // result
    expect(onChange).toHaveBeenCalledWith(20);

    // action
    fireEvent.mouseUp(getRoot());

    // result
    expect(onMouseUp).toHaveBeenCalledTimes(1);
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });

  it('should fall back to no-op handlers when onMouseDown and onMouseUp are omitted', () => {
    // before
    render(
      <ScrubbableInput max={100} min={0} onChange={vi.fn()} value={0}>
        <span>child</span>
      </ScrubbableInput>,
    );

    // action
    fireEvent.mouseDown(getRoot(), { clientX: 0, clientY: 0 });
    fireEvent.mouseUp(getRoot());

    // result
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });
});
