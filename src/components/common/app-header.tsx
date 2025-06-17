"use client";

import { Link, useLocation } from "react-router-dom";
import { User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader({ title }: { title: string }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <header className=" w-full sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1">{title}</div>
      <div className="flex items-center gap-2">
        {true ? (
          <>
            <Button
              variant={pathname === "/profile" ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log("로그아웃")}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("로그인")}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Log in
          </Button>
        )}
      </div>
    </header>
  );
}
