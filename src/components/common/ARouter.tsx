import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../../auth/PrivateRoute";
import Main from "../../pages/Main/Main";
import CreateGroup from "../../pages/Manager/CreateGroup";
import ManageClass from "../../pages/Manager/ManageClass";
import ManageGroup from "../../pages/Manager/ManageGroup";
import ManageReport from "../../pages/Manager/ManageReport";
import ManageStudent from "../../pages/Manager/ManageStudent";
import ReportDetail from "../../pages/Manager/ReportDetail";
import StudyGroup from "../../pages/Manager/StudyGroup";

import { paths } from "@/const/paths";
import NotFoundPage from "@/pages/404";
import EditReportPage from "@/pages/EditReport/EditReportPage";
import StudyGroupInfoPage from "@/pages/Group/StudyGroupInfoPage";
import ReportDetailPage from "@/pages/Manager/ReportDetailPage";
import PostPage from "@/pages/Post/PostPage";
import Profile from "@/pages/Profile/Profile";
import Rank from "@/pages/Rank/Rank";
import ReportListPage from "@/pages/Report/Report";
import ApplicationOverviewPage from "../Enroll/ApplicationStatusView";
import Layout from "./app-layout";
import Enroll from "@/pages/Enroll/Enroll";
import HomePage from "@/pages/Main/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: paths.root, element: <HomePage /> },
      {
        path: paths.reports.root,
        element: <PrivateRoute component={<ReportListPage />} />,
      },
      { path: paths.reports.add, element: <PostPage /> },
      { path: paths.reports.oneReport(":id"), element: <ReportDetailPage /> },
      { path: paths.reports.edit(":id"), element: <EditReportPage /> },
      { path: paths.ranks.root, element: <Rank /> },
      {
        path: paths.application.root,
        element: <PrivateRoute component={<ApplicationOverviewPage />} />,
      },
      {
        path: paths.application.add,
        element: <PrivateRoute component={<Enroll />} />,
      },
      {
        path: paths.myGroup.root,
        element: <PrivateRoute component={<StudyGroupInfoPage />} />,
      },
      {
        path: paths.profile.root,
        element: <PrivateRoute component={<Profile />} />,
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

      { path: paths.reports.oneReport(":id"), element: <ReportDetail /> },

      // Else
      { path: paths.notFound, element: <NotFoundPage /> },
    ],
  },
]);
