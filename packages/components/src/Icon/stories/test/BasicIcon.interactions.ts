import { expect } from 'storybook/test';

type TPlayContext = { canvasElement: HTMLElement };

export const playBasicIcon = async ({ canvasElement }: TPlayContext): Promise<void> => {
  const svg = canvasElement.querySelector('svg') as SVGSVGElement;
  await expect(svg).toBeInTheDocument();

  // @xigma/scss's svg-color mixin routes data-svg-property="fill" descendants through
  // `fill: currentcolor` — confirm that actually resolves to the Icon's own computed color, not a
  // hardcoded value
  const coloredPath = svg.querySelector('[data-svg-property="fill"]') as SVGPathElement;
  await expect(getComputedStyle(coloredPath).fill).toBe(getComputedStyle(svg).color);

  // and that it tracks the *theme token*, not a static color: flipping data-theme must change the
  // resolved value
  const root = document.documentElement;
  const originalTheme = root.dataset.theme;
  const fillBeforeToggle = getComputedStyle(coloredPath).fill;

  root.dataset.theme = originalTheme === 'dark' ? 'light' : 'dark';
  await expect(getComputedStyle(coloredPath).fill).not.toBe(fillBeforeToggle);

  root.dataset.theme = originalTheme;
};
