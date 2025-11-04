// tests/auth.setup.ts
import { test as setup, expect, Page } from '@playwright/test';
import { AUTH_FILE } from '../playwright.config';
import fs from 'fs';

// 封装一个函数来检查登录状态
async function checkLoginState(page: Page): Promise<boolean> {
  try {
    // 访问一个需要登录的页面
    await page.goto('http://localhost:82/index');
    
    // ⬇️⬇️⬇️ **这是根据你的要求修改后的行** ⬇️⬇️⬇️
    // 关键：检查 "欢迎您" 这个文本是否可见
    await expect(page.getByText('欢迎您')).toBeVisible({ timeout: 5000 });
    // ⬆️⬆️⬆️ **修改结束** ⬆️⬆️⬆️
    
    return true; // 如果上面一行成功，说明登录有效
  } catch (e) {
    return false; // 如果超时或找不到元素，说明登录无效
  }
}

// 'setup' 是一个特殊的 test 实例
setup('智能认证：检查或登录', async ({ page }) => {
  
  // 1. 检查 auth file 是否存在
  if (fs.existsSync(AUTH_FILE)) {

    // 2. 获取 browser 实例
    const browser = page.context().browser();

    // 3. 检查 browser 是否为 null (满足 TypeScript)
    if (!browser) {
      console.warn('无法获取 browser 实例，将强制重新登录。');
    } else {
      // 4. 如果 browser 存在，才执行验证
      const context = await browser.newContext({ storageState: AUTH_FILE });
      const testPage = await context.newPage();
      
      const isLoggedIn = await checkLoginState(testPage);
      
      await testPage.close();
      await context.close();

      if (isLoggedIn) {
        console.log('Auth file 有效，跳过登录。');
        return; // ⬅️ 成功退出 setup
      }
      
      console.log('Auth file 已过期或无效，重新登录...');
    }
  }

  // 5. 执行完整的登录流程
  await page.goto('http://localhost:82/login');

  await page.locator('input').first().fill('admin');
  await page.locator('input').nth(1).fill('admin123');
  await page.getByRole('button', { name: '登录' }).click();
  
  await expect(page).toHaveURL('http://localhost:82/index');

  // 6. 保存新的认证状态
  await page.context().storageState({ path: AUTH_FILE });
  console.log('新的 Auth file 已保存。');
});