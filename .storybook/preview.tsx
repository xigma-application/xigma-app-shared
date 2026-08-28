import type { Preview } from "@storybook/react-vite";

import { withThemeByDataAttribute } from "@storybook/addon-themes";

import { ReactiveDocsContainer } from "./ReactiveDocsContainer";
import { TooltipProvider } from "../packages/core/src/TooltipProvider/TooltipProvider";

import "./styles/index.scss";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: { container: ReactiveDocsContainer },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
    withThemeByDataAttribute({
      themes: {
        dark: "dark",
        light: "light",
      },
      defaultTheme: "dark",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
