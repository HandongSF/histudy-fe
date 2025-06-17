import { Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { Role, roleState } from "../store/atom";
import { paths } from "@/const/paths";

interface PrivateRouteProps {
  component: React.ReactNode;
}

const validateByAuth = (access: Role, pathname: string) => {
  switch (pathname) {
    case paths.application.add:
      if (access === "USER") return true;
      return false;
    case paths.myGroup.root:
      if (access === "MEMBER") return true;
      return false;
    case paths.reports.root:
      if (access === "MEMBER") return true;
      return false;
    case paths.application.root:
      if (access === "USER") return true;
      return false;
    case paths.admin.manageClass:
      if (access === "ADMIN") return true;
      return false;
    case paths.profile.root:
      if (access !== "NONUSER") return true;
      return false;
    default:
      return null;
  }
};

function PrivateRoute({ component }: PrivateRouteProps) {
  const role = useRecoilValue(roleState);
  const location = useLocation();

  const isValid = validateByAuth(role, location.pathname);

  if (!isValid) {
    return <Navigate to={paths.root} replace />;
  }

  return component;
}
export default PrivateRoute;
