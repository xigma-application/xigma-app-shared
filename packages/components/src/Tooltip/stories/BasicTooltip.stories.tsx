import type { Meta, StoryObj } from '@storybook/react-vite';

// components
import Tooltip from '../Tooltip';

// others
import { playBasicTooltip, playNoContent } from './test/BasicTooltip.interactions';

// types
import { ContentGridFlow, StoryComponent, TStoryBlockCode } from 'storybook-blocks';

const description = ['Tooltip supports 4 sides × 3 alignments — 12 placements in total.'];

type TPlacement = {
  align: 'center' | 'end' | 'start';
  label: string;
  side: 'bottom' | 'left' | 'right' | 'top';
};

const placements: Array<TPlacement> = [
  { align: 'start', label: 'TOP-START', side: 'top' },
  { align: 'center', label: 'TOP-CENTER', side: 'top' },
  { align: 'end', label: 'TOP-END', side: 'top' },
  { align: 'start', label: 'RIGHT-START', side: 'right' },
  { align: 'center', label: 'RIGHT-CENTER', side: 'right' },
  { align: 'end', label: 'RIGHT-END', side: 'right' },
  { align: 'start', label: 'BOTTOM-START', side: 'bottom' },
  { align: 'center', label: 'BOTTOM-CENTER', side: 'bottom' },
  { align: 'end', label: 'BOTTOM-END', side: 'bottom' },
  { align: 'start', label: 'LEFT-START', side: 'left' },
  { align: 'center', label: 'LEFT-CENTER', side: 'left' },
  { align: 'end', label: 'LEFT-END', side: 'left' },
];

const triggerStyle = {
  border: '1px solid var(--color-neutral-3)',
  borderRadius: 5,
  color: 'var(--color-neutral-1)',
  fontSize: 12,
  padding: '10px 16px',
};

const blockCodeData: TStoryBlockCode = {
  componentName: 'Tooltip',
  imports: [
    {
      items: '{ Tooltip }',
      path: '@xigma/components',
    },
  ],
  props: placements.map(({ align, side }) => ({
    attributes: [
      { name: 'content', value: 'Tooltip' },
      { name: 'side', value: `'${side}'` },
      { name: 'align', value: `'${align}'` },
    ],
  })),
};

const meta = {
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    children: { table: { disable: true } },
    content: { control: 'text' },
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    sideOffset: { control: { max: 32, min: 0, step: 1, type: 'range' } },
  },
  args: {
    align: 'center',
    children: <div style={triggerStyle}>Trigger</div>,
    content: 'Tooltip',
    side: 'top',
    sideOffset: 8,
  },
  component: Tooltip,
  title: 'UI/Tooltip/Basic Tooltip',
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicTooltip: Story = {
  play: playBasicTooltip,
  render: (args) => (
    <StoryComponent blocksCodeData={[]} description={description} title="Basic Tooltip">
      <Tooltip {...args} />
    </StoryComponent>
  ),
};

export const NoContent: Story = {
  args: {
    content: undefined,
  },
  parameters: {
    controls: { disable: true },
  },
  play: playNoContent,
  render: (args) => (
    <StoryComponent blocksCodeData={[]} title="No content">
      <Tooltip {...args} />
    </StoryComponent>
  ),
};

export const AllPlacements: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <StoryComponent
      blocksCodeData={[blockCodeData]}
      contentGridFlow={ContentGridFlow.maxFourColumns}
      description={description}
      title="Basic Tooltip"
    >
      {placements.map(({ align, label, side }) => (
        <Tooltip {...args} align={align} content="Tooltip" key={label} side={side}>
          <div style={triggerStyle}>{label}</div>
        </Tooltip>
      ))}
    </StoryComponent>
  ),
};
