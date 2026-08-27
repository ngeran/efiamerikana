// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'public/admin/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    // Node contexts: seed scripts and the build-tool config files.
    files: ['scripts/**/*.mjs', 'astro.config.mjs', '*.config.{js,ts}'],
    languageOptions: {
      globals: {
        Buffer: 'readonly',
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        consoleTrace: 'readonly',
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // set:html is a guardrail: it stays 'error' everywhere EXCEPT the two
      // audited uses below (eslint-plugin-astro does not support inline
      // HTML-comment disables for this rule).
      'astro/no-set-html-directive': 'error',
    },
  },
  {
    // AUDIT 1 of 2 — src/components/ui/Icon.astro:
    //   set:html receives `icons[name]`, a compile-time constant map of
    //   static SVG path strings; `name` is a literal union of its keys.
    //   No dynamic or CMS-controlled content can reach this sink.
    //
    // AUDIT 2 of 2 — src/layouts/BaseLayout.astro:
    //   set:html receives jsonLdScript = JSON.stringify(typedObject)
    //   .replace(/</g, '\\u003c') — every less-than sign is escaped, so a
    //   "</script>" breakout is impossible even via CMS-controlled strings.
    files: ['src/components/ui/Icon.astro', 'src/layouts/BaseLayout.astro'],
    rules: {
      'astro/no-set-html-directive': 'off',
    },
  },
);
