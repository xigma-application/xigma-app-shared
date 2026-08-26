export type TComponentAttributes = { name: string; value?: string };

export type TImport = {
  items: string;
  path: string;
};

export type TProps = {
  attributes?: Array<TComponentAttributes>;
  children?: string | Array<TComponents>;
};

export type TComponents = {
  props?: Array<TProps>;
  componentName?: string;
};

export type TVariable = {
  name: string;
  type: 'const' | 'let';
  value: string;
};

export type TStoryBlockCode = TComponents & {
  imports: Array<TImport>;
  variables?: Array<TVariable>;
};
