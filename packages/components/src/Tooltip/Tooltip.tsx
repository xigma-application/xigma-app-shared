import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { FC, ReactElement, ReactNode } from 'react';

// styles
import './tooltip.scss';

export type TTooltipProps = {
  /** The tooltip's alignment relative to the trigger. */
  align?: 'center' | 'end' | 'start';
  /** A single child element the tooltip is anchored to. */
  children: ReactElement;
  /** Tooltip content. When empty/undefined, the trigger renders with no tooltip at all. */
  content?: ReactNode;
  /** Which side of the trigger the tooltip renders on. */
  side?: 'bottom' | 'left' | 'right' | 'top';
  /** Distance in pixels between the tooltip and the trigger. */
  sideOffset?: number;
};

/**
 * Built on `@radix-ui/react-tooltip`. Requires a `TooltipProvider` (from `@xigma/core`) somewhere
 * above it in the tree.
 */
export const Tooltip: FC<TTooltipProps> = ({ align = 'center', children, content, side = 'top', sideOffset = 8 }) => {
  if (!content) {
    return children;
  }

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content align={align} className="Tooltip" side={side} sideOffset={sideOffset}>
          {content}
          <TooltipPrimitive.Arrow className="Tooltip__arrow" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

export default Tooltip;
