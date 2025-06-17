import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { paths } from "@/const/paths";
import {
  BarChart3,
  ClipboardEdit,
  FileText,
  Home,
  Settings2,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type NavItem = {
  href: string;
  label: string;
  icon: any;
  requiresAuth?: boolean;
  managerOnly?: boolean;
};

const navItems: NavItem[] = [
  {
    href: paths.myGroup.root,
    label: "My Study",
    icon: Users,
    requiresAuth: true,
  },
  {
    href: paths.reports.root,
    label: "Report",
    icon: FileText,
    requiresAuth: true,
  },
  {
    href: paths.ranks.root,
    label: "Rank",
    icon: BarChart3,
    requiresAuth: true,
  },
  {
    href: paths.application.root,
    label: "Apply For HISTUDY",
    icon: ClipboardEdit,
  },
  {
    href: paths.admin.manageClass,
    label: "MANAGER",
    icon: Settings2,
    requiresAuth: true,
    managerOnly: true,
  },
];

export function AppSidebar() {
  //   const { isLoggedIn } = useAuth()
  const isLoggedIn = false;
  const location = useLocation();
  const pathname = location.pathname;

  const isManager = isLoggedIn; // Simplified for example

  const filteredNavItems = navItems.filter((item) => {
    if (item.requiresAuth && !isLoggedIn) return false;
    if (item.managerOnly && !isManager) return false;
    return true;
  });

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <Link to={paths.root} className="flex items-center gap-2 font-semibold">
          <img src="/logo_histudy.png" alt="Histudy Logo" width={130} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === paths.root}
                  tooltip={{ children: "Home", side: "right" }}
                >
                  <Link to={paths.root}>
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: "right" }}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
