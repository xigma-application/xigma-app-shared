# xigma-app-shared — Roadmap 1.0.0

Pierwszy roadmap tego repo, w tym samym duchu co `docs/ROADMAP.*` w xigma-app — małe, osobne
porcje pracy, checkboxy zaznaczane w miarę postępu. Zakres 1.0.0: **dociągnięcie Storybooka do
pełnego zestawu narzędzi dla komponentów** (Controls, Actions, a11y, story-as-test, autodocs).
Punkt wyjścia: Storybook 10.5 (`@storybook/react-vite`) z `addon-docs` + `addon-themes`, własny
kit `.storybook/blocks` (`StoryApi`/`StoryComponent`) do bogatych stron MDX, świeżo postawiony
Vitest (`vitest.config.ts`, progi coverage 100%).

Kolejność etapów jest celowa — każdy stoi na poprzednim (CSF3 → Controls → Actions → addon-vitest
→ play → composeStories). Etapy 8–9 są niezależne i mogą poczekać.

---

## Etap 1 — migracja Basic-story'ek na CSF3 + natywne `args`

Dziś `BasicIcon` / `BasicTooltip` / `BasicScrubbableInput` to `StoryFn` + `Template` (CSF2) —
Storybook nie zna propsów, więc panel Controls jest pusty. Przejście na obiektowe CSF3
(`export const Basic: Story = { args: { ... } }`) odblokowuje Controls i jest warunkiem
wstępnym autodocs (Etap 7).

- [x] `BasicIcon`, `BasicTooltip`, `BasicScrubbableInput` → CSF3 z `args`
- [x] `argTypes` z `control` / `options` (select dla `name`/`color`/`side`/`align`, `range` dla
      `size`, `boolean` dla `disabled`/`loop`) — bez `table.category`, za mało propsów per
      komponent żeby grupowanie miało sens
- [x] siatki "wszystkie warianty naraz" (obecne demo przez `StoryComponent`) zostają jako
      osobne story bez controls (`AllIcons`, `AllPlacements`, `States` —
      `parameters.controls.disable`)
- [x] `ScrubbableInput` jest kontrolowany — `ControlledScrubbableInput` w story trzyma `useState`
      i spina `value` ↔ `onChange`, Controls dla `value`/`min`/`max`/`loop`/`disabled` działają

## Etap 2 — Actions: podgląd callbacków

- [ ] `fn()` z `storybook/test` na `onChange` / `onMouseDown` / `onMouseUp` (ScrubbableInput)
- [ ] domyślne spy-e w `preview.tsx` (`argTypesRegex: '^on[A-Z].*'`) — każdy `on*` prop logowany
      w panelu Actions bez ręcznego wpinania w każdej story
- [ ] weryfikacja: drag po `ScrubbableInput` sypie serią `onChange(value)` w panelu

## Etap 3 — `@storybook/addon-a11y`

- [ ] `npx storybook add @storybook/addon-a11y`
- [ ] zakładka Accessibility (axe-core) per story
- [ ] `a11y` w `preview.tsx` — globalne reguły, `context`/`element`
- [ ] `parameters.a11y.test = 'error'` — naruszenia a11y jako twardy fail (spina się z Etapem 4,
      gdzie story lecą jako testy)
- [ ] przejrzeć realne trafienia na istniejących komponentach (kontrast tokenów, rola triggera
      Tooltipa, `EWResize` handle jako czysto dekoracyjny)

## Etap 4 — `@storybook/addon-vitest` (story = test)

Największy element. Każda story staje się testem uruchamianym przez Vitest w prawdziwej
przeglądarce (browser mode), a `play()` (Etap 5) leci jako interakcja z krokami widocznymi w UI
Storybooka i w raporcie Vitesta.

- [ ] `npx storybook add @storybook/addon-vitest` (dociąga `@vitest/browser` + `playwright`)
- [ ] `npx playwright install chromium` — lokalnie i w CI
- [ ] `.storybook/vitest.setup.ts` (generowany) — `setProjectAnnotations` z `preview.tsx`
- [ ] `vitest.config.ts` → `test.projects: [ <obecny node/jsdom>, <storybook / browser> ]`
      zamiast pojedynczej konfiguracji
- [ ] progi coverage: zdecydować czy 100% liczone łącznie, czy per-projekt (unit-testy trzymają
      100% na logice, storybook-projekt raczej bez twardego progu)
- [ ] `test` / `test:coverage` w `package.json` uruchamiają oba projekty; osobny `test:stories`
      na sam projekt storybookowy

## Etap 5 — `play()` interaction-testy

- [ ] `ScrubbableInput` — `play` symuluje gest scrubowania (pointer down → `mousemove` z
      `movementX` → up), asercje: `onChange` dostało zklampowaną wartość, handle pojawia się i
      znika, `loop` zawija na granicy
- [ ] `Tooltip` — focus/hover triggera → treść widoczna; brak `content` → sam trigger
- [ ] `Icon` — render named icon, `data-svg-property` recoloring pod motywem
- [ ] docelowo część asercji z `*.spec.tsx` przenosi się tutaj (bliżej realnego renderu)

## Etap 6 — `composeStories` w unit-testach

- [ ] `Icon.spec.tsx` / `Tooltip.spec.tsx` / `ScrubbableInput.spec.tsx` renderują złożone story
      (`composeStories` z `@storybook/react-vite`) zamiast budować drzewo JSX od zera
- [ ] wspólny setup (TooltipProvider, motyw, mocki z `.storybook/preview`) przez
      `setProjectAnnotations` w `test/setup.ts` — jedno źródło prawdy z podglądem
- [ ] usunąć zduplikowany scaffolding z testów, zostawić same asercje

## Etap 7 — autodocs zamiast ręcznych tabel API

- [ ] `tags: ['autodocs']` (globalnie w `preview.tsx` albo per-komponent)
- [ ] JSDoc na `TIconProps` / `TTooltipProps` / `TScrubbableInputProps` — źródło opisów propsów
- [ ] props-table w Docs generowana z typów TS (react-docgen), nie z ręcznego `tableBodyData`
- [ ] `*API.stories.tsx` z ręcznym `tableBodyData` → skasowane lub zredukowane do narracji;
      `.storybook/blocks/StoryApi` zostaje do bogatych, pisanych ręcznie stron MDX
- [ ] sprawdzić że react-docgen ogarnia `forwardRef` (Icon) i `satisfies`/union-typy

## Etap 8 — toolbar-addony i viewport

- [ ] `viewport` — wspólne breakpointy (spięte z `@xigma/scss`), globalny toolbar
- [ ] `measure` / `outline` — w SB10 w corze, wystarczy nie wyłączać; ewentualnie skrót w docs
- [ ] `backgrounds` — zdecydować czy potrzebne obok `addon-themes` (motyw już ustawia tło body)

## Etap 9 — wizualna regresja (później)

Do decyzji, zależnie od tego czy wchodzimy w zewnętrzny serwis:

- **Chromatic** — `build-storybook` + publish w CI, review snapshotów na PR, obsługuje warianty
  motywu z `addon-themes`. SaaS.
- **`@storybook/test-runner` + `jest-image-snapshot`** — snapshoty trzymane w repo, zero
  zewnętrznej zależności, ale ręczna obsługa różnic między maszynami/CI.

Powiązane z sekcją "Deploy — nierozwiązane" w README (gdzie i jak hostować statyczny Storybook).

---

## Related

- README §Storybook — obecny setup (`.storybook/main.ts`, `preview.tsx`, kit `.storybook/blocks`)
- `vitest.config.ts` — projekt node/jsdom + progi coverage 100%, do rozszerzenia w Etapie 4
- skille: `xigma-test-conventions`, `xigma-component-structure`, `xigma-icons`
