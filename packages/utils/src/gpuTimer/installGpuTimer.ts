// others
import { GPU_TIMER_DEFAULT_SAVE_KEY, GPU_TIMER_DEFAULT_TOGGLE_KEY } from './constants';

// types
import { TGpuTimerOptions } from './types';

// utils
import { collectGpuTimerResults } from './collectGpuTimerResults';
import { createGpuTimerOverlay } from './createGpuTimerOverlay';
import { downloadGpuTimerReport } from './downloadGpuTimerReport';
import { getGpuTimerState } from './getGpuTimerState';
import { isGpuTimerShortcutTarget } from './isGpuTimerShortcutTarget';
import { renderGpuTimerOverlay } from './renderGpuTimerOverlay';
import { setGpuTimerEnabled } from './setGpuTimerEnabled';

// Call once with the app's WebGL2 context, then wrap the code to measure with beginGpuFrame/endGpuFrame
// and beginGpuSection/endGpuSection. Control+A (default) toggles the measuring, Control+S saves a JSON
// report; a fixed on/off label is shown in the middle of the page. Returns a function that removes it.
export const installGpuTimer = (gl: WebGL2RenderingContext, options: TGpuTimerOptions = {}): (() => void) => {
  const saveKey = (options.saveKey ?? GPU_TIMER_DEFAULT_SAVE_KEY).toLowerCase();
  const toggleKey = (options.toggleKey ?? GPU_TIMER_DEFAULT_TOGGLE_KEY).toLowerCase();
  const state = getGpuTimerState(gl);
  const overlay = createGpuTimerOverlay();

  renderGpuTimerOverlay(overlay, state.enabled, toggleKey, saveKey, null);

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.ctrlKey && !event.metaKey && isGpuTimerShortcutTarget(event.target)) {
      const key = event.key.toLowerCase();

      if (key === toggleKey) {
        event.preventDefault();
        event.stopPropagation();
        setGpuTimerEnabled(gl, !state.enabled);
        renderGpuTimerOverlay(overlay, state.enabled, toggleKey, saveKey, null);
      }

      if (key === saveKey) {
        event.preventDefault();
        event.stopPropagation();
        collectGpuTimerResults(gl, state);
        renderGpuTimerOverlay(overlay, state.enabled, toggleKey, saveKey, downloadGpuTimerReport(gl));
      }
    }
  };

  window.addEventListener('keydown', onKeyDown, true);

  return (): void => {
    window.removeEventListener('keydown', onKeyDown, true);
    overlay.remove();
  };
};
