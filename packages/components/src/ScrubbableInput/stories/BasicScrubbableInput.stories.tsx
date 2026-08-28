import { FC, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';

// components
import ScrubbableInput from '../ScrubbableInput';

// types
import { ContentGridFlow, StoryComponent, TStoryBlockCode } from 'storybook-blocks';

const description = [
  `ScrubbableInput turns any content into a horizontal scrubber — press it and drag left or right
  to change a number. Hold <code>Shift</code> while dragging to move 4× faster, and set
  <code>loop</code> to wrap around once a bound is reached.`,
];

type TFieldProps = {
  disabled?: boolean;
  label: string;
  loop?: boolean;
};

const Field: FC<TFieldProps> = ({ disabled = false, label, loop = false }) => {
  const [value, setValue] = useState(25);

  return (
    <ScrubbableInput disabled={disabled} loop={loop} max={100} min={0} onChange={setValue} value={value}>
      <span
        style={{
          border: '1px solid var(--color-neutral-3)',
          borderRadius: 5,
          color: 'var(--color-neutral-1)',
          fontSize: 12,
          padding: '10px 16px',
        }}
      >
        {label}: {value}
      </span>
    </ScrubbableInput>
  );
};

const blockCodeData: TStoryBlockCode = {
  componentName: 'ScrubbableInput',
  imports: [
    {
      items: '{ ScrubbableInput }',
      path: '@xigma/components',
    },
  ],
  props: [
    {
      attributes: [
        { name: 'min', value: '{0}' },
        { name: 'max', value: '{100}' },
        { name: 'value', value: '{value}' },
        { name: 'onChange', value: '{setValue}' },
      ],
      children: 'Value: {value}',
    },
  ],
  variables: [{ name: '[value, setValue]', type: 'const', value: 'useState(25)' }],
};

const title = 'UI/ScrubbableInput/Basic ScrubbableInput';

export default {
  component: ScrubbableInput,
  title,
} satisfies Meta<typeof ScrubbableInput>;

const Template: StoryFn<typeof ScrubbableInput> = () => (
  <StoryComponent
    blocksCodeData={[blockCodeData]}
    contentGridFlow={ContentGridFlow.column}
    description={description}
    title="Basic ScrubbableInput"
  >
    <Field label="Default" />
    <Field label="Looping" loop />
    <Field disabled label="Disabled" />
  </StoryComponent>
);

export const BasicScrubbableInput = Template;
