import { expect, screen, userEvent, within } from 'storybook/test';

type TPlayContext = { canvasElement: HTMLElement };

export const playBasicTooltip = async ({ canvasElement }: TPlayContext): Promise<void> => {
  const canvas = within(canvasElement);
  const trigger = canvas.getByText('Trigger');

  // result (before): content only mounts once open, so it isn't in the DOM yet
  await expect(canvas.queryByText('Tooltip')).not.toBeInTheDocument();

  // action
  await userEvent.hover(trigger);

  // result: content portals to document.body (outside canvasElement), and TooltipProvider's
  // default 1s enter delay means this needs real time to pass
  const content = await screen.findAllByText('Tooltip', {}, { timeout: 3000 });
  await expect(content[0]).toBeVisible();
};

export const playNoContent = async ({ canvasElement }: TPlayContext): Promise<void> => {
  const canvas = within(canvasElement);

  // an empty/undefined content returns `children` directly (Tooltip.tsx's `if (!content)` early
  // return) — the trigger never gets wrapped by Radix's Trigger at all, so it never picks up a
  // `data-state`, unlike a real (even closed) tooltip trigger would
  await expect(canvas.getByText('Trigger')).not.toHaveAttribute('data-state');
};
