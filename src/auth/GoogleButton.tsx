// GoogleButton.js

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userLogin } from "../apis/users";
import {
  authorityState,
  isLoginState,
  isRegisterModalState,
  userLoginInfo,
} from "../store/atom";

export interface JwtHIStudyPayload extends JwtPayload {
  hd: string;
}

const handongEmailValidate = (decodedToken: JwtHIStudyPayload) => {
  if (
    decodedToken.hd !== "handong.edu" &&
    decodedToken.hd !== "handong.ac.kr"
  ) {
    alert("한동대학교 이메일로 로그인해주세요.");
    window.location.href = "/";
    return;
  }
};

export default function GoogleButton() {
  const navigate = useNavigate();
  const setRegisterModalState = useSetRecoilState(isRegisterModalState);
  const setUserLoginInfo = useSetRecoilState(userLoginInfo);
  const setIsLogin = useSetRecoilState(isLoginState);
  const setAuthority = useSetRecoilState(authorityState);
  // const { loginWithCredential } = useAuthContext();
  const onSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      alert("로그인에 실패하였습니다.");
      return;
    }
    const decodedToken = jwtDecode(
      credentialResponse.credential
    ) as JwtHIStudyPayload;
    // handongEmailValidate(decodedToken);

    if (!decodedToken.sub) {
      alert("로그인에 실패하였습니다.");
      return;
    }

    userLogin(
      // decodedToken.sub
      "test2"
    )
      .then((response) => {
        if (response.isRegistered === true) {
          localStorage.setItem("accessToken", response.tokens.accessToken);
          localStorage.setItem("refreshToken", response.tokens.refreshToken);

          window.location.href = "/";
          setIsLogin(true);
          setAuthority(response.role);
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
