"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Layers,
  Menu,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/users", icon: Users, label: "Users" },            // fixed
  { href: "/templates", icon: FileText, label: "Templates" },
  { href: "/teams", icon: UserCircle2, label: "Teams" },
  { href: "/products", icon: Package, label: "Products" },
  { href: "/bulk-ops", icon: Layers, label: "Bulk Ops" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 h-screen border-r border-line bg-paper transition-all duration-200 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-3 py-3">
        {!isCollapsed && (
          <h1 className="font-serif text-2xl text-ink">Zephr</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed((v) => !v)}
          className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <nav className="mt-1 space-y-1 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-none px-3 py-2 text-sm",
                "border-l-2 border-transparent text-ink hover:bg-[hsl(var(--muted))]",
                active && "border-ink bg-[hsl(var(--muted))] font-medium",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  active ? "text-ink" : "text-[hsl(var(--muted-foreground))]"
                )}
                aria-hidden="true"
              />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line p-3" />
    </aside>
  );
}
