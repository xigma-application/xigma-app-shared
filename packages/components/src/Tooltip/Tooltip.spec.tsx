import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { fireEvent, render, screen } from '@testing-library/react';

// components
import Tooltip from './Tooltip';

const renderTooltip = (content?: string): ReturnType<typeof render> =>
  render(
    <TooltipPrimitive.Provider delayDuration={0}>
      <Tooltip content={content}>
        <button type="button">trigger</button>
      </Tooltip>
    </TooltipPrimitive.Provider>,
  );

describe('Tooltip behaviors', () => {
  it('should render the trigger untouched when there is no content', () => {
    // before
    renderTooltip();

    // result
    expect(screen.getByRole('button', { name: 'trigger' })).toBeInTheDocument();
  });

  it('should reveal the content once the trigger is focused', async () => {
    // before
    renderTooltip('hint');

    // action
    fireEvent.focus(screen.getByRole('button', { name: 'trigger' }));

    // result
    expect(await screen.findAllByText('hint')).not.toHaveLength(0);
  });

  it('should honour custom align, side and sideOffset props', async () => {
    // before
    render(
      <TooltipPrimitive.Provider delayDuration={0}>
        <Tooltip align="start" content="hint" side="bottom" sideOffset={4}>
          <button type="button">trigger</button>
        </Tooltip>
      </TooltipPrimitive.Provider>,
    );

    // action
    fireEvent.focus(screen.getByRole('button', { name: 'trigger' }));

    // result
    expect(await screen.findAllByText('hint')).not.toHaveLength(0);
  });
});
