// GoogleButton.js

import { paths } from "@/const/paths";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useAuth } from "src/hooks/auth";
import { userLogin } from "../apis/users";
import { isRegisterModalState, roleState, userLoginInfo } from "../store/atom";
import { toast } from "sonner";
import { Role } from "@/interface/role";

export interface JwtHIStudyPayload extends JwtPayload {
  hd: string;
  rol: Role;
}
// TODO: 테스트 후 적용
const handongEmailValidate = (decodedToken: JwtHIStudyPayload) => {
  if (
    decodedToken.hd !== "handong.edu" &&
    decodedToken.hd !== "handong.ac.kr"
  ) {
    toast.error("한동대학교 이메일로 로그인해주세요.");
    window.location.href = paths.root;
    return;
  }
};

export default function GoogleButton() {
  const role = useRecoilValue(roleState);
  const setRegisterModalState = useSetRecoilState(isRegisterModalState);
  const setUserLoginInfo = useSetRecoilState(userLoginInfo);
  const { login } = useAuth();

  // const { loginWithCredential } = useAuthContext();
  const onSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("로그인에 실패하였습니다.");
      return;
    }
    const decodedToken = jwtDecode(
      credentialResponse.credential
    ) as JwtHIStudyPayload;
    // handongEmailValidate(decodedToken);

    if (!decodedToken.sub) {
      toast.error("로그인에 실패하였습니다.");
      return;
    }
    // TODO: 테스트 후 삭제
    const testSub = {
      ADMIN: "test3",
      MEMBER: "test2",
      USER: "test1",
    } as Record<Role, string>;

    userLogin(testSub[role] || decodedToken.sub)
      .then((response) => {
        if (response.isRegistered === true) {
          login(
            response.tokens.accessToken,
            response.tokens.refreshToken,
            response.role
          );
        }
      })
      // 구글 로그인 성공 후 히즈스터디 서버 로그인 API 에러 발생
      .catch((error) => {
        if (error.response && error.response.data.isRegistered === false) {
          // navigate("/");
          setRegisterModalState(true);
          setUserLoginInfo(decodedToken);
        }
      });
  };

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => onSuccess(credentialResponse)}
      onError={() => {
        console.log("Login Failed");
      }}
      useOneTap
    />
  );
}
