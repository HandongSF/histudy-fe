import jwtDecode from "jwt-decode";
import { useSetRecoilState } from "recoil";
import { JwtHIStudyPayload } from "src/auth/GoogleButton";
import { roleState } from "src/store/atom";

export function useRoleInit() {
  function noValidToken() {
    setRole("NONUSER");
    return;
  }
  const setRole = useSetRecoilState(roleState);

  const token = localStorage.getItem("accessToken");

  if (!token) noValidToken();

  const userInfo = jwtDecode(token as string) as JwtHIStudyPayload;

  if (!userInfo.exp || userInfo.exp * 1000 < Date.now()) noValidToken();

  setRole(userInfo.rol);
}
