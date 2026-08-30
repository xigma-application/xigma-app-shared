import type { Meta, StoryObj } from "@storybook/react-vite";

// components
import Menu from "../Menu";
import MenuItem from "../MenuItem/MenuItem";
import MenuSeparator from "../MenuSeparator/MenuSeparator";
import MenuSub from "../MenuSub/MenuSub";

// others
import { playBasicMenu, playRichMenu } from "./test/BasicMenu.interactions";

// types
import { StoryComponent, TStoryBlockCode } from "storybook-blocks";

const description = [
  `Menu is a Radix dropdown wrapper — pass a <code>trigger</code> and compose the panel from
  <code>MenuItem</code>, <code>MenuSeparator</code> and <code>MenuSub</code>. It supports 4 sides
  × 3 alignments, an optional <code>sideOffset</code>, and can be driven in controlled mode via
  <code>open</code> / <code>onOpenChange</code>.`,
];

const triggerStyle = {
  border: "1px solid var(--color-neutral-3)",
  borderRadius: 5,
  color: "var(--color-neutral-1)",
  fontSize: 12,
  padding: "10px 16px",
};

const basicItems = (
  <>
    <MenuItem label="Undo" />
    <MenuItem label="Redo" />
    <MenuItem label="Cut" />
    <MenuItem label="Copy" />
    <MenuItem label="Paste" />
  </>
);

const richItems = (
  <>
    <MenuItem label="Undo" shortcut="⌘Z" />
    <MenuItem disabled label="Redo" shortcut="⇧⌘Z" />
    <MenuSeparator />
    <MenuItem icon="Lock" label="Lock" selected />
    <MenuItem icon="Unlock" label="Unlock" />
    <MenuSeparator />
    <MenuSub icon="Group" label="Transform">
      <MenuItem label="Rotate 90°" />
      <MenuItem label="Flip horizontal" />
      <MenuItem label="Flip vertical" />
    </MenuSub>
  </>
);

const blockCodeData: TStoryBlockCode = {
  componentName: "Menu",
  imports: [
    {
      items: "{ Menu, MenuItem, MenuSeparator, MenuSub }",
      path: "@xigma/components",
    },
  ],
  props: [
    {
      attributes: [{ name: "trigger", value: "{<span>Edit</span>}" }],
      children: [
        {
          componentName: "MenuItem",
          props: [
            {
              attributes: [
                { name: "label", value: "Undo" },
                { name: "shortcut", value: "⌘Z" },
              ],
            },
          ],
        },
        {
          componentName: "MenuItem",
          props: [
            {
              attributes: [
                { name: "label", value: "Redo" },
                { name: "shortcut", value: "⇧⌘Z" },
                { name: "disabled" },
              ],
            },
          ],
        },
        { componentName: "MenuSeparator", props: [{}] },
        {
          componentName: "MenuItem",
          props: [
            {
              attributes: [
                { name: "icon", value: "Lock" },
                { name: "label", value: "Lock" },
                { name: "selected" },
              ],
            },
          ],
        },
        {
          componentName: "MenuSub",
          props: [
            {
              attributes: [
                { name: "icon", value: "Group" },
                { name: "label", value: "Transform" },
              ],
              children: [
                {
                  componentName: "MenuItem",
                  props: [
                    { attributes: [{ name: "label", value: "Rotate 90°" }] },
                  ],
                },
                {
                  componentName: "MenuItem",
                  props: [
                    {
                      attributes: [{ name: "label", value: "Flip horizontal" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const meta = {
  argTypes: {
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    anchorRef: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    onClick: { table: { disable: true } },
    onCloseAutoFocus: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    open: { table: { disable: true } },
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
    sideOffset: { control: { max: 32, min: 0, step: 1, type: "range" } },
    trigger: { table: { disable: true } },
    triggerAriaLabel: { control: "text" },
    triggerClassName: { table: { disable: true } },
  },
  args: {
    align: "start",
    children: basicItems,
    side: "bottom",
    sideOffset: 8,
    trigger: <span style={triggerStyle}>Open menu</span>,
  },
  component: Menu,
  tags: ["new"],
  title: "UI/Menu/Basic Menu",
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicMenu: Story = {
  play: playBasicMenu,
  render: (args) => (
    <StoryComponent
      blocksCodeData={[]}
      description={description}
      title="Basic Menu"
    >
      <Menu {...args} />
    </StoryComponent>
  ),
};

export const RichMenu: Story = {
  args: {
    children: richItems,
    trigger: <span style={triggerStyle}>Edit</span>,
  },
  parameters: {
    controls: { disable: true },
  },
  play: playRichMenu,
  render: (args) => (
    <StoryComponent
      blocksCodeData={[blockCodeData]}
      description={description}
      title="Basic Menu"
    >
      <Menu {...args} />
    </StoryComponent>
  ),
};
