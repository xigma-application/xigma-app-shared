// types
import { TGpuTimerState } from './types';

export const endGpuQuery = (gl: WebGL2RenderingContext, state: TGpuTimerState, name: string): void => {
  if (state.extension && state.active?.name === name) {
    gl.endQuery(state.extension.TIME_ELAPSED_EXT);
    state.pending.push(state.active);
    state.active = null;
  }
};
