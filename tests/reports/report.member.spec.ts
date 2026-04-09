import { paths } from '@/const/paths';
import { REPORT_CONTENT_MAX_LENGTH } from '@/utils/reportForm';
import test, { expect, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDirPath = path.join(__dirname, '../../public/img');

function formatMinutesToHoursAndMinutes(totalMinutes: string | number): string {
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

type ReportDraft = {
   title: string;
   content: string;
   totalMinutes: string;
};

type SelectedStudyInfo = {
   courseName: string;
   friendName: string;
};

async function uploadReportImage(page: Page, fileName: string, expectedCount: number) {
   await page.locator('#image-upload').setInputFiles(path.join(imageDirPath, fileName));
   await expect(page.locator('img[alt^="새 이미지"]')).toHaveCount(expectedCount, { timeout: 10000 });
}

async function waitForUnexpectedImageUploadRequest(page: Page, timeout = 1500) {
   try {
      return await page.waitForRequest(
         (request) => {
            const url = request.url();
            return request.method() === 'POST' && url.includes('/api/team/reports/image');
         },
         { timeout },
      );
   } catch {
      return null;
   }
}

async function forceBlobSizeToExceedLimitOnSubmit(page: Page) {
   await page.evaluate(() => {
      const descriptor = Object.getOwnPropertyDescriptor(Blob.prototype, 'size');
      const originalGetter = descriptor?.get;

      if (!originalGetter) {
         throw new Error('Blob.size getter를 찾을 수 없습니다.');
      }

      Object.defineProperty(Blob.prototype, 'size', {
         configurable: true,
         get() {
            return 6 * 1024 * 1024;
         },
      });
   });
}

async function mockReportImageUpload413(page: Page) {
   await page.route('**/api/team/reports/image', async (route) => {
      await route.fulfill({
         status: 413,
         contentType: 'application/json',
         body: JSON.stringify({
            code: 'REPORT_IMAGE_TOO_LARGE',
         }),
      });
   });
}

function reportTitleCell(page: Page, title: string) {
   return page.getByRole('cell', { name: title, exact: true }).first();
}

function reportDetailCard(page: Page, title: string) {
   return page.locator('div[data-slot="card"]').filter({ has: page.getByText(title, { exact: true }) }).first();
}

async function chooseFirstCourseAndFriend(page: Page): Promise<SelectedStudyInfo> {
   const studyCard = page.locator('div[data-slot="card"]', {
      hasText: '스터디 과목',
   });
   await studyCard.getByRole('checkbox').first().click();

   const courseLabel = (await studyCard.locator('label').first().textContent()) || '';
   const courseName = courseLabel.replace(/\s+\([^)]*\)\s*$/, '').trim();

   const friendCard = page.locator('div[data-slot="card"]', {
      hasText: '참여 멤버',
   });
   await friendCard.getByRole('checkbox').first().click();

   const friendLabel = (await friendCard.locator('label').first().textContent()) || '';
   const friendName = friendLabel.split(',')[0].trim();

   return { courseName, friendName };
}

async function fillReportForm(page: Page, draft: ReportDraft) {
   await page.locator('input[name="totalMinutes"]').fill(draft.totalMinutes);
   await page.getByRole('textbox', { name: '제목' }).fill(draft.title);
   await page.locator('.tiptap').click();
   await page.locator('.tiptap').fill(draft.content);
   await expect(page.getByText(`${draft.content.length} / ${REPORT_CONTENT_MAX_LENGTH}자`)).toBeVisible();
}

async function openReportDetailFromList(page: Page, title: string) {
   await expect(reportTitleCell(page, title)).toBeVisible({ timeout: 10000 });
   await reportTitleCell(page, title).click();
   await expect(page.getByRole('heading', { name: title })).toBeVisible();
}

async function expectReportDetail(page: Page, draft: ReportDraft, studyInfo: SelectedStudyInfo, imageCount: number) {
   const basicInfoCard = reportDetailCard(page, '기본 정보');
   const participantsCard = page.locator('div[data-slot="card"]').filter({ hasText: '참여 멤버 (' }).first();
   const coursesCard = page.locator('div[data-slot="card"]').filter({ hasText: '스터디 과목 (' }).first();
   const contentCard = reportDetailCard(page, '보고서 내용');
   const imagesCard = page.locator('div[data-slot="card"]').filter({ hasText: `인증 사진 (${imageCount}장)` }).first();
   const detailImages = imagesCard.locator('img[alt^="인증 사진 "]');

   await expect(page.getByRole('heading', { name: draft.title })).toBeVisible();
   await expect(basicInfoCard).toContainText(formatMinutesToHoursAndMinutes(draft.totalMinutes));
   await expect(participantsCard).toContainText(studyInfo.friendName);
   await expect(coursesCard).toContainText(studyInfo.courseName);
   await expect(contentCard).toContainText(draft.content);
   await expect(imagesCard).toContainText(`인증 사진 (${imageCount}장)`);
   await expect(detailImages).toHaveCount(imageCount);
}

async function deleteReportAndExpectRemoved(page: Page, title: string) {
   page.once('dialog', async (dialog) => {
      console.log('Dialog message:', dialog.message());
      await dialog.accept();
   });

   await page.getByRole('button', { name: '삭제' }).click();
   await page.waitForURL((url) => url.pathname === paths.reports.root, { timeout: 10000 });
   await expect(reportTitleCell(page, title)).toHaveCount(0, { timeout: 10000 });
}

test.describe('스터디원 리포트 테스트', () => {
   // 업로드한 이미지와 실제 올라간 이미지를 구분 못하는 이슈 존재
   test('heic/png/jpeg 3장을 업로드한 리포트는 상세에 3장으로 표시되고 삭제할 수 있다', async ({ page }) => {
      const draft: ReportDraft = {
         title: `테스트 보고서 제목1-${Date.now()}`,
         content: '테스트 보고서 내용1',
         totalMinutes: '60',
      };
      let studyInfo: SelectedStudyInfo;

      await test.step('3장 이미지를 포함한 리포트를 작성하고 상세 정보를 확인한다', async () => {
         await page.goto(paths.reports.add);

         await expect(page.getByText(`0 / ${REPORT_CONTENT_MAX_LENGTH}자`)).toBeVisible();
         await expect(page.getByText('파일당 5MB 이하만 업로드 가능')).toHaveClass(/text-destructive/);

         await page.getByRole('button', { name: '인증 코드 생성' }).click();
         await page.getByRole('button', { name: 'Close' }).click();

         await uploadReportImage(page, 'IMG_4055.heic', 1);
         await uploadReportImage(page, 'test_png.png', 2);
         await uploadReportImage(page, 'test_jpg.jpeg', 3);

         studyInfo = await chooseFirstCourseAndFriend(page);
         await fillReportForm(page, draft);

         await page.getByRole('button', { name: '제출' }).click();
         await openReportDetailFromList(page, draft.title);
         await expectReportDetail(page, draft, studyInfo, 3);
      });

      await test.step('작성한 리포트를 삭제하고 목록에서 사라졌는지 확인한다', async () => {
         await page.goto(paths.reports.root);
         await openReportDetailFromList(page, draft.title);
         await expectReportDetail(page, draft, studyInfo, 3);
         await deleteReportAndExpectRemoved(page, draft.title);
      });
   });

   test('제출 시점에 최종 업로드 파일이 5MB를 초과하면 업로드 API 호출 없이 차단된다', async ({ page }) => {
      const draft: ReportDraft = {
         title: `테스트 보고서 제목2-${Date.now()}`,
         content: '테스트 보고서 내용2',
         totalMinutes: '61',
      };

      await test.step('업로드 단계는 통과하지만 제출 직전 최종 파일 크기 검사에서 차단된다', async () => {
         await page.goto(paths.reports.add);

         await page.getByRole('button', { name: '인증 코드 생성' }).click();
         await page.getByRole('button', { name: 'Close' }).click();

         await uploadReportImage(page, 'test_png.png', 1);
         await expect(page.locator('p.text-sm.text-destructive')).toHaveCount(0);

         await forceBlobSizeToExceedLimitOnSubmit(page);

         await chooseFirstCourseAndFriend(page);
         await fillReportForm(page, draft);
         await page.getByRole('button', { name: '제출' }).click();

         await expect(
            page.locator('p.text-sm.text-destructive').filter({ hasText: '이미지는 파일당 5MB 이하만 업로드할 수 있습니다.' }),
         ).toBeVisible();
         await expect(await waitForUnexpectedImageUploadRequest(page)).toBeNull();
         await expect(page).toHaveURL(new RegExp(`${paths.reports.add}$`));
         await expect(reportTitleCell(page, draft.title)).toHaveCount(0);
      });
   });

   test('제출 후 이미지 업로드 API가 413을 반환하면 사용자에게 용량 초과 메시지를 보여준다', async ({ page }) => {
      const draft: ReportDraft = {
         title: `테스트 보고서 제목3-${Date.now()}`,
         content: '테스트 보고서 내용3',
         totalMinutes: '62',
      };

      await test.step('서버 413 응답을 받으면 보고서 저장 없이 같은 메시지로 안내한다', async () => {
         await page.goto(paths.reports.add);

         await page.getByRole('button', { name: '인증 코드 생성' }).click();
         await page.getByRole('button', { name: 'Close' }).click();

         await uploadReportImage(page, 'test_png.png', 1);
         await chooseFirstCourseAndFriend(page);
         await fillReportForm(page, draft);

         await mockReportImageUpload413(page);
         await page.getByRole('button', { name: '제출' }).click();

         await expect(
            page.locator('p.text-sm.text-destructive').filter({ hasText: '이미지는 파일당 5MB 이하만 업로드할 수 있습니다.' }),
         ).toBeVisible();
         await expect(page).toHaveURL(new RegExp(`${paths.reports.add}$`));
         await expect(reportTitleCell(page, draft.title)).toHaveCount(0);
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
