import { test, expect } from '@playwright/test';
test('已登录用户访问首页', async ({ page }) => {
  await page.goto('http://localhost:82/index');
});