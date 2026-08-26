# xigma-app-shared

Współdzielony frontend dla aplikacji Xigma rozbitych na subdomeny. Zamiast publikować paczki
na jakikolwiek rejestr npm, każda apka-konsument ściąga najnowszy `main` tego repo skryptem
i kopiuje go do własnego `node_modules/@xigma/*`.

## Struktura

```
packages/
  components/   @xigma/components — komponenty React (TSX, budowane przez tsup do JS + .d.ts)
  utils/        @xigma/utils      — funkcje pomocnicze JS/TS (budowane przez tsup)
  scss/         @xigma/scss       — zmienne i mixiny SCSS (bez builda, surowe pliki .scss)
scripts/
  xigma-pull.js         skrypt do skopiowania do repo apki-konsumenta
  xigma.json.example    przykładowa konfiguracja dla apki-konsumenta
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
- Nowy mixin/zmienna SCSS: `packages/scss/src/_mixins.scss` / `_variables.scss`.

## Użycie w apce-konsumencie

1. Skopiuj `scripts/xigma-pull.js` do repo apki (np. do `scripts/`).
2. Dodaj plik `xigma.json` w katalogu głównym apki (wzór: `scripts/xigma.json.example`):

   ```json
   {
     "repo": "git@github.com:xigma/xigma-app-shared.git",
     "branch": "main",
     "packages": ["components", "utils", "scss"]
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
import { Button } from "@xigma/components";
import { chunk } from "@xigma/utils";
```

```scss
@use "@xigma/scss/mixins" as *;

.card {
  @include flex-center;
}
```

Uwaga: `@xigma/components` jest budowany do zwykłego JS (nie wymaga transpilacji TSX przez
bundler apki-konsumenta), `react`/`react-dom` to `peerDependencies` — muszą już być w apce.

## Wersjonowanie

Na razie zawsze najnowszy `main` — brak pinowania po tagu/commicie. Do rozważenia później,
jeśli zajdzie potrzeba większej kontroli.

## Deploy

Nierozwiązane — do ogarnięcia później.
