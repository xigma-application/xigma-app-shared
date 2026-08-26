import type { Meta, StoryFn } from '@storybook/react-vite';

// components
import Tooltip from '../Tooltip';

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

const title = 'Tooltip/Basic Tooltip';

export default {
  component: Tooltip,
  title,
} satisfies Meta<typeof Tooltip>;

const Template: StoryFn<typeof Tooltip> = ({ ...args }) => (
  <StoryComponent
    blocksCodeData={[blockCodeData]}
    contentGridFlow={ContentGridFlow.maxFourColumns}
    description={description}
    title="Basic Tooltip"
  >
    {placements.map(({ align, label, side }) => (
      <Tooltip {...args} align={align} content="Tooltip" key={label} side={side}>
        <div
          style={{
            border: '1px solid var(--color-neutral-3)',
            borderRadius: 5,
            color: 'var(--color-neutral-1)',
            fontSize: 12,
            padding: '10px 16px',
          }}
        >
          {label}
        </div>
      </Tooltip>
    ))}
  </StoryComponent>
);

export const BasicTooltip = Template;
