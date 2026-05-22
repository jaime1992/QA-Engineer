import { defineConfig, devices } from '@playwright/test'

const BROWSERSTACK_USER = process.env.BROWSERSTACK_USERNAME || ''
const BROWSERSTACK_KEY  = process.env.BROWSERSTACK_ACCESS_KEY || ''
const BS_CDP_URL = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
  browser: 'chrome',
  browser_version: 'latest',
  os: 'osx',
  os_version: 'sonoma',
  name: 'Portal Pacientes BUPA — Mobile',
  build: 'QA-Engineer CI',
  'browserstack.username': BROWSERSTACK_USER,
  'browserstack.accessKey': BROWSERSTACK_KEY,
}))}`

export default defineConfig({
  testDir: './playwright/e2e',
  timeout: 30000,
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
    // --- Local ---
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad (gen 7)'] },
    },

    // --- BrowserStack (requiere BROWSERSTACK_USERNAME y BROWSERSTACK_ACCESS_KEY) ---
    ...(BROWSERSTACK_USER && BROWSERSTACK_KEY ? [
      {
        name: 'bs-iphone-14',
        use: {
          connectOptions: { wsEndpoint: BS_CDP_URL },
          viewport: { width: 390, height: 844 },
        },
      },
      {
        name: 'bs-pixel-7',
        use: {
          connectOptions: { wsEndpoint: BS_CDP_URL },
          viewport: { width: 412, height: 915 },
        },
      },
    ] : []),
  ],
})
