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
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [
        svgr({
          include: "**/*.svg",
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
