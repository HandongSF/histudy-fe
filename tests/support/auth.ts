import { userLogin } from '@/apis/users';
import { Role } from '@/interface/role';
import type { AuthResponse } from '@/interface/token';

type E2ETestableRole = Exclude<Role, 'NONUSER'>;

const SUB_ENV_BY_ROLE: Record<E2ETestableRole, string> = {
   USER: 'E2E_USER_SUB',
   MEMBER: 'E2E_MEMBER_SUB',
   ADMIN: 'E2E_ADMIN_SUB',
};

export function validateLoginResult(
   loginResult: AuthResponse | null | undefined,
   role: E2ETestableRole,
   variableName: string,
): asserts loginResult is AuthResponse {
   if (
      !loginResult ||
      !loginResult.isRegistered ||
      loginResult.role !== role ||
      !loginResult.tokens?.accessToken ||
      !loginResult.tokens.refreshToken
   ) {
      throw new Error(`${variableName}에 등록된 계정은 ${role} 권한이어야 하며, 유효한 토큰 정보가 포함되어야 합니다.`);
   }
}

export async function loginAs(role: E2ETestableRole) {
   const variableName = SUB_ENV_BY_ROLE[role];
   const sub = process.env[variableName];

   if (!sub) {
      throw new Error(`${variableName} 환경 변수가 필요합니다.`);
   }

   const loginResult = await userLogin(sub);

   validateLoginResult(loginResult, role, variableName);

   return loginResult;
}
