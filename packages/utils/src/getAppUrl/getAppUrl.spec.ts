// others
import { getAppUrl } from './getAppUrl';

describe('getAppUrl behaviors', () => {
  it('should return the dev localhost url for xigma-app-website', () => {
    // result
    expect(getAppUrl('xigma-app-website', 'development')).toBe('http://localhost:7700');
  });

  it('should return the dev localhost url for xigma-app-design', () => {
    // result
    expect(getAppUrl('xigma-app-design', 'development')).toBe('http://localhost:7710');
  });

  it('should return the dev localhost url for xigma-fonts-library', () => {
    // result
    expect(getAppUrl('xigma-fonts-library', 'development')).toBe('http://localhost:7720');
  });

  it('should return the production url for xigma-app-website', () => {
    // result
    expect(getAppUrl('xigma-app-website', 'production')).toBe('https://xigma.app');
  });

  it('should return the production url for xigma-app-design', () => {
    // result
    expect(getAppUrl('xigma-app-design', 'production')).toBe('https://design.xigma.app');
  });

  it('should return the production url for xigma-fonts-library', () => {
    // result
    expect(getAppUrl('xigma-fonts-library', 'production')).toBe('https://fonts.xigma.app');
  });
});
