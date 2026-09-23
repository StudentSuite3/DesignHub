# Architecture

DesignHub is a static Next.js 15 (App Router) application. There is no server-side state: every page is prerendered, and all work happens in the browser.

## Routes

```
app/
├── (marketing)/page.tsx      → /            Homepage (Server Components + a small client search box)
├── (studio)/typography       → /typography  Typography Studio
├── (studio)/colors           → /colors      Color Studio
├── (studio)/icons            → /icons       Icon Studio
├── (studio)/export           → /export      Export Engine
├── manifest.ts, robots.ts, sitemap.ts, icon.svg, not-found.tsx
└── layout.tsx                Root layout: fonts, metadata, providers
```

Route groups share layouts: `(marketing)` gets the header nav and footer; `(studio)` gets the persistent sidebar. Each studio page is a Server Component that renders a header and one client "workspace" component.

## State

Each studio owns one [Zustand](https://zustand.docs.pmnd.rs) store in `store/`:

| Store              | Holds                                                                               |
| ------------------ | ----------------------------------------------------------------------------------- |
| `typography-store` | active font, heading/body pair, specimen, scale, rhythm, OpenType features, filters |
| `color-store`      | swatches, history (undo/redo), harmony, shade options, gradient, contrast pair      |
| `icon-store`       | query, collection, selected icon, style, favorite icons                             |
| `library-store`    | favorite fonts, recent fonts, saved pairs, saved palettes                           |
| `tokens-store`     | Export Engine settings                                                              |
| `ui-store`         | command palette and shortcuts dialog (not persisted)                                |

Persistent stores use Zustand's `persist` middleware with `indexedDbStorage` from `lib/db.ts`, a small adapter over a [Dexie](https://dexie.org) key-value table. Hydration is asynchronous, so server-rendered HTML always matches the defaults and saved state arrives right after mount.

A second Dexie table (`icons`) caches Iconify glyph bodies, which is why icons you have opened keep working offline.

## Logic lives in `lib/`

UI components stay thin, and the real work is plain TypeScript functions that are easy to test and reuse:

- `lib/color/` — the OKLCH color model (`Oklch` type), conversions and formatting (`color.ts`, `engine.ts`), harmonies, shades, gradients, WCAG contrast and color-vision simulation.
- `lib/typography/` — the font catalog, Google Fonts URL building, filtering, pairing, type scales and `clamp()`, OpenType definitions and exports.
- `lib/icons/` — the Iconify client (memory → IndexedDB → network), the SVG builder, rasterization, ICO encoding and the favicon package.
- `lib/tokens/` — the shared `DesignTokens` model (`build.ts`), the format generators (`formats.ts`) and the PDF style guide (`pdf.ts`).
- `lib/zip.ts` — a dependency-free ZIP (store) writer used by every "download all" button.

## Color model

OKLCH is the source of truth for every color in the app. It is perceptually uniform, so shades, harmonies and gradients look evenly spaced. Values are converted to HEX / RGB / HSL only at the edges (display and export), with CSS Color 4 gamut mapping into sRGB.

## Fonts

`lib/typography/catalog.json` is generated from public Google Fonts metadata by `scripts/generate-font-catalog.mjs`, so the app needs no API key. It is loaded with a dynamic `import()` in its own chunk. Fonts are loaded on demand through the Google Fonts CSS API. Grid previews add `&text=` so only the rendered glyphs download.

## Performance notes

- The command palette and shortcuts dialog mount on first use (`components/layout/lazy-overlays.tsx`).
- Secondary tabs in each studio are loaded with `next/dynamic`.
- Heavy libraries are imported where they're used: OpenType.js (font inspector), pdf-lib (style guide) and html-to-image (snapshots).
- Color.js uses its tree-shakable `colorjs.io/fn` entry with only the spaces we need registered.
- Third-party SVG is rendered through `<img>` data URLs, never injected into the DOM.
