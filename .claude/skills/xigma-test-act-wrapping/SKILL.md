---
name: xigma-test-act-wrapping
description: When a raw window.dispatchEvent(...)/element.dispatchEvent(...) call — or any other raw DOM call like element.click() — in a test needs to be wrapped in act(...) from '@testing-library/react' to silence "An update to TestComponent was not wrapped in act(...)". Load before writing or reviewing a test that fires a pointer/mouse/keyboard event directly on a DOM node (not via fireEvent/userEvent) inside a component that holds React state read by the mounted tree.
---

# xigma-app-shared `act()` Wrapping for Raw DOM Event Dispatch

Ported from xigma-app's `xigma-test-act-wrapping`, adapted to this repo (no Redux here — the state
that needs wrapping is plain `useState` inside a hook, not a store subscription, but the underlying
React rule is identical).

## Why this comes up here specifically

`ScrubbableInput`'s drag gesture is implemented with a raw `window.addEventListener('mousemove',
...)` inside `useMouseMoveEvent` ([[xigma-function-style]]'s pattern for a hook that owns a native
DOM listener instead of a React synthetic event), because the drag has to keep tracking the mouse
even when it leaves the component's own DOM node. Its test mirrors that: constructing a real
`MouseEvent` and calling `window.dispatchEvent(...)` directly — not Testing Library's `fireEvent`,
which auto-wraps in `act()` itself. A raw `dispatchEvent` does not.

## When it actually warns (and when it doesn't)

The warning ("An update to TestComponent inside a test was not wrapped in act(...)") only fires
when the dispatched event's handler causes a **React re-render inside the test's render tree** —
concretely, a `setState` call whose value is read by a component currently mounted via
`render`/`renderHook`. If nothing in the tree reads that state, the dispatch still runs the handler
(assert on the mock/spy it called as normal) but nothing re-renders, so no warning fires and no
wrapping is needed.

In `useMouseMoveEvent`, `handleMouseMove` calls `setMousePosition(...)` — and `ScrubbableInput`
reads `mousePosition` to decide whether to portal-render the drag handle `<Icon>`. That's why the
drag test in `ScrubbableInput.spec.tsx` needs `act()` around the dispatch, while a hook-level test
that only asserts on a `vi.fn()` mock passed in as `setMousePosition` (see
`useMouseMoveEvent.spec.ts`) doesn't — nothing there is mounted to re-render.

## Fix: wrap the dispatchEvent call(s) in `act()`

```tsx
// jsdom's MouseEvent constructor ignores movementX, so pin it onto the instance afterwards
const mouseMoveEvent = (movementX: number): MouseEvent => {
  const event = new MouseEvent('mousemove', { bubbles: true });
  Object.defineProperty(event, 'movementX', { value: movementX });

  return event;
};

// action
act(() => {
  window.dispatchEvent(mouseMoveEvent(20));
});

// result
expect(onChange).toHaveBeenCalledWith(20);
```

Wrap the **whole sequence** of `dispatchEvent` calls for one user gesture in a single `act(() =>
{...})`, not each call individually — one `act()` around `mousedown` + `mousemove` + `mouseup`
together, per [[xigma-test-conventions]]'s single `// action` step comment covering the whole
gesture (the `mousedown`/`mouseup` in that same test go through `fireEvent`, which act-wraps on its
own, so only the raw `window.dispatchEvent(mouseMoveEvent(...))` needed the explicit wrapper).

The rule isn't limited to `window.dispatchEvent` — any raw DOM method call has the same gap, since
none of them route through Testing Library's own act-wrapping. A bare
`screen.getByRole('button').click()` hits the same issue if that click triggers a `setState` a
mounted component reads back. Prefer `fireEvent.click(...)` when it's already imported for other
assertions in the same file (it act-wraps for you), but a bare `.click()`/`dispatchEvent()` works
too as long as it's inside `act()`.

## Don't over-wrap

Only wrap the specific `dispatchEvent` call(s) that actually change state something in the test's
render tree reads. A hook-level `renderHook` test with no mounted component around it, or a
dispatch whose value nothing subscribes to, doesn't need `act()` — check what the handler actually
sets and whether anything in the test's tree reads that state before adding the wrapper reflexively.

## Related

[[xigma-test-conventions]] — the `// action` step comment this wraps.
[[xigma-unit-coverage]] — chasing a coverage gap often means adding exactly this kind of raw
`dispatchEvent` test for a branch/gesture that wasn't exercised yet.
[[xigma-function-style]] — why hooks like `useMouseMoveEvent`/`useMouseDownEvent` use raw
`addEventListener`/`dispatchEvent` instead of React synthetic events in the first place.
