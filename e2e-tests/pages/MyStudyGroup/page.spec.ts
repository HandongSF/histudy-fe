import { paths } from '@/const/paths';
import test, { expect } from '@playwright/test';

test.use({ storageState: 'e2e-tests/auth/member.json' });

test.describe('스터디원(MEMBER)의 나의 스터디 그룹 페이지 테스트', () => {
   test('접근 테스트', async ({ page }) => {
      await page.goto(paths.myGroup.root);
      await page.waitForTimeout(1000);

      await expect(page.getByRole('heading', { name: '스터디 그룹:' })).toBeVisible();
      await expect(page.getByRole('cell', { name: '이름' })).toBeVisible();
      await expect(page.getByRole('cell', { name: '학번' })).toBeVisible();
      await expect(page.getByRole('cell', { name: '이메일' })).toBeVisible();
      await expect(page.getByRole('cell', { name: '태그' })).toBeVisible();
   });
});
