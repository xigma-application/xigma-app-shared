// others
import { GPU_TIMER_FRAME_SECTION } from './constants';

// utils
import { endGpuQuery } from './endGpuQuery';
import { getGpuTimerState } from './getGpuTimerState';

export const endGpuFrame = (gl: WebGL2RenderingContext): void => {
  const state = getGpuTimerState(gl);

  if (state.enabled) {
    endGpuQuery(gl, state, GPU_TIMER_FRAME_SECTION);
  }
};
