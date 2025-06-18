import GoogleButton from "@/auth/GoogleButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Select 추가
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { paths } from "@/const/paths";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { Role, roleState } from "@/store/atom";
import {
  BookOpen,
  FileText,
  LifeBuoy,
  ListCheck,
  LogOut,
  Pen,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  allowedRoles?: Role[]; // 역할 기반 접근 제어
}

interface NavGroup {
  title: string;
  items: NavItem[];
  allowedRoles?: Role[]; // 그룹 전체에 대한 역할 설정도 가능
}

const navGroupsData: NavGroup[] = [
  {
    title: "스터디",
    allowedRoles: ["USER", "MEMBER", "ADMIN", "NONUSER"],
    items: [
      {
        name: "마이 스터디",
        icon: Pen,
        href: paths.myGroup.root,
        allowedRoles: ["MEMBER"],
      },
      {
        name: "보고서",
        icon: FileText,
        href: paths.reports.root,
        allowedRoles: ["MEMBER"],
      },
      {
        name: "스터디 랭킹",
        icon: Users,
        href: paths.ranks.root,
        allowedRoles: ["MEMBER", "NONUSER", "USER", "ADMIN"],
      },
      {
        name: "스터디 신청",
        icon: LifeBuoy,
        href: paths.application.root,
        allowedRoles: ["USER"],
      },
    ],
  },
  {
    title: "관리",
    allowedRoles: ["MEMBER", "ADMIN", "USER"],
    items: [
      {
        name: "프로필 관리",
        icon: UserCog,
        href: paths.profile.root,
        allowedRoles: ["MEMBER", "USER", "ADMIN"],
      },
    ],
  },
  {
    title: "관리자",
    allowedRoles: ["ADMIN"],
    items: [
      {
        name: "현재 학기 수업 조회",
        icon: BookOpen,
        href: paths.admin.manageClass,
        allowedRoles: ["ADMIN"],
      },
      {
        name: "스터디 그룹 생성",
        icon: UserPlus,
        href: paths.admin.createGroup,
        allowedRoles: ["ADMIN"],
      },
      {
        name: "스터디 그룹 매칭 관리",
        icon: UsersRound,
        href: paths.admin.manageGroup,
        allowedRoles: ["ADMIN"],
      },
      {
        name: "그룹별 활동 조회",
        icon: UserCheck,
        href: paths.admin.manageStudy,
        allowedRoles: ["ADMIN"],
      },
      {
        name: "스터디 신청자 정보 조회",
        icon: ListCheck,
        href: paths.admin.manageStudent,
        allowedRoles: ["ADMIN"],
      },
    ],
  },
];

// 데모용 역할 변경 컴포넌트
function RoleSwitcher() {
  const [role, setRole] = useRecoilState(roleState);
  return (
    <div className="p-3 group-data-[collapsible=icon]:p-2">
      <Select
        value={role}
        onValueChange={(newRole) => setRole(newRole as Role)}
      >
        <SelectTrigger className="w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-2">
          <UserCog className="size-5 shrink-0 group-data-[collapsible=icon]:m-0 group-data-[collapsible=expanded]:mr-2" />
          <span className="group-data-[collapsible=icon]:hidden">
            <SelectValue placeholder="Select role" />
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NONUSER">Non-User</SelectItem>
          <SelectItem value="USER">User</SelectItem>
          <SelectItem value="MEMBER">Member</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function CommonSidebar() {
  const pathname = useLocation().pathname;
  const role = useRecoilValue(roleState);

  const isActive = (href: string) => {
    if (href === paths.root) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const { logout } = useAuth();

  // 역할에 따라 네비게이션 그룹 필터링
  const filteredNavGroups = navGroupsData
    .filter((group) => !group.allowedRoles || group.allowedRoles.includes(role))
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.allowedRoles || item.allowedRoles.includes(role)
      ),
    }))
    .filter((group) => group.items.length > 0);

  const canShowFeedback = ["USER", "MEMBER", "ADMIN"].includes(role);
  const canShowLogout = ["USER", "MEMBER", "ADMIN"].includes(role);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-3 border-b">
        <div className="flex justify-between items-center">
          <Link
            to={paths.root}
            className="flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 hover:bg-sidebar-accent"
          >
            <span
              className={cn(
                "font-bold text-3xl group-data-[collapsible=icon]:hidden text-blue-400",
                "transition-opacity duration-200 ease-in-out"
              )}
            >
              HIStudy
            </span>
          </Link>

          <SidebarTrigger className="mr-4" />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-3 space-y-1">
        {" "}
        {/* 그룹 간 간격 미세 조정 */}
        {/* 데모용 역할 변경 UI */}
        <RoleSwitcher />
        {filteredNavGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel
              className={cn(
                "text-xs font-semibold uppercase text-muted-foreground tracking-wider px-2 pt-3 pb-1", // 패딩 조정
                "group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:py-2"
              )}
            >
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={{
                        children: item.name,
                        side: "right",
                        align: "center",
                        className: "bg-foreground text-background",
                      }}
                      className={cn(
                        "h-10 justify-start gap-3 px-3",
                        "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90",
                        "hover:bg-sidebar-accent"
                      )}
                    >
                      <Link to={item.href}>
                        <item.icon className="size-5 shrink-0" />
                        <span className="truncate text-sm font-medium">
                          {item.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {canShowFeedback || canShowLogout ? (
        <SidebarFooter className="p-3 border-t space-y-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to="https://forms.gle/aLLsFtDBcMHqX9eQA" target="_blank">
                <SidebarMenuButton
                  tooltip={{
                    children: "피드백 보내기",
                    side: "right",
                    align: "center",
                    className: "bg-foreground text-background",
                  }}
                  className="h-10 justify-start gap-3 px-3 hover:bg-sidebar-accent"
                >
                  <LifeBuoy className="size-5 shrink-0" />

                  <span className="truncate text-sm font-medium">피드백</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {canShowLogout && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  tooltip={{
                    children: "로그아웃",
                    side: "right",
                    align: "center",
                    className: "bg-foreground text-background",
                  }}
                  className="h-10 justify-start gap-3 px-3 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                >
                  <LogOut className="size-5 shrink-0" />
                  <span className="truncate text-sm font-medium">로그아웃</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      ) : (
        <div className="w-full flex justify-center items-center p-4">
          <GoogleButton />
        </div>
      )}

      <SidebarRail className="hover:after:bg-primary/20" />
    </Sidebar>
  );
}
