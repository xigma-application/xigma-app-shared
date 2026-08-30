import { CSSProperties, RefObject } from 'react';

// types
import { TVirtualAnchor } from '../types';

export const getAnchorTriggerStyle = (anchorRef: RefObject<TVirtualAnchor>): CSSProperties => {
  const rect = anchorRef.current?.getBoundingClientRect() ?? new DOMRect();

  return {
    height: rect.height,
    left: rect.left,
    pointerEvents: 'none',
    position: 'fixed',
    top: rect.top,
    width: rect.width,
  };
};
