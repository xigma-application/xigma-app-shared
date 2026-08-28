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
    "@storybook/addon-vitest"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    // 'react-docgen' (the default) is babel/AST-based and doesn't resolve real TS types —
    // 'react-docgen-typescript' runs the actual TS compiler, needed for autodocs' props table to
    // get forwardRef (Icon), Omit<>, and union-typed props right instead of falling back to
    // 'unknown'/blank descriptions
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      // without this the plugin resolves the *root* tsconfig.json, whose `include` only covers
      // .storybook/**/*.stories.tsx — not the component source files themselves — and silently
      // skips docgen for every one of them ("not included in the active TypeScript project")
      tsconfigPath: path.resolve(__dirname, "../packages/components/tsconfig.json"),
    },
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [
        // no `include` override: vite-plugin-svgr's default (`**/*.svg?react`) is what every
        // icon import in Icon/constants.ts actually uses. Overriding it to a bare `**/*.svg`
        // glob stops matching the `?react`-suffixed ids entirely (the glob doesn't span the
        // query string), so svgr's `load` hook never fires and Vite's built-in asset plugin
        // resolves the import to a data: URL string instead of a React component — Icon then
        // tries `createElement(dataUrl, ...)` and crashes at runtime the moment it renders.
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
