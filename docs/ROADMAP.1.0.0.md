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

### ⚠️ Pułapka: coverage widziane tylko z projektu `storybook` straszy fałszywym czerwonym raportem

Dotyczy **trzech** równoważnych ścieżek, wszystkich ograniczonych do samego projektu `storybook`:
`npm run test:stories -- --coverage`, `vitest run --project=storybook --coverage`, i — co mniej
oczywiste — **widget testowy wbudowany w Storybooka** (`npm run storybook`, ikonka probówki w
sidebarze). Ten ostatni z definicji strukturalnie nie wie nic o osobnym projekcie `unit` (jsdom) w
`vitest.config.ts` — zna tylko story'ki, więc nawet po dodaniu `play()` w Etapie 5 nigdy nie
odpali `utils/test/*.spec.ts` i podobnych dedykowanych jsdom-owych testów. Np. `ScrubbableInput/utils`
(`getRevertValue`/`handleUpdateMousePosition`) wychodzi tam na ~77-80%, mimo 100% w pełnym przebiegu
— play() na `ScrubbableInput` dotyka tej logiki tylko częściowo przy okazji dragu, resztę pokrywają
wyłącznie dedykowane testy jednostkowe, które żyją tylko w projekcie `unit`.

Coverage w Vitest 3.2 z `projects` jest **jeden, na roocie**, wspólny dla całego procesu — nie da
się go sensownie ograniczyć per-projekt ani sprawić, żeby widget Storybooka "widział" drugi projekt.
**To nie jest regresja** — prawdziwa bramka to `npm run test:coverage` (bez `--project`, oba
projekty naraz), zweryfikowana wielokrotnie z rzędu na czysto jako 100%. `test:stories` i widget w
Storybooku służą tylko do szybkiej iteracji nad samymi story'kami — bez `--coverage`, i bez
traktowania ich coverage jako miarodajnego.

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
- [x] **zrobione**: podbita paleta w `StoryBlockCode`'s SCSS do ≥4.5:1 (liczone skryptem WCAG
      relative-luminance na tle `#444444`, minimalna zmiana lightness w HSL zachowująca odcień —
      `#999999→#b1b1b1`, `#1ea6fb→#50bafc`, `#9876aa→#bfaaca`, `#cc7832→#dea677`; `#a6e22e`,
      `#a9b7c6`, `#eaeef3` już spełniały próg, nietknięte), `a11y.context.exclude` w `preview.tsx`
      zdjęty. Zweryfikowane: pełny `vitest run --coverage` zielony (16/39/100%) **bez** wyłączenia
      — realna naprawa, nie tylko zdjęty workaround

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

- [x] `Icon` — render + `data-svg-property` recoloring pod motywem: real Chromium potwierdza, że
      `fill: currentcolor` faktycznie resolvuje na obliczony kolor Icon, i że to token motywu, nie
      sztywna wartość (przełączenie `data-theme` w trakcie testu zmienia wynik)
- [x] `Tooltip` — hover triggera → treść widoczna (Portal renderuje poza `canvasElement`, więc
      asercja idzie przez globalny `screen`, nie scoped `canvas`); brak `content` → osobna story
      `NoContent`, trigger nigdy nie dostaje `data-state` od Radixa (dowód, że wczesny `return
      children` w `Tooltip.tsx` faktycznie omija Radixa, nie tylko "wygląda tak samo")
- [x] `ScrubbableInput` — `play` symuluje gest scrubowania (mousedown → `mousemove` z
      `movementX` → mouseup), asercje: `onChange`/wyświetlana wartość dostają zklampowaną liczbę,
      handle pojawia się i znika, `loop` zawija na granicy (`States`, pole "Looping")
- [x] logika testów **w osobnym pliku** obok `*.stories.tsx` (`stories/test/<Nazwa>.interactions.ts`,
      wzorem `hooks/test/`/`utils/test/` z [[xigma-test-conventions]]) — story same zostają krótkie,
      `play: playX` to jedna linijka; pliki `stories/test/**` wyłączone z progu coverage 100% (jak
      `*.spec.*`), bo to kod testowy, nie produkcyjny
- [x] część asercji z `*.spec.tsx` przeniesiona do `play()` — tam gdzie to była realna
      duplikacja (nie wszędzie: Icon zostawiony bez zmian, `play()` tam sprawdza tylko rzeczy,
      których jsdom fizycznie nie potrafi — `currentcolor`/motyw — więc nic nie dublował):
      - `Tooltip.spec.tsx`: usunięty test "no content → sam trigger" — `stories/test/
        BasicTooltip.interactions.ts`'s `playNoContent` dowodzi tego samego mocniej (`data-state`
        nigdy nie trafia na trigger, nie tylko "coś się wyrenderowało"), i ten sam story i tak
        renderuje się w projekcie `storybook` w ramach tego samego `vitest run --coverage`, więc
        pokrycie gałęzi `if (!content)` w `Tooltip.tsx` nie ucierpiało (potwierdzone: nadal 100%)
      - `ScrubbableInput.spec.tsx`: test dragu przycięty do samego progowania przez
        `onChange`/`onMouseDown`/`onMouseUp` (mock-call assercje — to jsdom robi tak samo dobrze
        jak przeglądarka). Widoczność handle'a i aktualizacja wyświetlanej wartości zostały tylko w
        `playBasicScrubbableInput` (realny render/portal); `playStates`' pokrycie zawijania na
        granicy i tak nigdy nie miało odpowiednika w jsdom, więc to czysty przyrost, nie migracja
      - zweryfikowane: `vitest run --coverage` 16 plików / 38 testów (było 39, -1 za usunięty
        duplikat) / 100%, wielokrotnie z rzędu na czysto

### Po drodze: dwa realne problemy złapane i naprawione

- **Produkcyjny bug, nie tylko testowy**: `useMouseDownEvent.ts`'s
  `inputRef.current.requestPointerLock()` rzucał w prawdziwej przeglądarce (addon-vitest/Playwright)
  `WrongDocumentError` jako nieobsłużony reject Promise — bez tego play() na `ScrubbableInput` nie
  mógł w ogóle przejść. Naprawione `.catch(() => {})` — pointer lock to "nice to have" przy dragu,
  jego odmowa (np. w iframe, restrykcyjna przeglądarka) nie powinna nigdy zostawiać nieobsłużonego
  rejecta u konsumenta paczki. `test/setup.ts`'s jsdom mock zaktualizowany żeby zwracał
  `Promise.resolve()` (jak prawdziwe DOM API), nie `undefined`.
- **Wyścig `window.dispatchEvent` vs. React**: surowy `window.dispatchEvent(mousemove)` omija
  React'a całkowicie, więc nie daje mu sygnału żeby zflushować passive effect
  (`useMouseMoveEvent`'s nasłuchiwacz, dodawany w `useEffect`) — mousedown mógł jeszcze nie
  skomitować, kiedy kolejna linia już dispatchowała mousemove w pustkę. Fix: `dragTo` helper w
  `stories/test/BasicScrubbableInput.interactions.ts` re-dispatchuje wewnątrz `waitFor` zamiast
  jednego strzału — dispatch przed podłączeniem listenera to no-op, retry łapie ten, który trafia
  po (patrz [[xigma-test-act-wrapping]] — ten sam problem co `act()`, tylko bez `act()` jako
  dostępnego narzędzia w play()).

## Etap 6 — `composeStories` w unit-testach

- [x] `setProjectAnnotations(preview)` w `test/setup.ts` — jedno źródło prawdy: każdy `composeStories`
      w unit-testach dostaje te same dekoratory co prawdziwy Storybook (`TooltipProvider`, motyw)
- [x] `unit`-owy projekt w `vitest.config.ts` dostał alias `storybook-blocks` (potrzebny, bo specy
      teraz importują realne `*.stories.tsx`, które go używają) — ten sam wzorzec co przy debugowaniu
      w Etapach 2/3
- [x] `Tooltip.spec.tsx` — pełne przejście na `composeStories(BasicTooltip, NoContent)`: zniknął
      ręczny `<TooltipPrimitive.Provider delayDuration={0}>` wrapper, bo dekorator z preview robi to
      samo. Świadomie **nie** przyspieszałem `delayDuration` z powrotem — realny `TooltipProvider`
      (1s domyślny delay) teraz też przechodzi przez unit-test, tylko że `fireEvent.focus` (w
      odróżnieniu od hover) w Radiksie i tak otwiera natychmiast, więc czasu nie przybyło
- [x] `Icon.spec.tsx` — **częściowe** przejście: `composeStories(BasicIcon)` tylko dla testów
      default/override propsów (gdzie realnie usuwał duplikację); snapshot i ref-forwarding
      zostały na gołym `<Icon>` świadomie, nie z lenistwa — zobacz niżej
- [x] `ScrubbableInput.spec.tsx` — **częściowe**: `composeStories(BasicScrubbableInput)` dla
      render/disabled/drag; test "no-op handlers gdy pominięte" zostaje na gołym `<ScrubbableInput>`
      świadomie — zobacz niżej
- [x] usunięty zduplikowany scaffolding tam, gdzie faktycznie był duplikacją, nie wszędzie na siłę

### Dlaczego nie 100% composeStories wszędzie

`composeStories` nie nadaje się do każdego testu — dwa realne ograniczenia, nie lenistwo:

1. **Snapshot Icon.spec.tsx** — `BasicIcon`'s story renderuje przez `<StoryComponent>` (tytuł,
   opis, wrapper `<section>`) — to chrome dokumentacji Storybooka, nie część `Icon`. Zesnapshotowanie
   przez to sprzęgłoby test jednostkowy Icon z treścią opisu w story'ce (zmiana copy w opisie
   złamałaby snapshot Icon, mimo że Icon się nie zmienił) — zostało na gołym `<Icon name="Plus" />`,
   dokładnie to i tylko to, co snapshot ma sprawdzać.
2. **`ScrubbableInput`'s "no-op handlers" test** — `meta.args` w story ZAWSZE dostarcza
   `onMouseDown`/`onMouseUp` (jako `fn()`, na potrzeby panelu Actions z Etapu 2) —
   `composeStories`' nadpisywanie propsów nie potrafi **usunąć** domyślnego argu, więc nie da się
   przez nią przetestować faktycznie pominiętego propa (ścieżki domyślnej `noop` w
   `ScrubbableInput.tsx`). Zostało na gołym `<ScrubbableInput>` bez tych propsów w ogóle.
   Podobnie ref-forwarding w Icon — `composeStories`' komponent nie gwarantuje przekazania `ref`
   dalej, to mechanizm Reacta na poziomie samego `Icon`, nie coś do przetestowania przez story.

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
