import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    addEventListener: (): void => {},
    addListener: (): void => {},
    dispatchEvent: (): boolean => false,
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: (): void => {},
    removeListener: (): void => {},
  }),
  writable: true,
});

// jsdom doesn't implement ResizeObserver (used by @radix-ui/react-tooltip's positioning)
class ResizeObserverMock {
  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
}

window.ResizeObserver = window.ResizeObserver ?? ResizeObserverMock;

// jsdom doesn't implement pointer capture
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: (): boolean => false,
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
  value: (): void => {},
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
  value: (): void => {},
  writable: true,
});

// jsdom doesn't implement the pointer lock API (used by ScrubbableInput's drag gesture)
Object.defineProperty(HTMLElement.prototype, 'requestPointerLock', {
  value: (): void => {},
  writable: true,
});

Object.defineProperty(Document.prototype, 'exitPointerLock', {
  value: (): void => {},
  writable: true,
});
