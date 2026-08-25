import { getViteConfig } from 'astro/config';

/**
 * getViteConfig wires Astro's compiler + asset plugins into Vitest so
 * component tests (AstroContainer) and import.meta.glob behave exactly as
 * they do inside `astro build`.
 */
export default getViteConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/component/**/*.test.ts'],
    globals: true,
  },
});
