import { paths } from '@/const/paths';
import test, { expect } from '@playwright/test';

test.use({ storageState: 'e2e-tests/auth/admin.json' });

test.describe('엑셀 다운로드 테스트', () => {
   test('스터디 관리 페이지 (manage-study) 엑셀 다운로드 테스트', async ({ page }) => {
      await page.goto(paths.admin.manageStudy);

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: '그룹 활동 목록 엑셀 다운' }).click();

      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('스터디그룹활동.xlsx');

      const failure = await download.failure();
      expect(failure).toBeNull();
   });

   test('스터디 신청자 목록 페이지 (manage-student) 엑셀 다운로드 테스트', async ({ page }) => {
      await page.goto(paths.admin.manageStudent);
      const downloadPromise = page.waitForEvent('download');

      await page.getByRole('button', { name: '신청자 목록 다운로드' }).click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('스터디신청자목록.xlsx');

      const failure = await download.failure();
      expect(failure).toBeNull();
   });
});
