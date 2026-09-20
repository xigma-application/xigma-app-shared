// utils
import { collectGpuTimerResults } from './collectGpuTimerResults';
import { endGpuQuery } from './endGpuQuery';
import { getGpuTimerState } from './getGpuTimerState';

export const setGpuTimerEnabled = (gl: WebGL2RenderingContext, enabled: boolean): boolean => {
  const state = getGpuTimerState(gl);

  if (enabled && state.extension) {
    state.samples = [];
    state.enabled = true;
  } else {
    if (state.active) {
      endGpuQuery(gl, state, state.active.name);
    }

    collectGpuTimerResults(gl, state);
    state.enabled = false;
  }

  return state.enabled;
};
