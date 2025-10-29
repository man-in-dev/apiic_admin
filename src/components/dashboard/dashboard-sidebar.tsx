"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  Calendar,
  GraduationCap,
  MessageSquare,
  Building2,
  Megaphone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Events & Activities", href: "/dashboard/events", icon: Calendar },
  { name: "Programs & Schemes", href: "/dashboard/programs", icon: GraduationCap },
  { name: "Mentors", href: "/dashboard/mentors", icon: Users },
  { name: "Pre-Incubation Applications", href: "/dashboard/pre-incubation", icon: Building2 },
  { name: "Incubation Applications", href: "/dashboard/incubated", icon: Building2 },
  { name: "Contact Forms", href: "/dashboard/contacts", icon: MessageSquare },
  { name: "Announcements", href: "/dashboard/announcements", icon: Megaphone },
  { name: "Blogs", href: "/dashboard/blogs", icon: BookOpen },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 sidebar-container",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">APIIC Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-3 space-y-2 overflow-y-auto overflow-x-hidden sidebar-nav">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-3 min-w-0">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
