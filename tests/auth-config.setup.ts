import { expect, test } from '@playwright/test';

const E2E_SUB_VARIABLES = ['E2E_USER_SUB', 'E2E_MEMBER_SUB', 'E2E_ADMIN_SUB'] as const;
const LEGACY_TOKEN_VARIABLES = ['E2E_USER_ACCESS_TOKEN', 'E2E_MEMBER_ACCESS_TOKEN', 'E2E_ADMIN_ACCESS_TOKEN'] as const;

test('E2E 인증은 역할별 계정 식별자를 사용하고 고정 access token을 사용하지 않는다', () => {
   for (const variableName of E2E_SUB_VARIABLES) {
      expect(process.env[variableName], `${variableName} 환경 변수가 필요합니다.`).toBeTruthy();
   }

   for (const variableName of LEGACY_TOKEN_VARIABLES) {
      expect(process.env[variableName], `${variableName} 대신 역할별 E2E_*_SUB를 사용해야 합니다.`).toBeUndefined();
   }
});
