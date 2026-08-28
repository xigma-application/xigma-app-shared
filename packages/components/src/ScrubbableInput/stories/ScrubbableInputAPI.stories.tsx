import type { Meta, StoryFn } from '@storybook/react-vite';

// components
import ScrubbableInput from '../ScrubbableInput';
import { StoryApi, TStoryBlockCode, TTableBody } from 'storybook-blocks';

const description = [
  `API documentation for the React ScrubbableInput component. It is fully controlled — pass
  <code>value</code> and update it from <code>onChange</code>. While dragging, the component
  requests pointer lock and renders a resize-cursor handle at the pointer.`,
];

const blockCodeData: TStoryBlockCode = {
  imports: [
    {
      items: '{ ScrubbableInput }',
      path: '@xigma/components',
    },
  ],
};

const tableBodyData: Array<TTableBody> = [
  {
    description: 'Content the scrubber is wrapped around (a label, an input, an icon, ...).',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: 'false',
    description: 'Disables the scrubber — pointer events are ignored.',
    name: 'disabled',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: 'When the value hits a bound, wrap around to the opposite bound instead of stopping.',
    name: 'loop',
    type: 'boolean',
  },
  {
    description: 'Upper bound of the value.',
    name: 'max',
    type: 'number',
  },
  {
    description: 'Lower bound of the value.',
    name: 'min',
    type: 'number',
  },
  {
    description: 'Called with the next clamped value on every drag step.',
    name: 'onChange',
    type: '(value: number) => void',
  },
  {
    description: 'Called once when a drag gesture starts.',
    name: 'onMouseDown',
    type: '() => void',
  },
  {
    description: 'Called once when a drag gesture ends.',
    name: 'onMouseUp',
    type: '() => void',
  },
  {
    description: 'The current value.',
    name: 'value',
    type: 'number',
  },
];

const title = 'UI/ScrubbableInput/ScrubbableInput API';

export default {
  component: ScrubbableInput,
  parameters: {
    options: { showPanel: false },
  },
  title,
} satisfies Meta<typeof ScrubbableInput>;

const Template: StoryFn<typeof ScrubbableInput> = () => (
  <StoryApi
    blocksCodeData={[blockCodeData]}
    description={description}
    tableBodyData={tableBodyData}
    title="ScrubbableInput API"
  />
);

export const ScrubbableInputAPI = Template;
