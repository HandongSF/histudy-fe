import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isLoginState, Role, roleState } from "src/store/atom";

export function useAuth() {
  const setIsLogin = useSetRecoilState(isLoginState);
  const setRole = useSetRecoilState(roleState);
  const navigate = useNavigate();

  return {
    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLogin(false);
      setRole("NONUSER");

      navigate("/");
    },
    login: (accessToken: string, refreshToken: string, role: Role) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setIsLogin(true);
      setRole(role);
    },
  };
}
