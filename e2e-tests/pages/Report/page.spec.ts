import { paths } from '@/const/paths';
import test, { expect } from '@playwright/test';

test.use({ storageState: 'e2e-tests/auth/member.json' });
test.describe('스터디원(MEMBER)의 리포트 관련 페이지 테스트', () => {
   test('리포트 리스트, 상세, 작성, 수정 페이지 접근 테스트', async ({ page }) => {
      // 리포트 리스트 페이지 접근
      await page.goto(paths.reports.root);
      await page.waitForTimeout(1000);

      await expect(page.getByRole('heading', { name: '레포트 목록' })).toBeVisible();

      // 리포트 작성 페이지 접근
      await page.getByRole('button', { name: '레포트 작성' }).click();
      await page.waitForTimeout(1000);
      await expect(page.getByRole('heading', { name: '새 보고서 작성' })).toBeVisible();
      await expect(page.getByText('인증샷 (1~3개)')).toBeVisible();
      await expect(page.getByText('스터디 과목')).toBeVisible();
      await expect(page.getByText('참여 멤버')).toBeVisible();
      await expect(page.getByText('스터디 시간', { exact: true })).toBeVisible();
      await expect(page.getByText('보고서 내용')).toBeVisible();

      // 리포트 상세 페이지 접근
      await page.goto(paths.reports.root);
      await page.waitForTimeout(1000);
      await page.getByRole('cell', { name: '1', exact: true }).click();
      await page.waitForTimeout(1000);

      await expect(page.getByText('기본 정보')).toBeVisible();
      await expect(page.getByText('보고서 내용', { exact: true })).toBeVisible();

      // 리포트 수정 페이지 접근
      await page.getByRole('button', { name: '수정' }).click();
      await page.waitForTimeout(1000);

      await expect(page.getByRole('heading', { name: '보고서 수정' })).toBeVisible();
      await expect(page.getByText('인증샷 (1~3개)')).toBeVisible();
      await expect(page.getByText('스터디 과목')).toBeVisible();
      await expect(page.getByText('참여 멤버')).toBeVisible();
   });
});
