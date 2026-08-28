import { render, screen } from '@testing-library/react';

// components
import TooltipProvider from './TooltipProvider';

describe('TooltipProvider behaviors', () => {
  it('should render its children', () => {
    // before
    render(
      <TooltipProvider>
        <span>child</span>
      </TooltipProvider>,
    );

    // result
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('should accept custom delay overrides', () => {
    // before
    render(
      <TooltipProvider skipDelayDuration={0} timeoutEnter={0}>
        <span>child</span>
      </TooltipProvider>,
    );

    // result
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
