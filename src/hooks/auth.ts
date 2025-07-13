import { paths } from "@/const/paths";
import { Role } from "@/interface/role";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { roleState } from "src/store/atom";

export function useAuth() {
  const setRole = useSetRecoilState(roleState);
  const navigate = useNavigate();

  return {
    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setRole("NONUSER");

      navigate(paths.root);
    },
    login: (accessToken: string, refreshToken: string, role: Role) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setRole(role);
    },
  };
}
