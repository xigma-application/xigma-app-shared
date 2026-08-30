import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { transform } from "@svgr/core";
import jsx from "@svgr/plugin-jsx";
import type { Plugin } from "esbuild";
import * as sass from "sass";
import { defineConfig } from "tsup";

const toPkgScheme = (source: string): string =>
  source.replace(
    /(@use|@forward|@import)(\s+)(['"])(@xigma\/)/g,
    "$1$2$3pkg:$4",
  );

const stripCssModulesGlobal = (css: string): string =>
  css.replace(/:global\(([^)]+)\)/g, "$1");

const sassPlugin: Plugin = {
  name: "sass",
  setup(build) {
    build.onLoad({ filter: /\.scss$/ }, (args) => {
      const source = toPkgScheme(readFileSync(args.path, "utf8"));
      const result = sass.compileString(source, {
        url: pathToFileURL(args.path),
        importers: [new sass.NodePackageImporter()],
      });

      return { contents: stripCssModulesGlobal(result.css), loader: "css" };
    });
  },
};

// Matches `import X from '.../foo.svg'` — with or without vite-plugin-svgr's `?react` query —
// and turns it into a React component. Accepting the bare form is what lets `declare module
// '*.svg'` (src/global.d.ts) power editor path-completion for the svg/ folder;
// .storybook/main.ts's svgr({ include: '**/*.svg' }) is the Storybook-side equivalent.
const svgrPlugin: Plugin = {
  name: "svgr",
  setup(build) {
    build.onResolve({ filter: /\.svg(\?react)?$/ }, async (args) => {
      // build.resolve() re-runs this same onResolve (esbuild doesn't skip the calling
      // plugin), and the resolved path still ends in .svg — so guard against the recursion.
      if (args.pluginData?.svgrResolved) return;

      const resolved = await build.resolve(args.path.replace(/\?react$/, ""), {
        resolveDir: args.resolveDir,
        kind: args.kind,
        pluginData: { svgrResolved: true },
      });

      if (resolved.errors.length > 0) {
        return { errors: resolved.errors };
      }

      return { path: resolved.path, namespace: "svgr" };
    });

    build.onLoad({ filter: /.*/, namespace: "svgr" }, async (args) => {
      const svgCode = readFileSync(args.path, "utf8");
      const componentName = path
        .basename(args.path, ".svg")
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

      const jsxCode = await transform(
        svgCode,
        { ref: true, titleProp: false, svgo: false, plugins: [jsx] },
        { componentName },
      );

      return {
        contents: jsxCode,
        loader: "jsx",
        resolveDir: path.dirname(args.path),
      };
    });
  },
};

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "@radix-ui/react-tooltip",
    "@radix-ui/react-dropdown-menu",
  ],
  esbuildPlugins: [sassPlugin, svgrPlugin],
});
