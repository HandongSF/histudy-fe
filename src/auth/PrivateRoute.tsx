import { Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { Authority, authorityState } from "../store/atom";

interface PrivateRouteProps {
  component: React.ReactNode;
}

const validateByAuth = (access: Authority, pathname: string) => {
  switch (pathname) {
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

function PrivateRoute({ component }: PrivateRouteProps) {
  const authority = useRecoilValue(authorityState);
  const location = useLocation();

  const isValid = validateByAuth(authority, location.pathname);

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return component;
}
export default PrivateRoute;
