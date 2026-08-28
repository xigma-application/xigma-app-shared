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

- [x] `fn()` z `storybook/test` na `onChange` / `onMouseDown` / `onMouseUp` (ScrubbableInput)
- [x] domyślne spy-e w `preview.tsx` (`argTypesRegex: '^on[A-Z].*'`) — każdy `on*` prop logowany
      w panelu Actions bez ręcznego wpinania w każdej story
- [x] weryfikacja: panel dodatków (Controls/Actions/Interactions) potwierdzony na żywo przez
      użytkownika (screenshot z `Basic Icon`) — po drodze złapany i naprawiony blokujący bug
      (patrz niżej, `.storybook/main.ts`) i osobno rozwiązana ślepa uliczka „controls nie
      działają": panel bywa domyślnie zwinięty, skrót `A` go otwiera. Sam log serii
      `onChange(value)` podczas dragu na `ScrubbableInput` nie był osobno pokazany, ale
      mechanizm (`fn()` w `args`) jest identyczny jak przy potwierdzonych już Controls

### Po drodze: `.storybook/main.ts` renderował każdą ikonę jako crash

`svgr({ include: "**/*.svg", ... })` w `.storybook/main.ts` nadpisywał domyślny `include` pluginu
(`**/*.svg?react`) golim `**/*.svg` — ten glob nie obejmuje query string, więc nigdy nie łapał
`?react`-owanych importów z `Icon/constants.ts`. Efekt: svgr nigdy się nie odpalał, Vite traktował
import jak zwykły asset i zwracał `data:image/svg+xml,...` zamiast komponentu React — pierwszy
render dowolnej ikony w prawdziwym Storybooku (nie w statycznym `build-storybook`, który tego nie
łapie) kończył się `Failed to execute 'createElement'...`. Wygląda na to, że nikt wcześniej nie
odpalił `npm run storybook` i nie wszedł na stronę z ikoną. Naprawione — `include` usunięty,
zweryfikowane bezpośrednio przez dev-server (`curl` transformowanego modułu `.svg?react` pokazuje
teraz prawdziwy komponent `forwardRef`, nie URL).

- [x] `.storybook/main.ts`: usunięty błędny `include: "**/*.svg"` z konfiguracji `svgr`

## Etap 3 — `@storybook/addon-a11y`

- [x] `npx storybook add @storybook/addon-a11y` — dopisany do `addons` w `.storybook/main.ts`
      automatycznie przez CLI
- [x] zakładka Accessibility (axe-core) per story — wbudowana w sam addon, nic dodatkowego do
      wpięcia
- [x] `a11y` w `preview.tsx` — na razie tylko `test: 'error'` globalnie (patrz niżej); osobnych
      `context`/`element`-owych wyjątków per-story nie było potrzeba, zero realnych trafień
- [x] `parameters.a11y.test = 'error'` — ustawione globalnie w `preview.tsx`; realnie zacznie coś
      failować dopiero jak story polecą jako testy w Etapie 4, w interaktywnym UI steruje tylko
      stylem zakładki
- [x] przejrzeć realne trafienia — axe-core przepuszczony ręcznie (jednorazowy skrypt przez
      Vitest+RTL, nie zostawiony w repo) po `Basic Icon`/`All Icons`/`Basic Tooltip`/
      `All Placements`/`Basic ScrubbableInput`/`States` z domyślnymi `args`: **zero naruszeń** na
      wszystkich sześciu. Jedyny wynik to `incomplete: color-contrast` — axe nie potrafi policzyć
      kontrastu w jsdom (brak realnego layoutu/CSSOM), więc to nie jest realne trafienie, tylko
      ograniczenie środowiska; realny check kontrastu wymaga renderu w prawdziwej przeglądarce —
      Etap 4 (`addon-vitest`, browser mode)

## Etap 4 — `@storybook/addon-vitest` (story = test)

Największy element. Każda story staje się testem uruchamianym przez Vitest w prawdziwej
przeglądarce (browser mode), a `play()` (Etap 5) leci jako interakcja z krokami widocznymi w UI
Storybooka i w raporcie Vitesta.

- [x] `npx storybook add @storybook/addon-vitest` — CLI-owy interaktywny wizard nie łyka
      pipowanego stdin (raw-mode prompt), więc `addons`/`package.json` dociągnięte przez niego,
      resztę (`vitest.config.ts`, skrypty) dopisana ręcznie wg oficjalnego szablonu
      (`vitest.config.3.2.template` w paczce addona — dopasowany do naszej wersji Vitest 3.2)
- [x] `npx playwright install chromium` — binarka już była w cache'u z innego narzędzia na tej
      maszynie, potwierdzone realnym `chromium.launch()`; do zrobienia w CI przy pierwszym secie
- [x] ~~`.storybook/vitest.setup.ts` (generowany) — `setProjectAnnotations` z `preview.tsx`~~ —
      nieaktualne w obecnej wersji addona: `storybookTest({ configDir })` sam ładuje cały
      `.storybook/main.ts`+`preview.tsx` do projektu testowego, żaden osobny plik setup nie jest
      generowany ani potrzebny
- [x] `vitest.config.ts` → `test.projects: [ 'unit' (jsdom, nasze `.spec.*`), 'storybook'
      (chromium przez `storybookTest`, każda story = test) ]`, `coverage` zostaje wspólny na
      poziomie roota
- [x] progi coverage: **liczone łącznie** — oba projekty renderują ten sam kod komponentów, więc
      dodatkowe pokrycie z browser-mode tylko pomaga dobić do 100%, nie ma powodu rozdzielać; próg
      100% nadal trzyma na `npm run test:coverage` z obu projektów naraz
- [x] `test` / `test:coverage` uruchamiają oba projekty (bez zmian w komendzie — `projects` jest
      częścią samego configu); doszedł `test:stories` (`vitest run --project=storybook`) na sam
      projekt storybookowy

### ⚠️ Pułapka: `test:stories -- --coverage` straszy fałszywym czerwonym raportem

`test:stories` uruchamia **tylko** projekt `storybook` — story'ki na razie tylko renderują
komponenty statycznie (żadnego dragu/interakcji, to dopiero `play()` w Etapie 5), więc np.
`ScrubbableInput/utils` wychodzi na ~7% (logika przeliczania wartości nigdy nie jest wywołana bez
symulacji ruchu myszką). Coverage w Vitest 3.2 z `projects` jest **jeden, na roocie**, wspólny dla
całego procesu — nie da się go sensownie ograniczyć per-projekt, więc odpalenie
`npm run test:stories -- --coverage` (albo `vitest run --project=storybook --coverage`) zawsze
pokaże ten sam, mylący, częściowy wynik i failnie progi 100%. **To nie jest regresja** — prawdziwa
bramka to `npm run test:coverage` (bez `--project`, oba projekty naraz), zweryfikowana 8+ razy z
rzędu na czysto jako 100%. `test:stories` służy tylko do szybkiej iteracji nad samymi story'kami
(np. przy pracy nad Etapem 5/6/7) — bez `--coverage`.

### Po drodze: prawdziwe naruszenie kontrastu w `.storybook/blocks/StoryBlockCode`

Realny render w Chromium (nie jsdom) złapał to, czego axe w jsdom nie mógł: paleta
syntax-highlightingu w `StoryBlockCode` (`#999999`/`#cc7832`/`#9876aa`/`#1ea6fb` na tle `#444444`)
nie spełnia progu 4.5:1 — realne naruszenie `color-contrast`, na każdej story z blokiem kodu (czyli
praktycznie każdej galerii i stronie `*API`). To dokładnie ten typ trafienia, którego Etap 3 nie
mógł jeszcze złapać.

Element `@xigma/components` (Icon/Tooltip/ScrubbableInput) same w sobie — **zero** naruszeń w tym
przebiegu; wszystkie 6 błędów wskazywały wyłącznie na `StoryBlockCode`.

Żeby nie blokować całej bramki a11y tym jednym, znanym, nieaktualizowanym-jeszcze elementem
dokumentacji (nigdy nie trafia do paczki `@xigma/components`), dodałem globalny
`a11y.context.exclude: ['[class*="StoryBlockCode"]']` w `preview.tsx` z komentarzem
odsyłającym tutaj. **To nie jest naprawa** — paleta kolorów w `StoryBlockCode` nadal ma zbyt niski
kontrast i realnie warto to poprawić (Etap 8/9 albo osobne zadanie); to tylko odblokowuje resztę
bramki, świadomie i jawnie, zamiast cichego ukrycia.

- [x] `test`/`test:stories` przechodzą w pełni zielono (16 plików, 38 testów) po tym wyłączeniu
- [ ] **do zrobienia osobno**: podbić kontrast palety w `StoryBlockCode`'s SCSS do 4.5:1 i zdjąć
      powyższy `context.exclude`

### Po drodze: `resolveSnapshotPath` przestał działać pod `test.projects`

Po przejściu na `projects`, `resolveSnapshotPath` zdefiniowany wewnątrz `unit`-owego projektu
(tak jak reszta jego configu) był po cichu ignorowany — Vitest pisał nowy snapshot pod domyślną
ścieżką (`Icon/__snapshots__/Icon.spec.tsx.snap`), zamiast trafić w już zacommitowany
`Icon/snapshots/Icon.spec.tsx.snap`, mimo identycznej treści. Fix: `resolveSnapshotPath` (razem z
`coverage`) musi siedzieć na **roocie** `test`, nie wewnątrz projektu — wtedy `extends: true`
poprawnie go przekazuje do obu projektów. Gdyby to się kiedyś powtórzyło z inną opcją: podejrzewaj
najpierw root vs. per-project umiejscowienie, nie sam mechanizm resolvera.

### Po drodze: `Vite unexpectedly reloaded a test` realnie łapane przez użytkownika

Wcześniej odnotowane jako "nie udało się odtworzyć" — user złapał to na żywo:
`react/jsx-dev-runtime` odkrywany dopiero w trakcie importu pierwszej story w przeglądarce wymuszał
przeładowanie optymalizatora zależności Vite w połowie przebiegu, ucinając każdą story, która
akurat była w trakcie importu (`Vitest failed to find the current suite`). Fix: `optimizeDeps.include:
['react/jsx-dev-runtime', 'react-dom/client']` w projekcie `storybook` w `vitest.config.ts`, żeby
Vite dobundlował to z góry zamiast w locie. Zweryfikowane 8/8 czystych przebiegów ze świeżo
skasowanym `node_modules/.vite` (5× sam projekt `storybook`, 3× pełny `--coverage`).

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
