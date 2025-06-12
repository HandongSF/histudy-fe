import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { authorityState } from "../store/atom";

function PrivateRoute({ component: Component }) {
  const access = useRecoilValue(authorityState);
  const location = useLocation();
  const navigate = useNavigate();

  const validateWithRole = () => {
    switch (location.pathname) {
      case "/group":
        if (access === "MEMBER") return true;
        return false;
      case "/report":
        if (access === "MEMBER") return true;
        return false;
      case "/enroll":
        if (access === "USER") return true;
        return false;
      case "/manageClass":
        if (access === "ADMIN") return true;
        return false;
      case "/profile":
        if (access !== "NONUSER") return true;
        return false;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!validateWithRole(access)) {
      alert("접근이 불가능 합니다.");
      navigate("/");
    }
  }, []);

  return access ? Component : <Navigate to="/" />;
}
export default PrivateRoute;
