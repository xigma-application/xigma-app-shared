import type { Meta, StoryFn } from '@storybook/react-vite';

// components
import Icon from '../Icon';
import { StoryApi, TStoryBlockCode, TTableBody } from 'storybook-blocks';

const description = [
  `API documentation for the React Icon component. Icon also accepts the standard
  <code>SVGProps&lt;SVGSVGElement&gt;</code> (except <code>color</code>, which is typed to the
  theme color keys below, not a CSS color).`,
];

const blockCodeData: TStoryBlockCode = {
  imports: [
    {
      items: '{ Icon }',
      path: '@xigma/components',
    },
  ],
};

const tableBodyData: Array<TTableBody> = [
  {
    defaultValue: "'neutral1'",
    description: "The icon's color — one of @xigma/components's <code>colors</code> theme tokens.",
    name: 'color',
    type: 'keyof typeof colors',
  },
  {
    description: 'Name of the icon from the shared icon set.',
    name: 'name',
    type: 'keyof typeof Icons',
  },
  {
    defaultValue: '16',
    description: 'Width and height of the icon, in pixels.',
    name: 'size',
    type: 'number',
  },
];

const title = 'UI/Icon/Icon API';

export default {
  component: Icon,
  parameters: {
    options: { showPanel: false },
  },
  title,
} satisfies Meta<typeof Icon>;

const Template: StoryFn<typeof Icon> = () => (
  <StoryApi blocksCodeData={[blockCodeData]} description={description} tableBodyData={tableBodyData} title="Icon API" />
);

export const IconAPI = Template;
