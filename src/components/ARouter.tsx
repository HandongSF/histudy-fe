import { createBrowserRouter } from "react-router-dom";

import { paths } from "@/const/paths";
import { ErrorElement } from "./ErrorElement";
import RootLayout from "./RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: paths.root,
        lazy: async () => ({
          Component: (await import("@/pages/Home/Page")).default,
        }),
      },
      {
        path: paths.ranks.root,
        lazy: async () => ({
          Component: (await import("@/pages/Rank/Page")).default,
        }),
      },
      {
        path: paths.reports.root,
        lazy: async () => ({
          Component: (await import("@/pages/ReportList/Page")).default,
        }),
      },
      {
        path: paths.reports.add,
        lazy: async () => ({
          Component: (await import("@/pages/ReportAdd/Page")).default,
        }),
      },
      {
        path: paths.reports.oneReport(":id"),
        lazy: async () => ({
          Component: (await import("@/pages/ReportDetail/Page")).default,
        }),
      },
      {
        path: paths.reports.edit(":id"),
        lazy: async () => ({
          Component: (await import("@/pages/ReportEdit/Page")).default,
        }),
      },
      {
        path: paths.application.root,
        lazy: async () => ({
          Component: (await import("@/pages/OverviewApplication/Page")).default,
        }),
      },
      {
        path: paths.application.add,
        lazy: async () => ({
          Component: (await import("@/pages/StudyApplication/Page")).default,
        }),
      },
      {
        path: paths.myGroup.root,
        lazy: async () => ({
          Component: (await import("@/pages/MyStudyGroup/Page")).default,
        }),
      },
      {
        path: paths.profile.root,
        lazy: async () => ({
          Component: (await import("@/pages/Profile/Page")).default,
        }),
      },
      {
        path: paths.admin.manageClass,
        lazy: async () => ({
          Component: (await import("@/pages/Admin/ManageClass/Page")).default,
        }),
      },
      {
        path: paths.admin.manageGroup,
        lazy: async () => ({
          Component: (await import("@/pages/Admin/ManageGroup/Page")).default,
        }),
      },
      {
        path: paths.admin.manageStudy,
        lazy: async () => ({
          Component: (await import("@/pages/Admin/ManageStudy/Page")).default,
        }),
      },
      {
        path: paths.admin.createGroup,
        lazy: async () => ({
          Component: (await import("@/pages/Admin/CreateGroup/Page")).default,
        }),
      },
      {
        path: paths.admin.manageStudent,
        lazy: async () => ({
          Component: (await import("@/pages/Admin/ManageStudent/Page")).default,
        }),
      },
      {
        path: paths.admin.manageReport,
        lazy: async () => ({
          Component: (await import("@/pages/Admin/ReportList/Page")).default,
        }),
      },
      {
        path: paths.admin.manageSemester,
        lazy: async () => ({
          Component: (await import("@/pages/Admin/ManageSemester/Page"))
            .default,
        }),
      },

      // 테스트를 위한 공간
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              path: paths.test.state,
              lazy: async () => ({
                Component: (await import("./histate-test")).default,
              }),
            },
          ]
        : []),

      // Else
      {
        path: paths.notFound,
        lazy: async () => ({
          Component: (await import("@/pages/404")).default,
        }),
      },
    ],
  },
]);
