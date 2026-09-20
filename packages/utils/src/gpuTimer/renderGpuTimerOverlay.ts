export const renderGpuTimerOverlay = (
  overlay: HTMLDivElement,
  enabled: boolean,
  toggleKey: string,
  saveKey: string,
  savedFile: string | null,
): void => {
  overlay.textContent =
    `GPU TIMER: ${enabled ? 'ON' : 'OFF'}\nCtrl+${toggleKey.toUpperCase()} on/off, Ctrl+${saveKey.toUpperCase()} save JSON` +
    (savedFile ? `\nsaved: ${savedFile}` : '');
};
