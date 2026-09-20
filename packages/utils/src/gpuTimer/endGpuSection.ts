// utils
import { endGpuQuery } from './endGpuQuery';
import { getGpuTimerState } from './getGpuTimerState';

export const endGpuSection = (gl: WebGL2RenderingContext, name: string): void => {
  const state = getGpuTimerState(gl);

  if (state.enabled) {
    endGpuQuery(gl, state, name);
  }
};
