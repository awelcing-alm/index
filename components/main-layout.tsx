// app/components/main-layout.tsx
import type React from "react";
import { Sidebar } from "@/components/sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { UserHeader } from "@/components/user-header";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-paper text-ink">
        <div className="mx-auto flex max-w-screen-2xl">
          <Sidebar />
          <div className="flex-1">
            <UserHeader />
            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
