import { paths } from '@/const/paths';
import test, { expect } from '@playwright/test';

test.use({ storageState: 'e2e-tests/auth/admin.json' });
test('어드민(ADMIN)의 관리자 페이지들 접근 테스트', async ({ page }) => {
   // 현재 학기 수업 조회 페이지 접근
   await page.goto(paths.admin.manageClass);
   await page.waitForTimeout(1000);
   await page.getByRole('heading', { name: '등록된 수업 목록' }).click();
   await expect(page.getByRole('heading', { name: '등록된 수업 목록' })).toBeVisible();
   await expect(page.getByRole('textbox', { name: '과목명 검색' })).toBeVisible();
   await expect(page.getByRole('cell', { name: '과목명' })).toBeVisible();
   await expect(page.getByRole('button', { name: '수업 목록 불러오기' })).toBeVisible();

   // 스터디 그룹 생성 페이지 접근
   await page.getByRole('link', { name: '스터디 그룹 생성' }).click();
   await page.waitForTimeout(1000);
   await expect(page.getByRole('heading', { name: '신청자 리스트' })).toBeVisible();
   await expect(page.getByRole('button', { name: '그룹 매칭하기' })).toBeVisible();

   // 스터디 그룹 매칭 관리 페이지 접근
   await page.getByRole('link', { name: '스터디 그룹 매칭 관리' }).click();
   await page.waitForTimeout(1000);
   await expect(page.getByText('매칭된 그룹 목록')).toBeVisible();
   await expect(page.getByRole('columnheader', { name: '그룹' }).first()).toBeVisible();
   await expect(page.getByText('미매칭 학생 목록')).toBeVisible();
   await expect(page.getByRole('columnheader', { name: '그룹' }).nth(1)).toBeVisible();

   // 그룹별 활동 조회 페이지 접근
   await page.getByRole('link', { name: '그룹별 활동 조회' }).click();
   await page.waitForTimeout(1000);
   await expect(page.getByRole('heading', { name: '그룹 활동 목록' })).toBeVisible();
   await expect(page.getByRole('button', { name: '그룹 활동 목록 엑셀 다운' })).toBeVisible();
   await expect(page.getByRole('cell', { name: '그룹', exact: true })).toBeVisible();

   // 스터디 신청자 정보 조회 페이지 접근
   await page.getByRole('link', { name: '스터디 신청자 정보 조회' }).click();
   await page.waitForTimeout(1000);
   await expect(page.getByRole('heading', { name: '스터디 신청자 목록' })).toBeVisible();
   await expect(page.getByRole('button', { name: '신청자 목록 다운로드' })).toBeVisible();
   await expect(page.getByRole('cell', { name: '그룹' })).toBeVisible();

   // 학기 관리 페이지 접근
   await page.getByRole('link', { name: '학기 관리' }).click();
   await page.waitForTimeout(1000);
   await expect(page.getByRole('heading', { name: '학기 관리' })).toBeVisible();
   await expect(page.getByRole('button', { name: '새 학기 추가' })).toBeVisible();
   await expect(page.getByText('학기 삭제 기능이 없으니 주의해서 생성해주세요')).toBeVisible();
   await expect(page.getByRole('cell', { name: '상태' })).toBeVisible();
});
