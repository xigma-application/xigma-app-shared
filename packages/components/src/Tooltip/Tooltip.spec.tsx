import { composeStories } from '@storybook/react-vite';
import { fireEvent, render, screen } from '@testing-library/react';

// components
import * as stories from './stories/BasicTooltip.stories';

const { BasicTooltip, NoContent } = composeStories(stories);

describe('Tooltip behaviors', () => {
  it('should render the trigger untouched when there is no content', () => {
    // before
    render(<NoContent />);

    // result
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

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
