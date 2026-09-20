export type TGpuTimerSample = {
  frame: number;
  name: string;
  ms: number;
};

export type TGpuTimerQuery = {
  frame: number;
  name: string;
  query: WebGLQuery;
};

export type TDisjointTimerExtension = {
  GPU_DISJOINT_EXT: number;
  TIME_ELAPSED_EXT: number;
};

export type TGpuTimerMode = 'frame' | 'sections';

export type TGpuTimerState = {
  active: TGpuTimerQuery | null;
  enabled: boolean;
  extension: TDisjointTimerExtension | null;
  frame: number;
  mode: TGpuTimerMode;
  pending: TGpuTimerQuery[];
  samples: TGpuTimerSample[];
};

export type TGpuTimerOptions = {
  saveKey?: string;
  toggleKey?: string;
};

export type TGpuTimerSectionSummary = {
  avgCallMs: number;
  avgPerFrameMs: number;
  calls: number;
  frames: number;
  maxCallMs: number;
  maxPerFrameMs: number;
};
