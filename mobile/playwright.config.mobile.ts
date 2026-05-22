import { defineConfig, devices } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

const BROWSERSTACK_USER = process.env.BROWSERSTACK_USERNAME || ''
const BROWSERSTACK_KEY  = process.env.BROWSERSTACK_ACCESS_KEY || ''

const bsConfig = (deviceName: string, os: string, osVersion: string) =>
  `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
    browser: 'chrome',
    browser_version: 'latest',
    os,
    os_version: osVersion,
    name: `Portal Pacientes BUPA — ${deviceName}`,
    build: 'QA-Engineer Mobile',
    'browserstack.username': BROWSERSTACK_USER,
    'browserstack.accessKey': BROWSERSTACK_KEY,
  }))}`

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: { timeout: 8000 },
  reporter: 'list',
  use: {
    baseURL: 'https://portalpaciente.bupa.cl',
    ignoreHTTPSErrors: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [

    // --- Local simulado ---
    {
      name: 'pixel-5',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'iphone-14',
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'ipad',
      use: { ...devices['iPad (gen 7)'] },
    },

    // --- BrowserStack dispositivos reales ---
    ...(BROWSERSTACK_USER && BROWSERSTACK_KEY ? [
      {
        name: 'bs-iphone-14',
        use: {
          connectOptions: { wsEndpoint: bsConfig('iPhone 14', 'osx', 'sonoma') },
          viewport: { width: 390, height: 844 },
        },
      },
      {
        name: 'bs-samsung-s23',
        use: {
          connectOptions: { wsEndpoint: bsConfig('Samsung Galaxy S23', 'android', '13.0') },
          viewport: { width: 412, height: 915 },
        },
      },
    ] : []),
  ],
})
