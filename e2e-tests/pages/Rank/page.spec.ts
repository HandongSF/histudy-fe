import { paths } from '@/const/paths';
import test, { expect } from '@playwright/test';

test.describe('스터디 랭킹 페이지', () => {
   test('접근 테스트', async ({ page }) => {
      // 페이지 접근
      await page.goto(paths.ranks.root);
      await page.waitForTimeout(1000);

      // 그리드 뷰 테스트
      await expect(page.getByRole('heading', { name: '스터디 랭킹' })).toBeVisible();
      await expect(page.getByText('최고의 성과를 내고 있는 스터디 그룹들을 확인하세요')).toBeVisible();
      await expect(page.getByText('1위', { exact: true })).toBeVisible();

      // 랭킹 그리드 뷰 테스트
      await page.getByRole('tab', { name: '그리드 뷰' }).click();
      await page.waitForTimeout(500);
      await page.getByText('1위', { exact: true }).click();
      await page.getByRole('button', { name: '닫기' }).click();
   });
});
