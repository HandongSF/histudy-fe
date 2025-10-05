import { JwtHIStudyPayload } from '@/components/GoogleButton';
import jwtDecode from 'jwt-decode';
import { roleState } from 'src/store/HISAtom';
import { useSetHiState } from './HIState';

export function useRoleInit() {
   const setRole = useSetHiState(roleState);

   const token = localStorage.getItem('accessToken');
   if (!token) {
      setRole('NONUSER');
      return;
   }
   const userInfo = jwtDecode(token as string) as JwtHIStudyPayload;

   if (!userInfo.exp || userInfo.exp * 1000 < Date.now()) {
      setRole('NONUSER');
      return;
   }

   setRole(userInfo.rol);
}
