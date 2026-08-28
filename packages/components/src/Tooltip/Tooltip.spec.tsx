import { composeStories } from '@storybook/react-vite';
import { fireEvent, render, screen } from '@testing-library/react';

// components
import * as stories from './stories/BasicTooltip.stories';

const { BasicTooltip } = composeStories(stories);

// the no-content case (`if (!content) return children` in Tooltip.tsx — the trigger never gets
// wrapped by Radix at all) is asserted in a real browser instead, closer to the actual render:
// stories/test/BasicTooltip.interactions.ts's playNoContent proves it more precisely there
// (asserting the trigger never picks up Radix's `data-state`), and that story's own render
// already contributes to this file's coverage via the combined `vitest run --coverage`.
describe('Tooltip behaviors', () => {
  it('should reveal the content once the trigger is focused', async () => {
    // before
    render(<BasicTooltip />);

    // action
    fireEvent.focus(screen.getByText('Trigger'));

    // result: TooltipProvider's default 1s enter delay (via setProjectAnnotations, same as
    // Storybook's own preview) means this needs real time to pass
    expect(await screen.findAllByText('Tooltip', {}, { timeout: 2000 })).not.toHaveLength(0);
  });

  it('should honour custom align, side and sideOffset props', async () => {
    // before
    render(<BasicTooltip align="start" content="hint" side="bottom" sideOffset={4} />);

    // action
    fireEvent.focus(screen.getByText('Trigger'));

    // result
    expect(await screen.findAllByText('hint', {}, { timeout: 2000 })).not.toHaveLength(0);
  });
});
