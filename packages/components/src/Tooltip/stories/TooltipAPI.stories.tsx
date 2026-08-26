import type { Meta, StoryFn } from '@storybook/react-vite';

// components
import Tooltip from '../Tooltip';
import { StoryApi, TStoryBlockCode, TTableBody } from 'storybook-blocks';

const description = [
  'API documentation for the React Tooltip component, built on <code>@radix-ui/react-tooltip</code>. Requires a <code>TooltipProvider</code> (from <code>@xigma/components/core</code>) somewhere above it in the tree.',
];

const blockCodeData: TStoryBlockCode = {
  imports: [
    {
      items: '{ Tooltip }',
      path: '@xigma/components',
    },
  ],
};

const tableBodyData: Array<TTableBody> = [
  {
    defaultValue: "'center'",
    description: "The tooltip's alignment relative to the trigger.",
    name: 'align',
    type: "'center' | 'end' | 'start'",
  },
  {
    description: 'A single child element the tooltip is anchored to.',
    name: 'children',
    type: 'ReactElement',
  },
  {
    description: 'Tooltip content. When empty/undefined, the trigger renders with no tooltip at all.',
    name: 'content',
    type: 'ReactNode',
  },
  {
    defaultValue: "'top'",
    description: 'Which side of the trigger the tooltip renders on.',
    name: 'side',
    type: "'bottom' | 'left' | 'right' | 'top'",
  },
  {
    defaultValue: '8',
    description: 'Distance in pixels between the tooltip and the trigger.',
    name: 'sideOffset',
    type: 'number',
  },
];

const title = 'UI/Tooltip/Tooltip API';

export default {
  component: Tooltip,
  parameters: {
    options: { showPanel: false },
  },
  title,
} satisfies Meta<typeof Tooltip>;

const Template: StoryFn<typeof Tooltip> = () => (
  <StoryApi blocksCodeData={[blockCodeData]} description={description} tableBodyData={tableBodyData} title="Tooltip API" />
);

export const TooltipAPI = Template;
