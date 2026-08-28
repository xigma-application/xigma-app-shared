import { createRef } from 'react';
import { render } from '@testing-library/react';

// components
import Icon from './Icon';

describe('Icon snapshots', () => {
  it('should render the named icon', () => {
    // before
    const { asFragment } = render(<Icon name="Plus" />);

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Icon behaviors', () => {
  it('should default the size to 16 and the color to the neutral-1 token', () => {
    // before
    const { container } = render(<Icon name="Plus" />);

    // find
    const svg = container.querySelector('svg') as SVGSVGElement;

    // result
    expect(svg).toHaveClass('Icon');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
    expect(svg.style.color).toBe('var(--color-neutral-1)');
  });

  it('should apply the requested color token, size and merged inline style', () => {
    // before
    const { container } = render(<Icon color="blue1" name="Plus" size={24} style={{ opacity: 0.5 }} />);

    // find
    const svg = container.querySelector('svg') as SVGSVGElement;

    // result
    expect(svg).toHaveAttribute('width', '24');
    expect(svg.style.color).toBe('var(--color-blue-1)');
    expect(svg.style.opacity).toBe('0.5');
  });

  it('should forward the ref to the underlying svg element', () => {
    // before
    const ref = createRef<SVGSVGElement>();
    render(<Icon name="Plus" ref={ref} />);

    // result
    expect(ref.current?.tagName).toBe('svg');
  });
});
