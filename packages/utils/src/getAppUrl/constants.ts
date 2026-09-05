// types
import { XigmaApp } from './types';

// Each app's dev server must run on this port (e.g. `next dev -p 7000`, `vite --port 7100`) so
// getAppUrl resolves cross-app links correctly in local development.
export const DEV_PORTS: Record<XigmaApp, number> = {
  'xigma-app-website': 7700,
  'xigma-app-design': 7710,
};

// TODO: replace with the real production domains once they're decided.
export const PROD_URLS: Record<XigmaApp, string> = {
  'xigma-app-website': 'https://xigma.app',
  'xigma-app-design': 'https://design.xigma.app',
};
