import jwtDecode from "jwt-decode";
import { useSetRecoilState } from "recoil";
import { JwtHIStudyPayload } from "@/components/GoogleButton";
import { roleState } from "src/store/atom";

export function useRoleInit() {
  const setRole = useSetRecoilState(roleState);

  const token = localStorage.getItem("accessToken");
  if (!token) {
    setRole("NONUSER");
    return;
  }
  const userInfo = jwtDecode(token as string) as JwtHIStudyPayload;

  if (!userInfo.exp || userInfo.exp * 1000 < Date.now()) {
    setRole("NONUSER");
    return;
  }

  setRole(userInfo.rol);
}
