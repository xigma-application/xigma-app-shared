// types
import { TDisjointTimerExtension, TGpuTimerState } from './types';

export const startGpuQuery = (
  gl: WebGL2RenderingContext,
  state: TGpuTimerState,
  extension: TDisjointTimerExtension,
  name: string,
): void => {
  const query = gl.createQuery();

  gl.beginQuery(extension.TIME_ELAPSED_EXT, query);
  state.active = { frame: state.frame, name, query };
};
