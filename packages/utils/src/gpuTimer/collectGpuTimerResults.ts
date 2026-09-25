// others
import { GPU_TIMER_MAX_SAMPLES, GPU_TIMER_NANOSECONDS_PER_MILLISECOND } from './constants';

// types
import { TGpuTimerState } from './types';

export const collectGpuTimerResults = (gl: WebGL2RenderingContext, state: TGpuTimerState): void => {
  if (state.extension) {
    const disjoint = Boolean(gl.getParameter(state.extension.GPU_DISJOINT_EXT));

    state.pending = state.pending.filter(({ frame, name, query }) => {
      if (gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
        if (!disjoint && state.samples.length < GPU_TIMER_MAX_SAMPLES) {
          state.samples.push({ frame, ms: gl.getQueryParameter(query, gl.QUERY_RESULT) / GPU_TIMER_NANOSECONDS_PER_MILLISECOND, name });
        }

        gl.deleteQuery(query);

        return false;
      }

      return true;
    });
  }
};
