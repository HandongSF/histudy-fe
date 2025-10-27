import { paths } from '@/const/paths';
import test, { expect } from '@playwright/test';

test.describe('히즈스터디 홈 페이지 테스트', () => {
   test('접근 테스트', async ({ page }) => {
      // 홈 페이지 접근
      await page.goto(paths.root);
      await page.waitForTimeout(3000);

      await expect(page.getByRole('link', { name: 'HIStudy' })).toBeVisible();

      // 현재 활발한 스터디 그룹 테스트
      await page.getByRole('heading', { name: '현재 활발한 스터디 그룹' }).click();
      await page.getByText('1위').click();
      await page.waitForTimeout(1000);
      await expect(page.getByRole('dialog', { name: 'Team Info' })).toBeVisible();
      await page.getByRole('button', { name: '닫기' }).click();

      await page.getByText('2위').click();
      await page.waitForTimeout(1000);
      await expect(page.getByRole('dialog', { name: 'Team Info' })).toBeVisible();
      await page.getByRole('button', { name: '닫기' }).click();

      await page.getByText('3위').click();
      await page.waitForTimeout(1000);
      await expect(page.getByRole('dialog', { name: 'Team Info' })).toBeVisible();
      await page.getByRole('button', { name: '닫기' }).click();

      // 스터디 활동 현황 테스트
      await page.getByRole('heading', { name: '스터디 활동 현황' }).click();

      await page.getByText('총 스터디 원').click();

      await expect(page.getByText('총 스터디 수')).toBeVisible();
      await expect(page.getByText('총 스터디 시간')).toBeVisible();
      await expect(page.getByText('총 보고서 갯수')).toBeVisible();
      await expect(page.getByText('전체이번 학기')).toBeVisible();

      await page.getByRole('tab', { name: '이번 학기' }).click();

      await page.waitForTimeout(1000);

      await expect(page.getByText('이번 학기 스터디 원')).toBeVisible();
      await expect(page.getByText('이번 학기 스터디 시간')).toBeVisible();
      await expect(page.getByText('이번 학기 보고서 갯수')).toBeVisible();
      await expect(page.getByText('이번 학기 스터디 수')).toBeVisible();
   });
});
