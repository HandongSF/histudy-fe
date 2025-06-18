import { Box } from "@mui/system";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userSignup } from "../../apis/users";
import MainImage from "../../components/Main/MainImage";
import RegisterModal from "../../components/Main/RegisterModal";
import {
  isLoginState,
  isRegisterModalState,
  roleState,
  userLoginInfo,
} from "../../store/atom";
import "./css/Textfield.css";
import { toast } from "sonner";

const nameConverter = (name) => {
  if (name.slice(-3) === "학부생") return name.slice(0, -3);
  return name;
};

export default function Main() {
  const [sid, setSid] = useState("");
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  const [isRegisterModal, setIsRegisterModal] =
    useRecoilState(isRegisterModalState);
  const [userLoginInfoState, setUserLoginInfoState] =
    useRecoilState(userLoginInfo);
  const setRole = useSetRecoilState(roleState);

  const handleClick = async (e) => {
    e.preventDefault();

    const newUser = {
      sub: userLoginInfoState.sub,
      email: userLoginInfoState.email,
      name: nameConverter(userLoginInfoState.name),
      sid: sid,
    };

    if (sid.length === 0) {
      toast.warning("학번을 입력해주세요");
      return;
    }
    if (sid.length !== 8) {
      toast.warning("학번을 정확히 입력해주세요.");
      return;
    }

    const response = await userSignup(newUser);

    toast.success("회원가입이 완료되었습니다.");
    localStorage.setItem("accessToken", response.tokens.accessToken);
    localStorage.setItem("refreshToken", response.tokens.refreshToken);
    setIsRegisterModal(false);
    setUserLoginInfoState(null);
    setIsLogin(true);
    setRole(response.role);

    window.location.reload();
  };

  useEffect(() => {
    window.scrollTo(0, 80);
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <MainImage />

      {isRegisterModal && (
        <RegisterModal handleClick={handleClick} sid={sid} setSid={setSid} />
      )}
    </Box>
  );
}
