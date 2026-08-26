import type { Meta, StoryFn } from '@storybook/react-vite';

// components
import Icon, { TIconProps } from '../Icon';
import { Icons } from '../constants';

// types
import { ContentGridFlow, StoryComponent, TStoryBlockCode } from 'storybook-blocks';

const description = ['Use Icon to render one of the icons from the shared icon set.'];

const icons = Object.keys(Icons);

const blockCodeData: TStoryBlockCode = {
  imports: [
    {
      items: '{ Icon }',
      path: '@xigma/components',
    },
  ],
  props: [
    {
      children: icons.map((name) => ({
        componentName: 'Icon',
        props: [
          {
            attributes: [
              {
                name: 'name',
                value: name,
              },
            ],
          },
        ],
      })),
    },
  ],
};

const title = 'Icon/Basic Icon';

export default {
  component: Icon,
  title,
} satisfies Meta<typeof Icon>;

const Template: StoryFn<typeof Icon> = ({ ...args }) => (
  <StoryComponent
    blocksCodeData={[blockCodeData]}
    contentGridFlow={ContentGridFlow.maxEightColumns}
    description={description}
    title="Icon"
  >
    {icons.map((iconName) => (
      <Icon {...args} name={iconName as TIconProps['name']} key={iconName} />
    ))}
  </StoryComponent>
);

export const BasicIcon = Template;
