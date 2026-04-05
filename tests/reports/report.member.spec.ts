import { paths } from '@/const/paths';
import { REPORT_CONTENT_MAX_LENGTH } from '@/utils/reportForm';
import test, { expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDirPath = path.join(__dirname, '../../public/img');

export function formatMinutesToHoursAndMinutes(totalMinutes: string | number): string {
   const minutes = typeof totalMinutes === 'string' ? parseInt(totalMinutes, 10) : totalMinutes;

   if (isNaN(minutes) || minutes < 0) {
      return '0시간 0분';
   }

   const hours = Math.floor(minutes / 60);
   const remainingMinutes = minutes % 60;

   if (hours === 0) {
      return `${remainingMinutes}분`;
   }

   if (remainingMinutes === 0) {
      return `${hours}시간`;
   }

   return `${hours}시간 ${remainingMinutes}분`;
}

test.use({ storageState: 'tests/auth/member.json' });

async function uploadReportImage(page: import('@playwright/test').Page, fileName: string, expectedCount: number) {
   await page.locator('#image-upload').setInputFiles(path.join(imageDirPath, fileName));
   await expect(page.locator('img[alt^="새 이미지"]')).toHaveCount(expectedCount, { timeout: 10000 });
}

function reportTitleCell(page: import('@playwright/test').Page, title: string) {
   return page.getByRole('cell', { name: title, exact: true }).first();
}

test.describe('스터디원 리포트 테스트', () => {
   // 업로드한 이미지와 실제 올라간 이미지를 구분 못하는 이슈 존재
   test('jpeg, png, heic 이미지 3개를 포함한 리포트 작성 후 삭제', async ({ page }) => {
      const testTitle = `테스트 보고서 제목1-${Date.now()}`;
      const testContent = '테스트 보고서 내용1';
      const testTotalMinutes = '60';
      let testCourse = '';
      let testFriend = '';

      await test.step('리포트 작성', async () => {
         await page.goto(paths.reports.add);

         await expect(page.getByText(`0 / ${REPORT_CONTENT_MAX_LENGTH}자`)).toBeVisible();
         await expect(page.getByText('파일당 5MB 이하만 업로드 가능')).toHaveClass(/text-destructive/);

         await page.getByRole('button', { name: '인증 코드 생성' }).click();
         await page.getByRole('button', { name: 'Close' }).click();

         await uploadReportImage(page, 'IMG_4055.heic', 1);
         await uploadReportImage(page, 'test_png.png', 2);
         await uploadReportImage(page, 'test_jpg.jpeg', 3);

         const studyCard = page.locator('div[data-slot="card"]', {
            hasText: '스터디 과목',
         });
         const studyCheckbox = studyCard.getByRole('checkbox').first();
         await studyCheckbox.click();

         testCourse = (await studyCard.locator('label').first().textContent()) || '';
         testCourse = testCourse.split(' ')[0];

         const friendCard = page.locator('div[data-slot="card"]', {
            hasText: '참여 멤버',
         });

         const friendCheckbox = friendCard.getByRole('checkbox').first();
         await friendCheckbox.click();

         testFriend = (await friendCard.locator('label').first().textContent()) || '';

         testFriend = testFriend.split(',')[0];

         await page.locator('input[name="totalMinutes"]').fill(testTotalMinutes);

         await page.getByRole('textbox', { name: '제목' }).click();
         await page.getByRole('textbox', { name: '제목' }).fill(testTitle);

         await page.locator('.tiptap').click();
         await page.locator('.tiptap').fill(testContent);
         await expect(page.getByText(`${testContent.length} / ${REPORT_CONTENT_MAX_LENGTH}자`)).toBeVisible();

         await page.getByRole('button', { name: '제출' }).click();

         // 이미지 올라간 것 확인
         await reportTitleCell(page, testTitle).click();

         await expect(page.getByRole('heading', { name: testTitle })).toBeVisible();

         await expect(page.getByText('인증 사진 (3장)')).toBeVisible();
         await expect(page.getByText(`${formatMinutesToHoursAndMinutes(testTotalMinutes)}`)).toBeVisible();
         await expect(page.getByText(testContent)).toBeVisible();
         await expect(page.getByText(testFriend)).toBeVisible();
         await expect(page.getByText(testCourse)).toBeVisible();
      });

      await test.step('리포트 삭제', async () => {
         // 이미지 접속
         await page.goto(paths.reports.root);

         await reportTitleCell(page, testTitle).click();

         await expect(page.getByRole('heading', { name: testTitle })).toBeVisible();

         await expect(page.getByText('인증 사진 (3장)')).toBeVisible();
         await expect(page.getByText(`${formatMinutesToHoursAndMinutes(testTotalMinutes)}`)).toBeVisible();
         await expect(page.getByText(testContent)).toBeVisible();

         // 이미지 삭제
         page.once('dialog', async (dialog) => {
            console.log('Dialog message:', dialog.message());
            await dialog.accept();
         });

         await page.getByRole('button', { name: '삭제' }).click();

         // 삭제 확인
         await expect(reportTitleCell(page, testTitle)).toHaveCount(0);
      });
   });

   test('7MB 이미지 업로드는 차단되고 이후 정상 이미지로 리포트 작성 후 삭제', async ({ page }) => {
      const testTitle = `테스트 보고서 제목2-${Date.now()}`;
      const testContent = '테스트 보고서 내용2';
      const testTotalMinutes = '61';
      let testCourse = '';
      let testFriend = '';

      await test.step('리포트 작성', async () => {
         await page.goto(paths.reports.add);

         await page.getByRole('button', { name: '인증 코드 생성' }).click();
         await page.getByRole('button', { name: 'Close' }).click();

         await page.locator('#image-upload').setInputFiles(path.join(imageDirPath, 'test_7MB.jpg'));
         await expect(
            page.locator('p.text-sm.text-destructive').filter({ hasText: '이미지는 파일당 5MB 이하만 업로드할 수 있습니다.' }),
         ).toBeVisible();
         await expect(page.locator('img[alt^="새 이미지"]')).toHaveCount(0);

         await uploadReportImage(page, 'test_png.png', 1);

         const studyCard = page.locator('div[data-slot="card"]', {
            hasText: '스터디 과목',
         });
         const studyCheckbox = studyCard.getByRole('checkbox').first();
         await studyCheckbox.click();

         testCourse = (await studyCard.locator('label').first().textContent()) || '';
         testCourse = testCourse.split(' ')[0];

         const friendCard = page.locator('div[data-slot="card"]', {
            hasText: '참여 멤버',
         });

         const friendCheckbox = friendCard.getByRole('checkbox').first();
         await friendCheckbox.click();

         testFriend = (await friendCard.locator('label').first().textContent()) || '';

         testFriend = testFriend.split(',')[0];

         await page.locator('input[name="totalMinutes"]').fill(testTotalMinutes);

         await page.getByRole('textbox', { name: '제목' }).click();
         await page.getByRole('textbox', { name: '제목' }).fill(testTitle);
         await page.locator('.tiptap').click();
         await page.locator('.tiptap').fill(testContent);
         await page.getByRole('button', { name: '제출' }).click();

         // 이미지 올라간 것 확인
         await reportTitleCell(page, testTitle).click();

         await expect(page.getByRole('heading', { name: testTitle })).toBeVisible();

         await expect(page.getByText('인증 사진 (1장)')).toBeVisible();
         await expect(page.getByText(`${formatMinutesToHoursAndMinutes(testTotalMinutes)}`)).toBeVisible();
         await expect(page.getByText(testContent)).toBeVisible();
         await expect(page.getByText(testFriend)).toBeVisible();
         await expect(page.getByText(testCourse)).toBeVisible();
      });

      await test.step('리포트 삭제', async () => {
         // 이미지 접속
         await page.goto(paths.reports.root);

         await reportTitleCell(page, testTitle).click();

         await expect(page.getByRole('heading', { name: testTitle })).toBeVisible();

         await expect(page.getByText('인증 사진 (1장)')).toBeVisible();
         await expect(page.getByText(`${formatMinutesToHoursAndMinutes(testTotalMinutes)}`)).toBeVisible();
         await expect(page.getByText(testContent)).toBeVisible();

         // 이미지 삭제
         page.once('dialog', async (dialog) => {
            console.log('Dialog message:', dialog.message());
            await dialog.accept();
         });

         await page.getByRole('button', { name: '삭제' }).click();

         await page.waitForTimeout(1000);

         // 삭제 확인
         await expect(reportTitleCell(page, testTitle)).toHaveCount(0);
      });
   });

   test('보고서 내용은 1000자까지 허용하고 1001자부터 제출이 비활성화된다', async ({ page }) => {
      const withinLimitContent = 'a'.repeat(REPORT_CONTENT_MAX_LENGTH);
      const overLimitContent = 'a'.repeat(REPORT_CONTENT_MAX_LENGTH + 1);

      await page.goto(paths.reports.add);

      await page.locator('.tiptap').click();
      await page.locator('.tiptap').fill(withinLimitContent);

      await expect(page.getByText(`${REPORT_CONTENT_MAX_LENGTH} / ${REPORT_CONTENT_MAX_LENGTH}자`)).toBeVisible();
      await expect(page.getByRole('button', { name: '제출' })).toBeEnabled();

      await page.locator('.tiptap').fill(overLimitContent);

      await expect(page.getByText(`${REPORT_CONTENT_MAX_LENGTH + 1} / ${REPORT_CONTENT_MAX_LENGTH}자`)).toBeVisible();
      await expect(page.getByRole('button', { name: '제출' })).toBeDisabled();
      await expect(
         page.getByText(`보고서 내용은 ${REPORT_CONTENT_MAX_LENGTH}자 이하로 작성해주세요.`),
      ).toBeVisible();
   });
});
