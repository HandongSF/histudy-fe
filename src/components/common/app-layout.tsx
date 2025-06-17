import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { CommonSidebar } from "./SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const defaultOpen = true;
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <CommonSidebar />

      <SidebarInset className="flex flex-col">
        <main className="flex-1 p-20 py-0 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 ">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
