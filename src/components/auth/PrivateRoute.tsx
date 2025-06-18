import { Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { Role, roleState } from "../../store/atom";
import { paths } from "@/const/paths";

interface PrivateRouteProps {
  component: React.ReactNode;
}

const validateByAuth = (access: Role, pathname: string) => {
  switch (true) {
    case pathname.includes(paths.reports.root):
      return access === "MEMBER" || access === "ADMIN";
    case pathname.includes(paths.application.root):
      return access === "USER";
    case pathname === paths.myGroup.root:
      return access === "MEMBER";
    case pathname === paths.profile.root:
      return access === "MEMBER" || access === "ADMIN" || access === "USER";
    default:
      return access === "ADMIN";
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
