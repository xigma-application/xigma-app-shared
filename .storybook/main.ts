import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

import type { Plugin as PostcssPlugin } from "postcss";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const stripCssModulesGlobal: PostcssPlugin = {
  postcssPlugin: "strip-css-modules-global",
  Rule(rule) {
    rule.selector = rule.selector.replace(/:global\(([^)]+)\)/g, "$1");
  },
};

const config: StorybookConfig = {
  stories: [
    "../packages/*/src/**/*.mdx",
    "../packages/*/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-mcp",
    "storybook-addon-tag-badges",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      tsconfigPath: path.resolve(
        __dirname,
        "../packages/components/tsconfig.json",
      ),
    },
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [
        svgr({
          svgrOptions: { ref: true, titleProp: false },
        }),
      ],
      resolve: {
        alias: {
          "storybook-blocks": path.resolve(__dirname, "blocks"),
        },
      },
      css: {
        postcss: {
          plugins: [stripCssModulesGlobal],
        },
      },
    }),
};

export default config;
