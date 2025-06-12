// GoogleButton.js

import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userLogin } from "../apis/users";
import {
  authorityState,
  isLoginState,
  isRegisterModalState,
  userLoginInfo,
} from "../store/atom";

const handongEmailValidate = (decodedToken) => {
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

  const onSuccess = async (credentialResponse) => {
    const decodedToken = jwtDecode(credentialResponse.credential);

    handongEmailValidate(decodedToken);

    userLogin(decodedToken.sub)
      .then((response) => {
        if (response.data.isRegistered === true) {
          localStorage.setItem("accessToken", response.data.tokens.accessToken);
          localStorage.setItem(
            "refreshToken",
            response.data.tokens.refreshToken
          );

          window.location.href = "/";
          setIsLogin(true);
          setAuthority(response.data.role);
        }
      })
      .catch((error) => {
        if (error.response.data.isRegistered === false) {
          console.log("ddd", error.response.data);
          navigate("/");
          setRegisterModalState(true);
          setUserLoginInfo(decodedToken);
        }
      });
  };

  const onFailure = (error) => {
    console.log(error);
  };

  return (
    <>
      <GoogleLogin
        onSuccess={(credentialResponse) => onSuccess(credentialResponse)}
        onFailure={onFailure}
        useOneTap
      />
    </>
  );
}
