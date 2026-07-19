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
      courses.splice(
         courses.findIndex((course) => course.id === body.id),
         1,
      );
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
