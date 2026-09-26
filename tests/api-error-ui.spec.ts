import { expect, test } from '@playwright/test';

const adminToken = [
   'header',
   btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, rol: 'ADMIN' })),
   'signature',
].join('.');

test('관리자 작업의 5xx 오류는 사용자에게 errorId를 안내한다', async ({ page }) => {
   // given
   await page.addInitScript((accessToken) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', 'refresh-token');
   }, adminToken);
   await page.route('**/api/courses?search=*', async (route) => {
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
   await page.route('**/api/courses/101', async (route) => {
      await route.fulfill({
         status: 500,
         json: {
            code: 500,
            error: 'Internal Server Error',
            message: '서버 내부 오류가 발생했습니다.',
            requestId: 'request-123',
            errorId: 'error-456',
         },
      });
   });

   // when
   await page.goto('/admin/manage-class');
   page.once('dialog', (dialog) => dialog.accept());
   await page.getByRole('button', { name: '자료구조 삭제' }).click();

   // then
   await expect(page.getByText('서버 내부 오류가 발생했습니다. (오류 ID: error-456)', { exact: true })).toBeVisible();
});
