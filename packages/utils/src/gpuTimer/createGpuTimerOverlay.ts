export const createGpuTimerOverlay = (): HTMLDivElement => {
  const overlay = document.createElement('div');

  overlay.style.cssText =
    'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;padding:12px 20px;border-radius:8px;' +
    'background:rgba(0,0,0,0.8);color:#fff;font:600 16px/1.4 monospace;text-align:center;pointer-events:none;white-space:pre';
  document.body.appendChild(overlay);

  return overlay;
};
