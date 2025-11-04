// tests/field.spec.ts
import { test, expect } from '@playwright/test';

test('场地管理页面 - 应该能成功新增场地', async ({ page }) => {
  // 1. 打开页面 (假设已登录)
  await page.goto('http://localhost:82/unit/field');

  // 2. 点击新增按钮
  await page.getByRole('button', { name: '新增' }).click();

  // --- Dialog & Form Interaction ---

  // 3. 定位到对话框
  const dialog = page.getByRole('dialog');

  // 4. 断言对话框已出现，并检查标题
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('header').getByText('新增').first()).toBeVisible();

  // 5. 点击"归属单位"下拉框
  await dialog.locator('.el-form-item', { hasText: '归属单位' })
              .locator('.el-select__wrapper')
              .click();

  // 6. 从弹出的列表中选择一个选项
  // ⚠️ 警告：请将 '101连部' 替换为你需要点击的真实单位名称
  //    (DOM 显示第一行是 101连部，我们这里就用它)
  await page.getByRole('option', { name: '101连部' }).click();
  
  // 7. 输入场地名称
  await dialog.getByLabel('场地名称').fill('自动测试场地-01');

  // 8. 输入备注
  await dialog.getByLabel('备注').fill('这是由 Playwright 自动测试创建的。');

  // 9. 点击确定
  await dialog.getByRole('button', { name: '确 定' }).click();

  // ----------------------------------------------------
  // --- 验证（Assert）- (根据你的要求已更新) ---
  // ----------------------------------------------------

  // 10. 验证对话框是否已关闭
  await expect(dialog).not.toBeVisible();

  // 11. 验证新创建的数据是否正确显示在表格中
  
  // 11a. 定义你期望的数据
  const expectedUnit = '101连部';
  const expectedField = '自动测试场地-01';

  // 11b. 找到那一个特定的行 (row)
  // 策略："找到一个'行'，这个'行'内部必须'包含'一个'单元格'，
  //       其内容(name)是 '自动测试场地-01'"
  const row = page.getByRole('row').filter({
    has: page.getByRole('cell', { name: expectedField })
  });

  // 11c. 断言这一行本身是可见的
  await expect(row).toBeVisible();

  // 11d. 断言这一行 *同时* 包含了正确的“单位名称”
  // (在已找到的 row 内部，再查找“单位名称”的单元格)
  await expect(row.getByRole('cell', { name: expectedUnit })).toBeVisible();
});