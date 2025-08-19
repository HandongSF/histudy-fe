import GoogleButton from "@/components/GoogleButton";
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
import { Role } from "@/interface/role";
import { roleState } from "@/store/HISAtom";
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
import { useHIState, useHIStateValue } from "@/hooks/HIState";

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
  const [role, setRole] = useHIState(roleState);

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
  const role = useHIStateValue(roleState);

  const isLogin = role !== "NONUSER";
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

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className={cn(
        "p-3 border-b",
        "group-data-[collapsible=icon]:px-2"
      )}>
        <div className={cn(
          "flex justify-between items-center",
          "group-data-[collapsible=icon]:justify-center"
        )}>
          <Link
            to={paths.root}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 hover:bg-sidebar-accent",
              "group-data-[collapsible=icon]:hidden"
            )}
          >
            <span
              className={cn(
                "font-bold text-3xl text-blue-400",
                "transition-opacity duration-200 ease-in-out"
              )}
            >
              HIStudy
            </span>
          </Link>

          <SidebarTrigger 
            className={cn(
              "mr-4 group-data-[collapsible=icon]:mr-0"
            )} 
          />
        </div>
      </SidebarHeader>

      <SidebarContent className={cn(
        "flex-1 p-3 space-y-1",
        "group-data-[collapsible=icon]:px-2"
      )}>
        {/* <RoleSwitcher /> */}
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
                  <SidebarMenuItem 
                    key={item.name}
                    className={cn(
                      "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center",
                      "group-data-[collapsible=icon]:pl-[8px]"
                    )}
                  >
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
                        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:min-w-10 group-data-[collapsible=icon]:ml-1",
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

      {isLogin ? (
        <SidebarFooter className={cn(
          "p-3 border-t space-y-2",
          "group-data-[collapsible=icon]:px-2"
        )}>
          <SidebarMenu>
            <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <Link to="https://forms.gle/aLLsFtDBcMHqX9eQA" target="_blank">
                <SidebarMenuButton
                  tooltip={{
                    children: "피드백 보내기",
                    side: "right",
                    align: "center",
                    className: "bg-foreground text-background",
                  }}
                  className={cn(
                    "h-10 justify-start gap-3 px-3 hover:bg-sidebar-accent",
                    "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:min-w-10 group-data-[collapsible=icon]:ml-1"
                  )}
                >
                  <LifeBuoy className="size-5 shrink-0" />

                  <span className="truncate text-sm font-medium">피드백</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                onClick={logout}
                tooltip={{
                  children: "로그아웃",
                  side: "right",
                  align: "center",
                  className: "bg-foreground text-background",
                }}
                className={cn(
                  "h-10 justify-start gap-3 px-3 text-red-500 hover:bg-red-500/10 hover:text-red-600",
                  "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:min-w-10 group-data-[collapsible=icon]:ml-1"
                )}
              >
                <LogOut className="size-5 shrink-0" />
                <span className="truncate text-sm font-medium">로그아웃</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      ) : (
        <div className={cn(
          "w-full flex justify-center items-center p-4",
          "group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2"
        )}>
          <div className={cn(
            "w-full max-w-full overflow-hidden",
            // Collapse 상태에서 GoogleLogin 버튼 스타일링
            "group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto",
            "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center",
            "group-data-[collapsible=icon]:relative group-data-[collapsible=icon]:overflow-hidden",
            // GoogleLogin 버튼 내부 요소들 숨기기
            "group-data-[collapsible=icon]:[&>div]:w-10 group-data-[collapsible=icon]:[&>div]:h-10",
            "group-data-[collapsible=icon]:[&>div]:!min-width-0 group-data-[collapsible=icon]:[&>div]:overflow-hidden",
            "group-data-[collapsible=icon]:[&>div>div]:w-10 group-data-[collapsible=icon]:[&>div>div]:h-10",
            "group-data-[collapsible=icon]:[&>div>div]:!min-width-0 group-data-[collapsible=icon]:[&>div>div]:overflow-hidden",
            "group-data-[collapsible=icon]:[&>div>div]:flex group-data-[collapsible=icon]:[&>div>div]:items-center group-data-[collapsible=icon]:[&>div>div]:justify-center",
            // Border 제거
            "group-data-[collapsible=icon]:[&>div]:border-0 group-data-[collapsible=icon]:[&>div]:!border-none",
            "group-data-[collapsible=icon]:[&>div>div]:border-0 group-data-[collapsible=icon]:[&>div>div]:!border-none",
            "group-data-[collapsible=icon]:[&_*]:border-0 group-data-[collapsible=icon]:[&_*]:!border-none",
            // 배경색 통일
            "group-data-[collapsible=icon]:[&>div]:bg-sidebar group-data-[collapsible=icon]:[&>div]:!bg-sidebar",
            "group-data-[collapsible=icon]:[&>div>div]:bg-sidebar group-data-[collapsible=icon]:[&>div>div]:!bg-sidebar",
            "group-data-[collapsible=icon]:[&_*]:bg-sidebar group-data-[collapsible=icon]:[&_*]:!bg-sidebar",
            // 텍스트 숨기기
            "group-data-[collapsible=icon]:[&_span]:hidden",
            // 로고만 보이도록 조정
            "group-data-[collapsible=icon]:[&_svg]:w-5 group-data-[collapsible=icon]:[&_svg]:h-5",
            "group-data-[collapsible=icon]:[&_img]:w-5 group-data-[collapsible=icon]:[&_img]:h-5"
          )}>
            <GoogleButton />
          </div>
        </div>
      )}

      <SidebarRail className="hover:after:bg-primary/20" />
    </Sidebar>
  );
}
