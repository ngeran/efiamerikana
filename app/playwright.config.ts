import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
// NOTE: astro preview binds to `localhost` (which may resolve to ::1 only)
// — probe with localhost, not 127.0.0.1.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * E2E runs against the production build (`astro preview`).
 *
 * Browser: by default Playwright uses its own downloaded Chromium
 * (`npx playwright install chromium`). On NixOS you can point it at the
 * system Chromium instead:
 *
 *     PLAYWRIGHT_EXECUTABLE="$(command -v chromium)" npm run test:e2e
 */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporters: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_EXECUTABLE,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: `${baseURL}/en/`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
