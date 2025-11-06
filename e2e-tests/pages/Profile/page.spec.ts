import { paths } from '@/const/paths';
import test, { expect } from '@playwright/test';

test.describe('스터디원(MEMBER)의 프로필 페이지 테스트', () => {
   test.use({ storageState: 'e2e-tests/auth/member.json' });
   test('접근 테스트', async ({ page }) => {
      await page.goto(paths.profile.root);
      await page.waitForTimeout(1000);
      await expect(page.locator('div').filter({ hasText: /^스터디원$/ })).toBeVisible();
      await expect(page.getByText('이름')).toBeVisible();
      await expect(page.getByText('학번')).toBeVisible();
      await expect(page.getByText('이메일')).toBeVisible();
   });
});

test.describe('어드민(ADMIN)의 프로필 페이지 테스트', () => {
   test.use({ storageState: 'e2e-tests/auth/admin.json' });
   test('접근 테스트', async ({ page }) => {
      await page.goto(paths.profile.root);
      await page.waitForTimeout(1000);
      await expect(page.getByText('관리자').nth(1)).toBeVisible();
      await expect(page.getByText('이름')).toBeVisible();
      await expect(page.getByText('학번')).toBeVisible();
      await expect(page.getByText('이메일')).toBeVisible();
   });
});
