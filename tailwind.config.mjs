/** @type {import('tailwindcss').Config} */

// Semantic color tokens. Each maps to a CSS variable (space-separated RGB
// triplet) defined in src/styles/global.css, so light/dark themes change in
// one place. Components must use these tokens — never hardcoded palettes.
const token = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: token('--sp-canvas'),
        surface: token('--sp-surface'),
        raised: token('--sp-raised'),
        ink: token('--sp-ink'),
        muted: token('--sp-muted'),
        faint: token('--sp-faint'),
        line: token('--sp-line'),
        'line-strong': token('--sp-line-strong'),
        accent: token('--sp-accent'),
        'accent-strong': token('--sp-accent-strong'),
        'accent-ink': token('--sp-accent-ink'),
        success: token('--sp-success'),
        'success-strong': token('--sp-success-strong'),
        'success-ink': token('--sp-success-ink'),
        danger: token('--sp-danger'),
        warn: token('--sp-warn'),
      },
      fontFamily: {
        // System stacks only: no remote font downloads, fastest load.
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
      transitionDuration: {
        160: '160ms',
        200: '200ms',
      },
    },
  },
  plugins: [
    // Hover styles only where hover is actually possible (desktop pointers).
    // Touch devices get :active pressed states instead, defined per component.
    function ({ addVariant }) {
      addVariant('can-hover', '@media (hover: hover) and (pointer: fine)');
    },
  ],
};
