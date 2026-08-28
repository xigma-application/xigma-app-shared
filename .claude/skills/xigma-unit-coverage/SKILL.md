---
name: xigma-unit-coverage
description: xigma-app-shared enforces 100% unit test coverage (branches/functions/lines/statements) via vitest.config.ts's coverage.thresholds. Load before saying a change is "done" — run `npm run test:coverage` and add a targeted test for any line the report flags, rather than only running the plain `npx vitest run` suite.
---

# xigma-app-shared Unit Coverage — 100% Enforced

Ported from xigma-app's `xigma-unit-coverage`, adapted to this repo's config file and tooling.

## The threshold is real, not aspirational

`vitest.config.ts`'s `test.coverage` block sets all four metrics to 100%:

```ts
coverage: {
  include: ['packages/*/src/**/*.{ts,tsx}'],
  exclude: ['**/*.spec.{ts,tsx}', '**/*.stories.tsx', '**/index.ts', '**/types.ts', '**/constants.ts', '**/colors.ts', '**/*.d.ts'],
  provider: 'v8',
  thresholds: { branches: 100, functions: 100, lines: 100, statements: 100 },
}
```

`npm run test:coverage` (= `vitest run --coverage`) **fails the run** if any metric drops below
100% — it's not a soft report to eyeball, it's a hard gate. `npx vitest run` (no `--coverage`)
passing is not sufficient proof a change is finished in this repo; that command doesn't check
thresholds at all, so a change can pass every test and still leave the coverage gate red.

Excluded on purpose: barrel `index.ts` files (pure re-exports), `types.ts` (type-only, no runtime
code), `Icon/constants.ts` (the generated SVG-import registry), `colors.ts` (a static token map) —
everything else, including every hook/util/component you touch, is held to the same 100% bar.

## Workflow

1. After implementing (or before calling a change complete), run `npm run test:coverage`.
2. If it fails, the report's **Uncovered Line #s** column pinpoints the exact gap per file — read
   the flagged lines directly rather than guessing which test to add.
3. Add a test that exercises that specific branch/line — not a padding assertion that happens to
   touch the line incidentally. If the gap is a whole conditional branch (an `if`/default-param
   path that's never taken the other way), the missing test is usually "the input/gesture that
   takes the *other* path," not a duplicate of an existing test.
4. Re-run `npm run test:coverage` until clean, then also run `npx tsc -p tsconfig.json --noEmit`
   (catches type errors in `.stories.tsx`, which coverage doesn't touch since they're excluded)
   and, if any Storybook file changed, `npm run build-storybook`.

This repo has no `prettier`/`eslint` script yet (see root `package.json`), so there is no
formatting step to run after — unlike xigma-app's version of this skill.

## Worked example: a default/no-op path never exercised

`ScrubbableInput.tsx` defines `const noop = (): void => {};` as the default for the optional
`onMouseDown`/`onMouseUp` props. Every existing test either passed explicit `onMouseDown`/
`onMouseUp` mocks, or never fired a mouse event at all — so `noop` itself was never *called*,
and function coverage stayed under 100% despite every other branch of the component being green.
The fix wasn't new component logic, just a test that exercises the default:

```tsx
it('should fall back to no-op handlers when onMouseDown and onMouseUp are omitted', () => {
  // before
  render(
    <ScrubbableInput max={100} min={0} onChange={vi.fn()} value={0}>
      <span>child</span>
    </ScrubbableInput>,
  );

  // action
  fireEvent.mouseDown(getRoot(), { clientX: 0, clientY: 0 });
  fireEvent.mouseUp(getRoot());

  // result
  expect(document.querySelector('svg')).not.toBeInTheDocument();
});
```

This is a common shape of coverage gap here: a component's *default* prop value (a `noop`, a
default numeric constant) reads as "trivially covered" because the line defining it runs on
import, but the function/branch itself only counts as covered once something actually invokes it
with no override supplied.

## Related

[[xigma-test-act-wrapping]] — wrap a raw `dispatchEvent`/`.click()` sequence added while chasing a
coverage gap in `act()` if it triggers a React state update read by the mounted tree.
[[xigma-test-conventions]] — the `describe`/`it` naming and step-comment shape any coverage-gap
test should still follow; a coverage-driven test is not an excuse to skip the convention.
