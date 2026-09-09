declare module '*.scss';

declare module '*.svg' {
  const Component: import('react').FC<import('react').SVGProps<SVGSVGElement>>;
  export default Component;
}

declare module '*.svg?react' {
  const Component: import('react').FC<import('react').SVGProps<SVGSVGElement>>;
  export default Component;
}
