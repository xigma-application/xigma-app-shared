// others
import { GPU_TIMER_FRAME_SECTION } from './constants';

// utils
import { collectGpuTimerResults } from './collectGpuTimerResults';
import { getGpuTimerState } from './getGpuTimerState';
import { startGpuQuery } from './startGpuQuery';

// Frames alternate: even ones time the whole frame as one query, odd ones time every named section
// on its own (GPU timer queries cannot nest, so both can not be measured in the same frame).
export const beginGpuFrame = (gl: WebGL2RenderingContext): void => {
  const state = getGpuTimerState(gl);

  if (state.enabled && state.extension) {
    collectGpuTimerResults(gl, state);
    state.frame += 1;
    state.mode = state.frame % 2 === 0 ? 'frame' : 'sections';

    if (state.mode === 'frame') {
      startGpuQuery(gl, state, state.extension, GPU_TIMER_FRAME_SECTION);
    }
  }
};
