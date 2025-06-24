"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileText, Package, Layers, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/", icon: Users, label: "Users" },
  { href: "/templates", icon: FileText, label: "Templates" },
  { href: "/products", icon: Package, label: "Products" },
  { href: "/bulk-ops", icon: Layers, label: "Bulk Ops" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen flex flex-col bg-black/20 backdrop-blur-lg border-r border-white/10 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex-1 p-4 space-y-6">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h1 className="text-2xl font-bold text-white">Zephr</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-purple-500/20 hover:text-white",
                pathname === item.href ? "bg-purple-600/30 text-white" : "",
                isCollapsed ? "justify-center" : "",
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-white/10"></div>
    </aside>
  )
}
