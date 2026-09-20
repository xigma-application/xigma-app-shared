// others
import { GPU_TIMER_FRAME_SECTION } from './constants';

// types
import { TDisjointTimerExtension, TGpuTimerState } from './types';

const gpuTimerStates = new WeakMap<WebGL2RenderingContext, TGpuTimerState>();

export const getGpuTimerState = (gl: WebGL2RenderingContext): TGpuTimerState => {
  const existing = gpuTimerStates.get(gl);

  if (existing) {
    return existing;
  }

  const state: TGpuTimerState = {
    active: null,
    enabled: false,
    extension: gl.getExtension('EXT_disjoint_timer_query_webgl2') as TDisjointTimerExtension | null,
    frame: 0,
    mode: GPU_TIMER_FRAME_SECTION,
    pending: [],
    samples: [],
  };

  gpuTimerStates.set(gl, state);

  return state;
};
