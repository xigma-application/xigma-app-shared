// others
import { GPU_TIMER_FRAME_SECTION } from './constants';

// types
import { TGpuTimerSample, TGpuTimerSectionSummary } from './types';

const average = (values: number[]): number => (values.length > 0 ? values.reduce((total, value) => total + value, 0) / values.length : 0);

const summarizeSection = (samples: TGpuTimerSample[]): TGpuTimerSectionSummary => {
  const callMs = samples.map((sample) => sample.ms);
  const msByFrame = new Map<number, number>();

  samples.forEach((sample) => msByFrame.set(sample.frame, (msByFrame.get(sample.frame) ?? 0) + sample.ms));

  const perFrameMs = [...msByFrame.values()];

  return {
    avgCallMs: average(callMs),
    avgPerFrameMs: average(perFrameMs),
    calls: callMs.length,
    frames: perFrameMs.length,
    maxCallMs: Math.max(0, ...callMs),
    maxPerFrameMs: Math.max(0, ...perFrameMs),
  };
};

export const buildGpuTimerReport = (gl: WebGL2RenderingContext, samples: TGpuTimerSample[]): object => {
  const names = [...new Set(samples.map((sample) => sample.name))].sort((first, second) =>
    first === GPU_TIMER_FRAME_SECTION ? -1 : second === GPU_TIMER_FRAME_SECTION ? 1 : first.localeCompare(second),
  );

  return {
    createdAt: new Date().toISOString(),
    devicePixelRatio: window.devicePixelRatio,
    drawingBuffer: { height: gl.drawingBufferHeight, width: gl.drawingBufferWidth },
    samples,
    summary: Object.fromEntries(names.map((name) => [name, summarizeSection(samples.filter((sample) => sample.name === name))])),
    userAgent: navigator.userAgent,
  };
};
