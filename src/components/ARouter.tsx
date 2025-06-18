import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import CreateGroup from "../pages/Admin/CreateGroup";
import ManageClass from "../pages/Admin/ManageClass";
import ManageGroup from "../pages/Admin/ManageGroup";
import ManageReport from "../pages/Admin/ManageReport";
import ManageStudent from "../pages/Admin/ManageStudent";
import StudyGroup from "../pages/Admin/StudyGroup";

import { paths } from "@/const/paths";
import NotFoundPage from "@/pages/404";
import HomePage from "@/pages/Home/Page";
import ReportDetailPage from "@/pages/Admin/ReportDetailPage";
import StudyGroupInfoPage from "@/pages/MyStudyGroup/Page";
import OverviewApplicationPage from "@/pages/OverviewApplication/Page";
import ProfilePage from "@/pages/Profile/Page";
import RankPage from "@/pages/Rank/Page";
import ReportAddPage from "@/pages/ReportAdd/Page";
import ReportEditPage from "@/pages/ReportEdit/Page";
import ReportListPage from "@/pages/ReportList/Page";
import StudyApplicationPage from "@/pages/StudyApplication/Page";
import RootLayout from "./RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: paths.root, element: <HomePage /> },
      { path: paths.ranks.root, element: <RankPage /> },
      {
        path: paths.reports.root,
        element: <PrivateRoute component={<ReportListPage />} />,
      },
      {
        path: paths.reports.add,
        element: <PrivateRoute component={<ReportAddPage />} />,
      },
      {
        path: paths.reports.oneReport(":id"),
        element: <PrivateRoute component={<ReportDetailPage />} />,
      },
      {
        path: paths.reports.edit(":id"),
        element: <PrivateRoute component={<ReportEditPage />} />,
      },
      {
        path: paths.application.root,
        element: <PrivateRoute component={<OverviewApplicationPage />} />,
      },
      {
        path: paths.application.add,
        element: <PrivateRoute component={<StudyApplicationPage />} />,
      },
      {
        path: paths.myGroup.root,
        element: <PrivateRoute component={<StudyGroupInfoPage />} />,
      },
      {
        path: paths.profile.root,
        element: <PrivateRoute component={<ProfilePage />} />,
      },
      {
        path: paths.admin.manageClass,
        element: <PrivateRoute component={<ManageClass />} />,
      },
      {
        path: paths.admin.manageGroup,
        element: <PrivateRoute component={<ManageGroup />} />,
      },
      {
        path: paths.admin.manageStudy,
        element: <PrivateRoute component={<StudyGroup />} />,
      },
      {
        path: paths.admin.createGroup,
        element: <PrivateRoute component={<CreateGroup />} />,
      },
      {
        path: paths.admin.manageStudent,
        element: <PrivateRoute component={<ManageStudent />} />,
      },
      {
        path: paths.admin.manageReport,
        element: <PrivateRoute component={<ManageReport />} />,
      },

      // Else
      { path: paths.notFound, element: <NotFoundPage /> },
    ],
  },
]);
