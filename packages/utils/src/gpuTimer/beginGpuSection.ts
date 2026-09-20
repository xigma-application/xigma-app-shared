// utils
import { getGpuTimerState } from './getGpuTimerState';
import { startGpuQuery } from './startGpuQuery';

export const beginGpuSection = (gl: WebGL2RenderingContext, name: string): void => {
  const state = getGpuTimerState(gl);

  if (state.enabled && state.extension && state.mode === 'sections' && !state.active) {
    startGpuQuery(gl, state, state.extension, name);
  }
};
