"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { logout } from "@/lib/actions/auth"
import type { Tables } from "@/lib/types/database"

interface SidebarProps {
  user: Tables<"profiles">
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dateien", label: "Dateien", icon: FolderOpen },
  { href: "/kalender", label: "Kalender", icon: Calendar },
  { href: "/wiki", label: "Wiki / FAQ", icon: BookOpen },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-acl-dark rounded-xl text-white shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[260px] bg-acl-dark z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Orange Stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-acl-orange" />

        {/* Mobile Close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-acl-orange rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm">ACL Portal</div>
            <div className="text-acl-gray text-[10px]">Partner Dashboard</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-acl-gray/60 px-3 mb-3">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-acl-orange to-acl-orange-hover text-white shadow-[0_2px_8px_rgba(240,168,68,0.3)]"
                    : "text-white/70 hover:bg-white/[0.08]"
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            )
          })}

          {user.role === "admin" && (
            <>
              <div className="text-[10px] uppercase tracking-wider text-acl-gray/60 px-3 mb-3 mt-6">
                Verwaltung
              </div>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname.startsWith("/admin")
                    ? "bg-gradient-to-r from-acl-orange to-acl-orange-hover text-white shadow-[0_2px_8px_rgba(240,168,68,0.3)]"
                    : "text-white/70 hover:bg-white/[0.08]"
                }`}
              >
                <Settings className="w-[18px] h-[18px]" />
                Admin-Bereich
              </Link>
            </>
          )}
        </nav>

        {/* Profile Section */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-acl-orange-light flex items-center justify-center flex-shrink-0">
              <span className="text-acl-dark text-xs font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.full_name}</div>
              <div className="text-xs text-acl-gray truncate">{user.company || "Partner"}</div>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="text-white/40 hover:text-white transition-colors"
                title="Abmelden"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
