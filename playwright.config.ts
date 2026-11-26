import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  expect: { timeout: 15000 },
  workers: 1,
  use: { baseURL: process.env.GRANFACE_TEST_URL || 'http://127.0.0.1:5173/', channel: 'chrome', headless: true, viewport: { width: 1440, height: 900 }, screenshot: 'only-on-failure', launchOptions: { args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] } },
  reporter: 'list',
});
