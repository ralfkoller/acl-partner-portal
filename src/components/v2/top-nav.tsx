"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react"
import { logout } from "@/lib/actions/auth"
import type { User } from "@/lib/db/schema"

interface TopNavProps {
  user: User
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dateien", label: "Dateien", icon: FolderOpen },
  { href: "/kalender", label: "Kalender", icon: Calendar },
  { href: "/wiki", label: "Wiki / FAQ", icon: BookOpen },
]

export function TopNav({ user }: TopNavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <nav className="v2-nav fixed top-0 left-0 right-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/acl-logo.png" alt="ACL" width={32} height={32} />
            <span className="text-white font-bold text-sm hidden sm:block">
              ACL <span className="text-acl-orange">Portal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-acl-orange/15 text-acl-orange"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  pathname.startsWith("/admin")
                    ? "bg-acl-orange/15 text-acl-orange"
                    : "text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/[0.05] transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-acl-orange to-acl-orange-hover flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
                <span className="text-white/70 text-sm hidden lg:block">{user.fullName.split(" ")[0]}</span>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 v2-glass-glow rounded-xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-sm font-medium text-white">{user.fullName}</p>
                      <p className="text-xs text-white/40">{user.email}</p>
                    </div>
                    <Link
                      href="/profil"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
                    >
                      <UserIcon className="w-4 h-4" />
                      Profil
                    </Link>
                    <form action={logout}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-white/[0.05] transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Abmelden
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-[#111] border-l border-white/10 z-50 p-6 md:hidden">
            <div className="flex justify-between items-center mb-8">
              <span className="text-white font-bold">Navigation</span>
              <button onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-acl-orange/15 text-acl-orange"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
