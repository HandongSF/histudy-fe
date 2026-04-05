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

   await expect(page.getByRole('heading', { name: draft.title })).toBeVisible();
   await expect(basicInfoCard).toContainText(formatMinutesToHoursAndMinutes(draft.totalMinutes));
   await expect(participantsCard).toContainText(studyInfo.friendName);
   await expect(coursesCard).toContainText(studyInfo.courseName);
   await expect(contentCard).toContainText(draft.content);
   await expect(imagesCard).toContainText(`인증 사진 (${imageCount}장)`);
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

   test('5MB 초과 이미지는 차단되고 이후 정상 이미지 1장으로 리포트를 작성 및 삭제할 수 있다', async ({ page }) => {
      const draft: ReportDraft = {
         title: `테스트 보고서 제목2-${Date.now()}`,
         content: '테스트 보고서 내용2',
         totalMinutes: '61',
      };
      let studyInfo: SelectedStudyInfo;

      await test.step('초과 용량 업로드를 차단한 뒤 정상 이미지로 리포트를 작성한다', async () => {
         await page.goto(paths.reports.add);

         await page.getByRole('button', { name: '인증 코드 생성' }).click();
         await page.getByRole('button', { name: 'Close' }).click();

         await page.locator('#image-upload').setInputFiles(path.join(imageDirPath, 'test_7MB.jpg'));
         await expect(
            page.locator('p.text-sm.text-destructive').filter({ hasText: '이미지는 파일당 5MB 이하만 업로드할 수 있습니다.' }),
         ).toBeVisible();
         await expect(page.locator('img[alt^="새 이미지"]')).toHaveCount(0);

         await uploadReportImage(page, 'test_png.png', 1);
         studyInfo = await chooseFirstCourseAndFriend(page);
         await fillReportForm(page, draft);
         await page.getByRole('button', { name: '제출' }).click();
         await openReportDetailFromList(page, draft.title);
         await expectReportDetail(page, draft, studyInfo, 1);
      });

      await test.step('작성한 리포트를 삭제하고 목록에서 제거되었는지 확인한다', async () => {
         await page.goto(paths.reports.root);
         await openReportDetailFromList(page, draft.title);
         await expectReportDetail(page, draft, studyInfo, 1);
         await deleteReportAndExpectRemoved(page, draft.title);
      });
   });

   test('보고서 내용은 1000자까지 제출 가능하고 1001자부터 제출이 비활성화된다', async ({ page }) => {
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
