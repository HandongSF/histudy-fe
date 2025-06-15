import { Role } from "src/store/atom";

export interface AuthResponse {
  isRegistered: boolean;
  tokenType: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  role: Role;
}
