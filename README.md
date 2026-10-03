# SecurePass — Secure Password Generator

A modern, secure, responsive password generator web app. Passwords, PINs, and
memorable passphrases are generated **locally in your browser** using the
Web Crypto API — nothing is ever sent to a server, stored, or tracked.

## Features

- **Secure generation engine** — `crypto.getRandomValues()` only (never `Math.random()`),
  rejection sampling to eliminate modulo bias, forced per-group characters shuffled
  into random positions with a cryptographic Fisher–Yates shuffle.
- **Three modes** — Password (8–128 chars), numeric PIN (4–128 digits), and memorable
  passphrase (3–12 words from the bundled 7,776-word EFF word list).
- **Full customization** — length slider synced with numeric input, uppercase / lowercase /
  digits / symbols toggles, ambiguous-character exclusion, custom exclusion string,
  and an optional per-group guarantee.
- **Six one-click presets** — Strong, Extra-Long, Developer, Easy-to-Read, Numeric PIN,
  Memorable Passphrase. Each reconfigures the generator; you can still tweak afterwards.
- **Strength meter** — estimated entropy in bits (never length-only), a Weak → Very Strong
  label, and a plain-language explanation of the estimate.
- **Polished copy flow** — Clipboard API with a legacy fallback, temporary “Copied!”
  state, and screen-reader announcements. No success message is shown on failure.
- **Optional in-memory history** — off by default, kept in page memory only, wiped on
  reload, with per-entry copy/remove and clear-all.
- **Light / Dark / System themes** — OS changes are followed live, the choice persists
  in local storage, and an inline script prevents any theme flash on load.
- **Accessible & responsive** — mobile-first (320px+), 44px touch targets, semantic HTML,
  visible focus states, keyboard support, and `prefers-reduced-motion` respected.
- **Privacy by design** — no analytics, no remote scripts touching passwords, no
  persistence of generated values anywhere.

## Tech stack

| Layer      | Choice                                                        |
|------------|---------------------------------------------------------------|
| Framework  | [Astro](https://astro.build) 5 (static output, React islands) |
| UI         | React 19 + TypeScript (strict) + Tailwind CSS 3               |
| Icons      | lucide-react                                                  |
| Randomness | Web Crypto API (`crypto.getRandomValues`)                     |
| Tests      | Vitest (+ Testing Library for component tests)                |

Only the interactive generator hydrates as React islands; header/footer and the
About/Privacy pages ship as pure static HTML.

## Getting started

**Requirements:** Node.js 18+ and npm.

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:4321)
npm run dev

# Type-check
npm run typecheck

# Run the test suite
npm test

# Production build (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview
```

## Project structure

```text
password-generator/
├── public/
│   ├── favicon.svg          # App icon (also used for OG image)
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Logo, nav, theme selector (React island)
│   │   │   └── Footer.astro     # Static footer
│   │   ├── generator/
│   │   │   ├── PasswordGenerator.tsx  # Main island: layout + composition
│   │   │   ├── PasswordDisplay.tsx    # Readout, reveal, copy, regenerate
│   │   │   ├── PasswordLength.tsx     # Slider + numeric input
│   │   │   ├── CharacterOptions.tsx   # Group checkboxes
│   │   │   ├── AdvancedOptions.tsx    # Collapsible advanced settings
│   │   │   ├── StrengthIndicator.tsx  # Meter + entropy + explanation
│   │   │   ├── PresetSelector.tsx     # Six presets
│   │   │   └── HistoryPanel.tsx       # Opt-in in-memory history
│   │   └── ui/
│   │       ├── Button.tsx / SectionCard.tsx / Tooltip.tsx
│   ├── layouts/
│   │   └── BaseLayout.astro     # SEO meta, OG tags, no-flash theme script
│   ├── pages/
│   │   ├── index.astro          # Generator page
│   │   ├── about.astro          # How it works
│   │   └── privacy.astro        # Privacy statement
│   ├── hooks/
│   │   ├── usePasswordGenerator.ts  # Config, value, entropy, history state
│   │   └── useTheme.ts              # Light/dark/system with persistence
│   ├── lib/
│   │   ├── password-generator.ts  # CSPRNG core (auditable, UI-independent)
│   │   ├── password-strength.ts   # Entropy estimation + labels
│   │   ├── presets.ts             # The six presets
│   │   ├── validation.ts          # User-facing config validation
│   │   ├── clipboard.ts           # Copy with fallback
│   │   └── words.ts               # EFF large word list (7,776 words, public domain)
│   ├── types/
│   │   └── password.ts
│   └── styles/
│       └── global.css             # Tailwind + slider, animations, reduced motion
├── tests/
│   ├── password-generator.test.ts # Lengths, groups, exclusions, PIN, passphrase, CSPRNG
│   ├── password-strength.test.ts  # Entropy math + label thresholds
│   ├── validation.test.ts         # Config validation + input sanitizing
│   └── components.test.tsx        # Copy flow, regenerate, visibility toggle
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

## Security notes

- **Local-only.** Generation happens entirely client-side. The app makes no network
  requests of its own after page load and sends passwords nowhere.
- **No persistence.** Generated passwords are never written to localStorage,
  sessionStorage, cookies, URLs, or logs. Only the *theme preference* is persisted.
- **No silent fallbacks.** If the Web Crypto API is unavailable, the app shows a clear
  error instead of generating — it never degrades to `Math.random()`.
- **Auditable core.** All security-sensitive logic lives in `src/lib/`, independent of
  the UI, with unit tests covering lengths, character groups, exclusion rules,
  unbiased sampling, and error paths.
- **Honest strength estimates.** Entropy is estimated from length × effective pool
  size (or word-list size), adjusted for per-group constraints. It is presented as an
  estimate for comparing settings — not a guarantee against phishing, reuse, or leaks.

## Deployment (static hosting)

`npm run build` produces a fully static `dist/` directory — no server required.
Deploy it to any static host:

**GitHub Pages** (this repo is pre-configured via `site` in `astro.config.mjs`):

```bash
npm run build
# Publish the contents of dist/, e.g. with the official
# "Deploy to GitHub Pages" workflow or: npx gh-pages -d dist
```

**Netlify** — build command `npm run build`, publish directory `dist`.
**Vercel** — import the repo; the framework preset detects Astro automatically.
**Cloudflare Pages** — build command `npm run build`, output directory `dist`.

## License

MIT. The bundled word list (`src/lib/words.ts`) is the EFF large word list,
released into the public domain by the EFF.
