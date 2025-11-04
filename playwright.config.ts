// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import path from 'path'; 

export const AUTH_FILE = path.join(__dirname, '.auth/user.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    headless: false, 
    launchOptions: {
      slowMo: 250, 
      args: ['--start-maximized'] 
    },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/, 
      
      // ⬇️ 关键：为 setup 项目添加 use 配置
      // 告诉它也使用本地的 Chrome
      use: {
        ...devices['Desktop Chrome'],
        viewport: null, 
        deviceScaleFactor: undefined, 
        channel: 'chrome',
        headless: true,
      },
    },

    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: null, 
        deviceScaleFactor: undefined, 
        channel: 'chrome',
        storageState: AUTH_FILE,
      },
    },
  ]
});