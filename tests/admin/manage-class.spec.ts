import { expect, test } from '@playwright/test';

test.use({ storageState: 'tests/auth/admin.json' });

test('관리자가 등록된 수업을 삭제하면 목록을 갱신한다', async ({ page }) => {
   const courses = [
      {
         id: 101,
         name: '자료구조',
         code: 'CSE201',
         prof: '김교수',
         year: 2026,
         semester: 2,
      },
      {
         id: 102,
         name: '운영체제',
         code: 'CSE301',
         prof: '이교수',
         year: 2026,
         semester: 2,
      },
   ];

   await page.route('**/api/courses?search=*', async (route) => {
      await route.fulfill({ json: { courses } });
   });

   let deletedCourseId: number | null = null;
   await page.route('**/api/courses/delete', async (route) => {
      const body = route.request().postDataJSON() as { id: number };
      deletedCourseId = body.id;
      const courseIndex = courses.findIndex((course) => course.id === body.id);
      expect(courseIndex).not.toBe(-1);
      if (courseIndex !== -1) courses.splice(courseIndex, 1);
      await route.fulfill({ json: { success: true } });
   });

   await page.goto('/admin/manage-class');
   await expect(page.getByRole('cell', { name: '자료구조', exact: true })).toBeVisible();

   page.once('dialog', (dialog) => dialog.accept());
   await page.getByRole('button', { name: '자료구조 삭제' }).click();

   await expect.poll(() => deletedCourseId).toBe(101);
   await expect(page.getByText('수업이 삭제되었습니다.')).toBeVisible();
   await expect(page.getByRole('cell', { name: '자료구조', exact: true })).toHaveCount(0);
   await expect(page.getByRole('cell', { name: '운영체제', exact: true })).toBeVisible();
});

test('삭제는 성공했지만 목록 갱신이 실패하면 결과를 구분해 안내한다', async ({ page }) => {
   let courseRequestCount = 0;

   await page.route('**/api/courses?search=*', async (route) => {
      courseRequestCount += 1;
      if (courseRequestCount > 1) {
         await route.fulfill({ status: 500, json: { message: '목록 조회 실패' } });
         return;
      }

      await route.fulfill({
         json: {
            courses: [
               {
                  id: 101,
                  name: '자료구조',
                  code: 'CSE201',
                  prof: '김교수',
                  year: 2026,
                  semester: 2,
               },
            ],
         },
      });
   });
   await page.route('**/api/courses/delete', async (route) => {
      await route.fulfill({ json: { success: true } });
   });

   await page.goto('/admin/manage-class');
   page.once('dialog', (dialog) => dialog.accept());
   await page.getByRole('button', { name: '자료구조 삭제' }).click();

   await expect(page.getByText('수업이 삭제되었습니다.')).toBeVisible();
   await expect(page.getByText('수업 목록 갱신에 실패했습니다. 새로고침해 주세요.')).toBeVisible({
      timeout: 15_000,
   });
});

test('삭제 후 목록을 다시 불러오는 동안 중복 삭제를 막는다', async ({ page }) => {
   let courseRequestCount = 0;
   let releaseRefresh = () => {};
   const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
   });

   await page.route('**/api/courses?search=*', async (route) => {
      courseRequestCount += 1;
      if (courseRequestCount > 1) await refreshGate;

      await route.fulfill({
         json: {
            courses:
               courseRequestCount === 1
                  ? [
                       {
                          id: 101,
                          name: '자료구조',
                          code: 'CSE201',
                          prof: '김교수',
                          year: 2026,
                          semester: 2,
                       },
                    ]
                  : [],
         },
      });
   });
   await page.route('**/api/courses/delete', async (route) => {
      await route.fulfill({ json: { success: true } });
   });

   await page.goto('/admin/manage-class');
   const deleteButton = page.getByRole('button', { name: '자료구조 삭제' });
   page.once('dialog', (dialog) => dialog.accept());
   await deleteButton.click();

   await expect.poll(() => courseRequestCount).toBe(2);
   await expect(deleteButton).toBeDisabled();

   releaseRefresh();
   await expect(deleteButton).toHaveCount(0);
});
