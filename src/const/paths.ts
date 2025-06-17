const ROOTS = {
  home: "/",
  reports: "/reports",
  admin: "/admin",
  application: "/application",
  ranks: "/ranks",
  profile: "/profile",
  myGroup: "/my-group",
  else: "*",
};

export const paths = {
  root: ROOTS.home,
  reports: {
    root: `${ROOTS.reports}`,
    add: `${ROOTS.reports}/new`,
    oneReport: (reportId: string) => `${ROOTS.reports}/${reportId}`,
    edit: (reportId: string) => `${ROOTS.reports}/${reportId}/edit`,
  },
  application: {
    root: `${ROOTS.application}`,
    add: `${ROOTS.application}/new`,
  },
  admin: {
    manageClass: `${ROOTS.admin}/manage-class`,
    manageGroup: `${ROOTS.admin}/manage-group`,
    createGroup: `${ROOTS.admin}/create-group`,
    manageStudy: `${ROOTS.admin}/manage-study`,
    manageReport: `${ROOTS.admin}/manage-report`,
    manageStudent: `${ROOTS.admin}/manage-student`,
  },
  ranks: {
    root: `${ROOTS.ranks}`,
  },
  profile: {
    root: `${ROOTS.profile}`,
  },
  myGroup: {
    root: `${ROOTS.myGroup}`,
  },
  notFound: `${ROOTS.else}`,
};
