export const isGpuTimerShortcutTarget = (target: EventTarget | null): boolean =>
  !(target instanceof HTMLElement && (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'));
