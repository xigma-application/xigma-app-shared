// utils
import { buildGpuTimerReport } from './buildGpuTimerReport';
import { getGpuTimerState } from './getGpuTimerState';

export const downloadGpuTimerReport = (gl: WebGL2RenderingContext): string => {
  const report = buildGpuTimerReport(gl, getGpuTimerState(gl).samples);
  const fileName = `xigma-gpu-timer-${Date.now()}.json`;
  const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);

  return fileName;
};
