import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../../auth/PrivateRoute";
import CreateGroup from "../../pages/Manager/CreateGroup";
import ManageClass from "../../pages/Manager/ManageClass";
import ManageGroup from "../../pages/Manager/ManageGroup";
import ManageReport from "../../pages/Manager/ManageReport";
import ManageStudent from "../../pages/Manager/ManageStudent";
import ReportDetail from "../../pages/Manager/ReportDetail";
import StudyGroup from "../../pages/Manager/StudyGroup";

import { paths } from "@/const/paths";
import NotFoundPage from "@/pages/404";
import ReportEditPage from "@/pages/ReportEdit/Page";
import StudyApplicationPage from "@/pages/StudyApplication/Page";
import StudyGroupInfoPage from "@/pages/MyStudyGroup/Page";
import HomePage from "@/pages/Home/Page";
import ReportDetailPage from "@/pages/Manager/ReportDetailPage";
import ReportAddPage from "@/pages/ReportAdd/Page";
import ProfilePage from "@/pages/Profile/Page";
import RankPage from "@/pages/Rank/Page";
import ReportListPage from "@/pages/ReportList/Page";
import Layout from "./app-layout";
import OverviewApplicationPage from "@/pages/OverviewApplication/Page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
