import { expect, fireEvent, waitFor, within } from 'storybook/test';

type TPlayContext = { canvasElement: HTMLElement };

// window.dispatchEvent(mousemove) bypasses React's synthetic event system entirely, so it gives
// React no signal to flush the passive effect that attaches the drag's own listener
// (useMouseMoveEvent's useEffect, keyed on mousePosition) — a raw mousedown's state update can
// still be mid-flight by the time the very next line dispatches mousemove, and no fixed delay is
// reliably long enough to wait it out. Re-dispatching inside waitFor sidesteps the race entirely:
// a dispatch that lands before the listener is attached is just a no-op, and the assertion keeps
// retrying (with a fresh MouseEvent each attempt — the constructed init, including movementX,
// only carries the delta from a truly OS-driven event otherwise) until the one that lands after it
// succeeds — at which point exactly one mousemove has actually been processed, so the resulting
// value is still exact, not accumulated from the earlier no-op attempts.
const dragTo = (target: HTMLElement, movementX: number, expectedText: string, shiftKey = false): Promise<void> =>
  waitFor(
    () => {
      const event = new MouseEvent('mousemove', { bubbles: true, shiftKey });
      Object.defineProperty(event, 'movementX', { value: movementX });
      window.dispatchEvent(event);

      expect(target).toHaveTextContent(expectedText);
    },
    { interval: 20, timeout: 2000 },
  );

export const playBasicScrubbableInput = async ({ canvasElement }: TPlayContext): Promise<void> => {
  const canvas = within(canvasElement);
  const field = canvas.getByText('Value: 25').parentElement as HTMLElement;

  // action: press, drag right, release
  fireEvent.mouseDown(field, { clientX: 0, clientY: 0 });
  await expect(document.querySelector('.ScrubbableInput__handle')).toBeInTheDocument();

  // result: slow speed by default — 25 + 10 * 0.5
  await dragTo(field, 10, 'Value: 30');

  fireEvent.mouseUp(field);
  await expect(document.querySelector('.ScrubbableInput__handle')).not.toBeInTheDocument();
};

export const playStates = async ({ canvasElement }: TPlayContext): Promise<void> => {
  const canvas = within(canvasElement);
  // fields render in the same order as the `fields` array in the story: Default, Looping, Disabled
  const [, loopingField] = canvas.getAllByText(/^Value:/).map((valueEl) => valueEl.parentElement as HTMLElement);

  // action: drag past the max bound with one big fast-speed move
  fireEvent.mouseDown(loopingField, { clientX: 0, clientY: 0 });

  // result: clamped to the max, not wrapped yet — the value has to actually *sit* on the bound
  // first before the next move can wrap it
  await dragTo(loopingField, 200, 'Value: 100', true);

  // action: one more move past the bound — result: wraps to the opposite bound instead of staying
  // clamped
  await dragTo(loopingField, 1, 'Value: 0', true);

  fireEvent.mouseUp(loopingField);
};
