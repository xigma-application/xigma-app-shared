import { composeStories } from '@storybook/react-vite';
import { act, fireEvent, render, screen } from '@testing-library/react';

// components
import ScrubbableInput from './ScrubbableInput';
import * as stories from './stories/BasicScrubbableInput.stories';

const { BasicScrubbableInput } = composeStories(stories);

const getRoot = (): HTMLElement => screen.getByText('Value: 25').parentElement as HTMLElement;

// jsdom's MouseEvent constructor ignores movementX, so pin it onto the instance afterwards
const mouseMoveEvent = (movementX: number): MouseEvent => {
  const event = new MouseEvent('mousemove', { bubbles: true });
  Object.defineProperty(event, 'movementX', { value: movementX });

  return event;
};

describe('ScrubbableInput', () => {
  it('should render its children', () => {
    // before
    render(<BasicScrubbableInput />);

    // result
    expect(screen.getByText('Value: 25')).toBeInTheDocument();
  });

  it('should mark the root as disabled when the disabled prop is set', () => {
    // before
    render(<BasicScrubbableInput disabled />);

    // result
    expect(getRoot().className).toContain('ScrubbableInput--disabled');
  });

  // the drag handle's visibility and the value-on-screen updating are asserted in a real browser
  // instead, closer to the actual render: stories/test/BasicScrubbableInput.interactions.ts's
  // playBasicScrubbableInput already covers that (and playStates covers the loop-wrap branch this
  // file never tested at all). What's left here — and what a real render can't show any better
  // than jsdom can — is that the drag actually threads through to the onChange/onMouseDown/
  // onMouseUp props with the right values.
  it('should thread the clamped value and the mouse events through onChange/onMouseDown/onMouseUp', () => {
    // mock
    const onChange = vi.fn();
    const onMouseDown = vi.fn();
    const onMouseUp = vi.fn();

    // before
    render(<BasicScrubbableInput onChange={onChange} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />);

    // find
    const root = getRoot();

    // action
    fireEvent.mouseDown(root, { clientX: 40, clientY: 20 });

    // result
    expect(onMouseDown).toHaveBeenCalledTimes(1);

    // action
    act(() => {
      window.dispatchEvent(mouseMoveEvent(20));
    });

    // result: slow speed by default — 25 + 20 * 0.5
    expect(onChange).toHaveBeenCalledWith(35);

    // action
    fireEvent.mouseUp(root);

    // result
    expect(onMouseUp).toHaveBeenCalledTimes(1);
  });

  it('should fall back to no-op handlers when onMouseDown and onMouseUp are omitted', () => {
    // before
    render(
      <ScrubbableInput max={100} min={0} onChange={vi.fn()} value={0}>
        <span>child</span>
      </ScrubbableInput>,
    );

    // find
    const root = screen.getByText('child').parentElement as HTMLElement;

    // action
    fireEvent.mouseDown(root, { clientX: 0, clientY: 0 });
    fireEvent.mouseUp(root);

    // result
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });
});
