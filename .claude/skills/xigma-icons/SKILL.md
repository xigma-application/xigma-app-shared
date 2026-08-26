---
name: xigma-icons
description: How SVG icons work in xigma-app today (the vite-plugin-svgr pipeline, the data-svg-property recoloring mechanism, and the Icon component) — kept here as reference for when the Icon component and icon set get ported into @xigma/components. Load before porting shared/UI/Icon, or when deciding how @xigma/components should ship icons.
---

# xigma Icons (reference — not yet ported into this repo)

Kept from `xigma-app`'s `xigma-icons` as reference. `Icon` and the `assets/svg` icon set have not
been moved into `@xigma/components` yet — this doc describes how they currently work in `xigma-app`
so a future port can decide what changes.

**Open problem for the port**: `xigma-app`'s pipeline is `vite-plugin-svgr` (Vite-specific,
transforms `.svg?react` imports into React components at build time). `@xigma/components` is built
once with `tsup` and consumed by apps that may not use Vite. Before porting `Icon`, decide whether
the 84 SVGs get pre-compiled to React components at `@xigma/components` build time (tsup can do
this with a loader) instead of relying on each consuming app having `vite-plugin-svgr` configured —
don't just copy the `?react` import convention as-is without checking it survives the tsup build.

## The `data-svg-property` mechanism (the whole point, and this part **does** port as-is)

Icon source files mark the elements that should be recolorable with `data-svg-property="fill"` or
`="stroke"`, instead of a hardcoded color:

```svg
<path d="..." data-svg-property="fill" fill="white"/>
```

`fill="white"` is just a placeholder so the raw SVG still looks right if opened directly — it gets
overridden at runtime. `Icon.module.scss` targets that attribute:

```scss
:global([data-svg-property='fill']) { fill: currentColor; }
:global([data-svg-property='stroke']) { stroke: currentColor; }
```

A CSS attribute-selector rule beats an element's own `fill="..."` presentation attribute in the
cascade, so one SVG asset can be recolored per-instance via `currentColor` — no per-icon variants,
no JS prop-drilling into internal `<path>` elements. This mixin already lives in
`@xigma/scss/mixins/svg-color` (ported), so the port doesn't need to redo it — just consume it.

## `xigma-app`'s current pipeline: `vite-plugin-svgr`

```ts
svgr({ svgrOptions: { titleProp: true, ref: true } })
```

SVGO is off by default in this plugin, so `data-svg-property` and other custom attributes survive
untouched. Import syntax uses the `?react` suffix:

```ts
import Logo from './svg/logo.svg?react';
```

## `assets/svg.ts` — the `Icons` barrel

One `import X from './svg/name.svg?react'` + barrel-object entry per icon, PascalCase names
(`Logo`, `Close`, `ChevronDown`, ...). All 84 are imported eagerly in `xigma-app` today.

## `shared/UI/Icon/Icon.tsx` (current `xigma-app` shape)

```tsx
<Icon name="Logo" color="blue1" size={32} />
```

- `name: keyof typeof Icons` — type-checked against the barrel, typos are compile errors.
- `color?: keyof typeof colors` (default `'neutral1'`) — one of [[xigma-theming]]'s tokens, applied
  by setting `style={{ color: colors[color] }}` on the root `<svg>` so `currentColor` picks it up.
  `colors` (`constant/colors.ts`) isn't ported into this repo yet either — see [[xigma-theming]].

## Porting checklist (not done yet)

1. Decide the SVG→component pipeline for a tsup-built package (see "Open problem" above).
2. Bring the 84 SVG files + `assets/svg.ts` barrel over, or reference them from wherever they end up.
3. Port `Icon.tsx` + `Icon.module.scss`, per [[xigma-component-structure]].
4. Port (or decide the shared home for) `constant/colors.ts`, per [[xigma-theming]].
