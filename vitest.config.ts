import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    // Default to node; component tests opt into jsdom per-file via
    // `// @vitest-environment jsdom`.
    environment: 'node',
    globals: false,
  },
});
