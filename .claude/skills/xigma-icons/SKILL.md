---
name: xigma-icons
description: How SVG icons work in @xigma/components — the data-svg-property recoloring mechanism, the Icon component, and the two parallel SVG→React pipelines (vite-plugin-svgr for Storybook, a matching esbuild plugin for the tsup package build). Load before adding an icon, touching packages/components/src/Icon, packages/assets/svg, or packages/components/tsup.config.ts's svgr plugin.
---

# xigma-app-shared Icons

Ported from `xigma-app`'s `Icon` + `assets/svg` (106 icons). Unlike most things in this repo,
this one required solving a real build problem: `xigma-app` only needs `vite-plugin-svgr` because
it only ever builds with Vite, but `@xigma/components` is built once with `tsup`/esbuild and
consumed by apps that may use any bundler — so the SVG→React transform has to happen **inside this
repo's own build**, not be left for the consumer to configure.

## The `data-svg-property` mechanism (unchanged from xigma-app)

Icon source files (`packages/assets/svg/*.svg`) mark recolorable elements with
`data-svg-property="fill"` or `="stroke"` instead of a hardcoded color:

```svg
<path d="..." data-svg-property="fill" fill="white"/>
```

`fill="white"` is just a placeholder so the raw SVG still looks right opened directly — it's
overridden at runtime. `Icon/icon.scss` targets that attribute via `@xigma/scss/mixins/svg-color`
(ported, unmodified — see [[xigma-theming]]):

```scss
@use '@xigma/scss/mixins/svg-color';

.Icon {
  @include svg-color.svg-color;
}
```

## `packages/assets/svg/` — the raw SVGs (`@xigma/assets`)

106 files, copied verbatim from `xigma-app/src/assets/svg/`, kept in their own package (not nested
under `components`) so other packages/apps could reference the raw assets directly if needed.
`@xigma/assets/package.json`'s `exports` map (`"./svg/*": "./svg/*"`) is what lets both pipelines
below resolve `@xigma/assets/svg/<name>.svg` through normal Node/bundler package resolution.

## `packages/components/src/Icon/svg.ts` — the `Icons` barrel

Same shape as `xigma-app`'s `assets/svg.ts`, one `import X from '@xigma/assets/svg/name.svg?react'`
+ barrel-object entry per icon, PascalCase names. This is a real, committed source file — **not**
generated at build/install time (an earlier attempt at codegen here was reverted; the barrel is
maintained the same way `xigma-app` maintains its own, by hand/sed, and lives in git like any other
source file). Adding an icon means adding both the raw `.svg` in `@xigma/assets/svg/` and the
import + barrel entry here.

## Two pipelines, kept in sync on purpose

`import X from '.../name.svg?react'` needs a loader that turns the SVG into a React component.
Two different tools do this job in two different contexts, and **both must be kept aligned** (same
svgr options — `ref: true`, `titleProp: false`, `svgo: false` — same result) or Storybook and the
published package will visually diverge:

- **Storybook (Vite)**: `.storybook/main.ts`'s `viteFinal` adds `vite-plugin-svgr` — same plugin
  `xigma-app` itself uses.
- **The `@xigma/components` package build (tsup/esbuild)**: esbuild has no svgr loader, so
  `packages/components/tsup.config.ts` defines a small custom esbuild plugin (`svgrPlugin`) that
  does the equivalent transform at build time using `@svgr/core` directly — `onResolve` hands the
  `?react`-suffixed specifier to esbuild's own resolver (`build.resolve`, so bare package
  specifiers like `@xigma/assets/svg/x.svg` still go through node_modules/`exports` resolution
  correctly — a plain `path.resolve` here was tried and is wrong, it only handles relative paths),
  then `onLoad` reads the real `.svg` file and runs it through `@svgr/core` in memory. Nothing is
  written to disk — the transform happens per-build, same as Vite's.

If `titleProp`/`ref`/`svgo` options ever need to change, change them in **both** places
(`.storybook/main.ts`'s `svgr(...)` call and `tsup.config.ts`'s `transform(...)` call).

## No CSS Modules here — a second divergence from `xigma-app`, handled the same way twice

`@xigma/scss`'s `svg-color`/`disabled` mixins emit `:global(...)` for CSS-Modules consumers
(`xigma-app`, x-design). Neither of this repo's own two build pipelines (tsup, Storybook) runs CSS
Modules — see [[xigma-component-structure]] for why `Icon/icon.scss` is a plain `.scss` file, not
`.module.scss`. `:global(...)` left untouched would ship as literal (invalid, ignored) CSS in both
pipelines, so each one strips it after compiling, without touching the shared mixin (which stays
correct for its primary CSS-Modules consumers):

- tsup: `stripCssModulesGlobal` regex on the compiled CSS string, in `tsup.config.ts`'s `sassPlugin`.
- Storybook: a one-rule PostCSS plugin (`stripCssModulesGlobal`) wired into `viteFinal`'s
  `css.postcss.plugins`, in `.storybook/main.ts`.

## `Icon.tsx`

```tsx
<Icon name="Check" color="blue1" size={16} />
```

- `name: keyof typeof Icons` — type-checked against the barrel; the published package's bundled
  `.d.ts` preserves this as a real 106-member literal union (verified after the port — not widened
  to `string`), so a typo in `name` is still a compile error for consumers.
- `color?: keyof typeof colors` (default `'neutral1'`) — `colors` now lives in
  `packages/components/src/colors.ts` (ported from `xigma-app`'s `constant/colors.ts`; nothing
  else needed it yet, so it wasn't split into its own package — revisit if that changes) and is
  re-exported from `@xigma/components`'s root `index.ts`.

## Adding a new icon

1. Export the SVG with `data-svg-property="fill"`/`"stroke"` on the elements that should recolor.
2. Drop it in `packages/assets/svg/`.
3. Add the import + barrel entry to `packages/components/src/Icon/svg.ts`, alphabetically, PascalCase.
