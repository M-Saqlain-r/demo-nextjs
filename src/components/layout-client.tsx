"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "@/components/site-header";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/signup";

  return hideLayout ? (
    <div className="flex h-full w-full items-center justify-center">{children}</div>
  ) : (
    <div className="flex flex-1 overflow-hidden w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <SiteHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
