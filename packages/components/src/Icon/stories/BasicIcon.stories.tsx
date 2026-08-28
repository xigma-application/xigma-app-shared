import type { Meta, StoryObj } from "@storybook/react-vite";

// components
import Icon, { TIconProps } from "../Icon";
import { Icons } from "../constants";
import { Tooltip } from "../../Tooltip/Tooltip";

// others
import { colors } from "../../colors";
import { playBasicIcon } from "./test/BasicIcon.interactions";

// types
import {
  ContentGridFlow,
  StoryComponent,
  TStoryBlockCode,
} from "storybook-blocks";

const description = [
  "Use Icon to render one of the icons from the shared icon set. Hover an icon to see its name.",
];

const icons = Object.keys(Icons) as Array<TIconProps["name"]>;

const blockCodeData: TStoryBlockCode = {
  imports: [
    {
      items: "{ Icon }",
      path: "@xigma/components",
    },
  ],
  props: [
    {
      children: icons.map((name) => ({
        componentName: "Icon",
        props: [
          {
            attributes: [
              {
                name: "name",
                value: name,
              },
            ],
          },
        ],
      })),
    },
  ],
};

const meta = {
  argTypes: {
    color: { control: "select", options: Object.keys(colors) },
    name: { control: "select", options: icons },
    size: { control: { max: 64, min: 8, step: 2, type: "range" } },
  },
  args: {
    color: "neutral1",
    name: "Check",
    size: 16,
  },
  component: Icon,
  tags: ["new"],
  title: "UI/Icon/Basic Icon",
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicIcon: Story = {
  play: playBasicIcon,
  render: (args) => (
    <StoryComponent blocksCodeData={[]} description={description} title="Icon">
      <Icon {...args} />
    </StoryComponent>
  ),
};

export const AllIcons: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <StoryComponent
      blocksCodeData={[blockCodeData]}
      contentGridFlow={ContentGridFlow.maxEightColumns}
      description={description}
      title="Icon"
    >
      {icons.map((iconName) => (
        <Tooltip content={iconName} key={iconName}>
          <Icon {...args} name={iconName} />
        </Tooltip>
      ))}
    </StoryComponent>
  ),
};
