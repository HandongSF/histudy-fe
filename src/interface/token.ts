import { Role } from '@/interface/role';

export interface AuthResponse {
   isRegistered: boolean;
   tokenType: string;
   tokens: {
      accessToken: string;
      refreshToken: string;
   };
   role: Role;
}
