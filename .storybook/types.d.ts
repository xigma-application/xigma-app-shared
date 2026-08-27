declare module '*.scss';

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.svg' {
  import type { FC, SVGProps } from 'react';

  const Component: FC<SVGProps<SVGSVGElement>>;
  export default Component;
}
