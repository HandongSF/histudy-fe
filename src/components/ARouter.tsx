import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import { paths } from "@/const/paths";
import NotFoundPage from "@/pages/404";
import CreateGroupPage from "@/pages/Admin/CreateGroup/Page";
import ManageClassPage from "@/pages/Admin/ManageClass/Page";
import MatchedGroupListPage from "@/pages/Admin/ManageGroup/Page";
import ManageStudentPage from "@/pages/Admin/ManageStudent/Page";
import ManageStudyPage from "@/pages/Admin/ManageStudy/Page";
import ReportListAdminPage from "@/pages/Admin/ReportList/Page";
import HomePage from "@/pages/Home/Page";
import StudyGroupInfoPage from "@/pages/MyStudyGroup/Page";
import OverviewApplicationPage from "@/pages/OverviewApplication/Page";
import ProfilePage from "@/pages/Profile/Page";
import RankPage from "@/pages/Rank/Page";
import ReportAddPage from "@/pages/ReportAdd/Page";
import ReportDetailPage from "@/pages/ReportDetail/Page";
import ReportEditPage from "@/pages/ReportEdit/Page";
import ReportListUserPage from "@/pages/ReportList/Page";
import StudyApplicationPage from "@/pages/StudyApplication/Page";
import RootLayout from "./RootLayout";
import { ErrorElement } from "./ErrorElement";
import HistateTest from "./histate-test";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorElement />,
    children: [
      { path: paths.root, element: <HomePage /> },
      { path: paths.ranks.root, element: <RankPage /> },
      {
        path: paths.reports.root,
        element: <PrivateRoute component={<ReportListUserPage />} />,
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
        element: <PrivateRoute component={<ManageClassPage />} />,
      },
      {
        path: paths.admin.manageGroup,
        element: <PrivateRoute component={<MatchedGroupListPage />} />,
      },
      {
        path: paths.admin.manageStudy,
        element: <PrivateRoute component={<ManageStudyPage />} />,
      },
      {
        path: paths.admin.createGroup,
        element: <PrivateRoute component={<CreateGroupPage />} />,
      },
      {
        path: paths.admin.manageStudent,
        element: <PrivateRoute component={<ManageStudentPage />} />,
      },
      {
        path: paths.admin.manageReport,
        element: <PrivateRoute component={<ReportListAdminPage />} />,
      },

      // 테스트를 위한 공간
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              path: paths.test.state,
              element: <HistateTest />,
            },
          ]
        : []),

      // Else
      { path: paths.notFound, element: <NotFoundPage /> },
    ],
  },
]);
