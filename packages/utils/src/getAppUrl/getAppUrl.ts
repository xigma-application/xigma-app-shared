// others
import { DEV_PORTS, PROD_URLS } from './constants';

// types
import { XigmaApp, XigmaEnv } from './types';

// Callers pass their own env (e.g. Next.js's process.env.NODE_ENV, Vite's import.meta.env.MODE)
// since this package can't read either bundler's env mechanism itself.
export const getAppUrl = (app: XigmaApp, env: XigmaEnv): string => {
  if (env === 'production') {
    return PROD_URLS[app];
  }

  return `http://localhost:${DEV_PORTS[app]}`;
};

export default getAppUrl;
