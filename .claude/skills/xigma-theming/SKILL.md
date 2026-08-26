---
name: xigma-theming
description: How color theming and dark/light mode work in @xigma/scss — CSS custom properties and the colors token map. Load before adding a new color token or touching packages/scss/src/_theme.scss.
---

# xigma-app-shared Theming

Ported from `xigma-app`'s `xigma-theming`. The source-of-truth file (`_theme.scss`) now lives here,
in `@xigma/scss`, not in `xigma-app` — every consuming app should `@use "@xigma/scss/theme"` instead
of keeping its own copy. The `colors.ts` token map and `useTheme` hook described below still live in
`xigma-app` only; they have not been ported to `@xigma/utils` / `@xigma/components` yet (ask before
doing so — see the open question this raises: one copy per app, or a shared `@xigma/utils` export).

No compile-time light/dark class variants — **CSS custom properties** that both SCSS and TSX read
from the same names.

## `packages/scss/src/_theme.scss` — the only place with real hex values

A Sass map per theme + a mixin that emits `--color-*` custom properties:

```scss
$themes: (
  dark: (neutral-1: #ffffff, neutral-2: #b3b3b3, neutral-3: #444444, neutral-4: #2c2c2c, neutral-5: #272727, blue-1: #0d99ff),
  light: (neutral-1: #272727, neutral-2: #6e6e6e, neutral-3: #e6e6e6, neutral-4: #ffffff, neutral-5: #f5f5f5, blue-1: #0d99ff),
);
```

Applied four times, by design:
1. `:root { @include theme-variables(dark); }` — dark is the default.
2. `@media (prefers-color-scheme: light) { :root { ... } }` — auto light when the OS prefers it and
   no explicit choice has been made.
3. `:root[data-theme='dark'] { ... }` / `:root[data-theme='light'] { ... }` — explicit override.
   `[data-theme]` has higher CSS specificity than a bare `:root`, so it **always wins** over the
   media query regardless of source order — no `!important` needed.

Naming scale: `neutral-1` (lightest/text) → `neutral-5` (darkest/deepest background), plus accent
colors like `blue-1`.

## `constant/colors.ts` (currently `xigma-app`-only) — the same tokens, usable in TSX

```ts
export const colors = {
  neutral1: 'var(--color-neutral-1)',
  blue1: 'var(--color-blue-1)',
  // ...
} as const;
```

Each value is the CSS `var()` string, not a resolved hex — so `colors.neutral2` used in an inline
`style` prop is *exactly* the same token as `var(--color-neutral-2)` in a `.module.scss` file, and
both react to theme changes automatically with no re-render needed. Adding a color token means
touching **both** `_theme.scss` here and each app's `colors.ts` — there is no codegen step.

## `hooks/useTheme` (currently `xigma-app`-only) — reading/switching the theme in React

```ts
const { theme, setTheme, toggleTheme } = useTheme();
```

Resolution order on first read: `localStorage['theme']` → `prefers-color-scheme` media query →
`'dark'`. On every change it writes `document.documentElement.dataset.theme` (which is what the
`[data-theme]` CSS rules above key off) and persists to `localStorage`.

## Adding a new color-consuming component

Never write a hex value or hardcode `'light'`/`'dark'` logic in a component. Use `var(--color-*)` in
`.module.scss` — see [[xigma-component-structure]].
