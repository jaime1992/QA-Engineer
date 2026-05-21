import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright/e2e',
  timeout: 10000,
  expect: {
    timeout: 5000,
  },
  reporter: 'list',
  use: {
    baseURL: 'https://portalpaciente.bupa.cl',
    ignoreHTTPSErrors: false,
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
