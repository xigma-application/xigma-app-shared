# xigma-app-shared

Współdzielony frontend dla aplikacji Xigma rozbitych na subdomeny. Zamiast publikować paczki
na jakikolwiek rejestr npm, każda apka-konsument ściąga najnowszy `main` tego repo skryptem
i kopiuje go do własnego `node_modules/@xigma/*`.

## Struktura

```
packages/
  components/   @xigma/components — komponenty React (TSX, budowane przez tsup do JS + .d.ts + .css)
  utils/        @xigma/utils      — funkcje pomocnicze JS/TS (budowane przez tsup)
  scss/         @xigma/scss       — zmienne i mixiny SCSS (bez builda, surowe pliki .scss)
  assets/       @xigma/assets     — surowe assety (na razie: 106 ikon SVG z xigma-app, bez builda)
scripts/
  xigma-pull.js          skrypt do skopiowania do repo apki-konsumenta
  xigma.json.example     przykładowa konfiguracja dla apki-konsumenta
```

Każdy pakiet jest niezależny (npm workspaces) — apka-konsument może wciągnąć tylko te,
których potrzebuje.

## Rozwój w tym repo

```bash
npm install
npm run build      # buduje wszystkie pakiety (workspaces --if-present)
```

- Nowy komponent React: `packages/components/src/<Nazwa>/`, wyeksportowany w
  `packages/components/src/index.ts`.
- Nowy util: `packages/utils/src/`, wyeksportowany w `packages/utils/src/index.ts`.
- Nowy mixin/token SCSS: `packages/scss/src/mixins/` / `_variables.scss` / `_theme.scss`,
  dorzucony do `packages/scss/src/index.scss` i do `exports` w `packages/scss/package.json`.
- Nowa ikona: wrzuć `.svg` do `packages/assets/svg/` (z atrybutem `data-svg-property="fill"`/`"stroke"`
  na przekolorowywanych elementach — patrz `xigma-icons`), dodaj import + wpis do `Icons` w
  `packages/components/src/Icon/svg.ts` (ten sam wzorzec co `assets/svg.ts` w xigma-app).

### `@xigma/components`: SCSS i SVG bez CSS Modules ani Vite

`tsup`/esbuild (w odróżnieniu od Vite, którego używa Storybook) nie ma wbudowanego wsparcia dla
SCSS, CSS Modules ani `*.svg?react`. `packages/components/tsup.config.ts` dokłada dwa własne
pluginy esbuild, żeby zachowanie było identyczne jak w Storybooku:

- **sass** — kompiluje `.scss` przez prawdziwy `sass` (z `NodePackageImporter`, żeby
  `@use '@xigma/scss/...'` działało tak samo jak w Vite) i wrzuca gotowe CSS do `dist/index.css`.
  Ponieważ nie ma tu CSS Modules, komponenty używają zwykłych, globalnych nazw klas (BEM,
  `xigma-scss-bem`) zamiast `styles.ComponentName` — pliki stylów nazywamy więc `nazwa.scss`,
  **nie** `nazwa.module.scss` (ta druga nazwa włączyłaby w Vite/Storybooku automatyczne haszowanie
  klas, którego build tsup i tak nie robi — rozjazd między dev a paczką).
- **svgr** — na bieżąco zamienia `import X from '.../plik.svg?react'` na komponent React (przez
  `@svgr/core`), dokładnie to co `vite-plugin-svgr` robi w Storybooku (`.storybook/main.ts`). Nic
  nie zapisuje na dysk.

`@xigma/scss`'s mixiny (`svg-color`, `disabled`) używają `:global(...)` — to dla apek z prawdziwym
CSS Modules (xigma-app, x-design). Tutaj (ani w tsup, ani w Storybooku) CSS Modules nie ma, więc
oba pluginy (esbuild i PostCSS w `.storybook/main.ts`) zdejmują `:global(...)` po kompilacji,
zamiast forkować mixiny.

## Storybook

Dokumentacja/podgląd komponentów z `@xigma/components` — Vite + Storybook 10
(`@storybook/react-vite`). Story'ki i sam design system **nie są kopiowane z x-design** —
tylko tooling (config, przełącznik light/dark, globalny SCSS) jest stąd zaadaptowany.

```bash
npm run storybook          # dev server, http://localhost:6006
npm run build-storybook    # statyczny build do storybook-static/
```

- `.storybook/main.ts` — skanuje `packages/*/src/**/*.stories.@(ts|tsx)` i `*.mdx`.
- `.storybook/preview.tsx` — ładuje `.storybook/styles/index.scss` (tokeny + motyw z
  `@xigma/scss`) i przełącznik light/dark przez `@storybook/addon-themes`
  (`withThemeByDataAttribute`, ustawia `data-theme` na `<html>` — dokładnie ten atrybut, na
  którym opiera się `@xigma/scss/theme`), zamiast starszego mechanizmu z manager-addonem
  z x-design.
- Nowy komponent dostaje story'ka w swoim folderze (`packages/components/src/<Nazwa>/<Nazwa>.stories.tsx`).

### `.storybook/blocks` — kit do pisania dokumentacji w MDX

Przeniesiony z x-design (`src/stories/components/*`) zestaw komponentów do budowania bogatych
stron dokumentacji (`.mdx`), nie sam design system:

- `StoryApi` — cała strona dokumentacji jednego komponentu (tytuł, opis, live-demo, blok kodu,
  tabela propsów).
- `StoryComponent` — sekcja z tytułem/opisem/live-demo + opcjonalnym blokiem kodu.
- `StoryPropsTable` — tabela propsów.
- `StoryBlockCode` — pseudo-podświetlany blok kodu (importy/zmienne/przykłady JSX).
- `StoryBlockWarning` — dymek ostrzeżenia w treści dokumentacji.

Zaadaptowane względem x-design: brak zależności od `useTheme`/`constant/colors` (tło body
ustawione czystym CSS w `.storybook/styles/index.scss` na `var(--color-neutral-4)`, reaguje na
`[data-theme]` automatycznie) i brak `lodash` (zastąpione lokalnymi jednolinijkowymi utilami).
Pominięty `Configure.mdx` — to generyczna strona powitalna Storybooka ze stockowymi obrazkami,
niespecyficzna dla x-design.

```tsx
import { StoryApi, StoryBlockWarning } from '../../../.storybook/blocks';
```

## Użycie w apce-konsumencie

1. Skopiuj `scripts/xigma-pull.js` do repo apki (np. do `scripts/`).
2. Dodaj plik `xigma.json` w katalogu głównym apki (wzór: `scripts/xigma.json.example`):

   ```json
   {
     "repo": "git@github.com:xigma/xigma-app-shared.git",
     "branch": "main",
     "packages": ["components", "utils", "scss", "assets"]
   }
   ```

3. Uruchom skrypt:

   ```bash
   node scripts/xigma-pull.js
   ```

   Skrypt klonuje `main` do katalogu tymczasowego, buduje pakiety (`npm install` + `npm run build`
   w środku) i kopiuje wynik (`dist/`, `package.json`, dla scss — `src/`) do
   `node_modules/@xigma/<pakiet>`. Katalog tymczasowy jest kasowany na końcu.

4. Opcjonalnie wpiąć jako `postinstall` w `package.json` apki, żeby zawsze aktualizowało się
   przy `npm install`:

   ```json
   {
     "scripts": {
       "postinstall": "node scripts/xigma-pull.js"
     }
   }
   ```

### Import w kodzie apki

```tsx
import { Icon } from "@xigma/components";
import "@xigma/components/index.css"; // raz, gdziekolwiek apka ładuje swój globalny CSS

import { someUtil } from "@xigma/utils";

<Icon name="Check" color="blue1" size={16} />
```

```scss
@use "@xigma/scss/theme";
@use "@xigma/scss/mixins/svg-color";

.card {
  color: var(--color-neutral-1);
  @include svg-color.svg-color(var(--color-blue-1));
}
```

Uwaga: `@xigma/components` jest budowany do zwykłego JS (nie wymaga transpilacji TSX przez
bundler apki-konsumenta), `react`/`react-dom` to `peerDependencies` — muszą już być w apce.

## Wersjonowanie

Na razie zawsze najnowszy `main` — brak pinowania po tagu/commicie. Do rozważenia później,
jeśli zajdzie potrzeba większej kontroli.

## Deploy

Nierozwiązane — do ogarnięcia później.
