import { FC, useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// components
import ScrubbableInput, { TScrubbableInputProps } from '../ScrubbableInput';

// types
import { ContentGridFlow, StoryComponent, TStoryBlockCode } from 'storybook-blocks';

const description = [
  `ScrubbableInput turns any content into a horizontal scrubber — press it and drag left or right
  to change a number. Hold <code>Shift</code> while dragging to move 4× faster, and set
  <code>loop</code> to wrap around once a bound is reached.`,
];

const fieldStyle = {
  border: '1px solid var(--color-neutral-3)',
  borderRadius: 5,
  color: 'var(--color-neutral-1)',
  fontSize: 12,
  padding: '10px 16px',
};

// ScrubbableInput is fully controlled — this keeps Storybook's `value` control as the initial
// value while letting drags update the live value shown in the field.
const ControlledScrubbableInput: FC<TScrubbableInputProps> = ({ onChange, value: initialValue, ...props }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (nextValue: number): void => {
    setValue(nextValue);
    onChange(nextValue);
  };

  return (
    <ScrubbableInput {...props} onChange={handleChange} value={value}>
      <span style={fieldStyle}>Value: {value}</span>
    </ScrubbableInput>
  );
};

type TField = {
  disabled?: boolean;
  label: string;
  loop?: boolean;
};

const fields: Array<TField> = [
  { label: 'Default' },
  { label: 'Looping', loop: true },
  { disabled: true, label: 'Disabled' },
];

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

const meta = {
  argTypes: {
    children: { table: { disable: true } },
    disabled: { control: 'boolean' },
    loop: { control: 'boolean' },
    max: { control: 'number' },
    min: { control: 'number' },
    onChange: { table: { disable: true } },
    value: { control: 'number' },
  },
  args: {
    disabled: false,
    loop: false,
    max: 100,
    min: 0,
    onChange: (): void => {},
    value: 25,
  },
  component: ScrubbableInput,
  title: 'UI/ScrubbableInput/Basic ScrubbableInput',
} satisfies Meta<typeof ScrubbableInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicScrubbableInput: Story = {
  render: (args) => <ControlledScrubbableInput {...args} />,
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <StoryComponent
      blocksCodeData={[blockCodeData]}
      contentGridFlow={ContentGridFlow.column}
      description={description}
      title="Basic ScrubbableInput"
    >
      {fields.map(({ disabled, label, loop }) => (
        <ControlledScrubbableInput {...args} disabled={disabled} key={label} loop={loop} />
      ))}
    </StoryComponent>
  ),
};
