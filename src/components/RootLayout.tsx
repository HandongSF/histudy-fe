import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { CommonSidebar } from './SideBar';
import { Outlet } from 'react-router-dom';
import { useAxiosInterceptor } from '@/hooks/axiosInterceptor';
import Footer from './Footer';
import { DevRoleSwitcher } from './DevRoleSwitcher';

export default function RootLayout() {
   useAxiosInterceptor();
   const defaultOpen = true;
   return (
      <SidebarProvider defaultOpen={defaultOpen}>
         <CommonSidebar />

         <SidebarInset className="flex flex-col">
            <main className="min-h-screen flex-1 p-6 py-0 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 relative">
               <SidebarTrigger className="absolute top-2 left-4 block md:hidden" />
               <Outlet />
               <div className="h-[100px]" />
            </main>

            {process.env.NODE_ENV === 'development' && <DevRoleSwitcher />}

            <Footer />
         </SidebarInset>
      </SidebarProvider>
   );
}
