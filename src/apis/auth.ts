import { BACKEND_BASE_URL } from '@/const/endpoints';
import axios from 'axios';

interface RefreshTokenRequest {
   refreshToken: string;
   grantType: string;
}

interface RefreshTokenResponse {
   tokenType: string;
   grantType: string;
   token: string;
}

export const tokenRefresh = async (refreshToken: string): Promise<RefreshTokenResponse> => {
   const tokenBody = {
      grantType: 'refresh_token',
      refreshToken,
   } as RefreshTokenRequest;
   const response = await axios.post(`${BACKEND_BASE_URL}/api/auth/token`, tokenBody);

   return response.data;
};
