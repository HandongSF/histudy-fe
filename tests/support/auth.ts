import { userLogin } from '@/apis/users';
import { Role } from '@/interface/role';

type E2ETestableRole = Exclude<Role, 'NONUSER'>;

const SUB_ENV_BY_ROLE: Record<E2ETestableRole, string> = {
   USER: 'E2E_USER_SUB',
   MEMBER: 'E2E_MEMBER_SUB',
   ADMIN: 'E2E_ADMIN_SUB',
};

export async function loginAs(role: E2ETestableRole) {
   const variableName = SUB_ENV_BY_ROLE[role];
   const sub = process.env[variableName];

   if (!sub) {
      throw new Error(`${variableName} 환경 변수가 필요합니다.`);
   }

   const loginResult = await userLogin(sub);

   if (!loginResult.isRegistered || loginResult.role !== role) {
      throw new Error(`${variableName}에 등록된 계정은 ${role} 권한이어야 합니다.`);
   }

   return loginResult;
}
