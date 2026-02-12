"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import * as tokenManager from "@/lib/auth/tokenManager";
import { ROUTES } from "@/lib/navigation/routes";
import { 
  Bell, 
  Search, 
  Menu, 
  LogOut, 
  User, 
  HelpCircle
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu";
import { ProfileSettingsModal } from "./ProfileSettingsModal";

type AdminHeaderProps = {
  onMenuClick?: () => void;
};

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user } = useAuth();
  const [notifications] = useState(3); 
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    tokenManager.clearAuth();
    window.location.href = ROUTES.LOGIN;
  };

  return (
    <>
      <header className="sticky top-0 z-20 w-full border-b border-[color:var(--surface-muted)] bg-[color:var(--card)]/95 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-4">
          
          {/* Left Side: Mobile Menu & Search */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="rounded-lg p-2 text-[color:var(--muted-text)] hover:bg-[color:var(--surface-muted)] md:hidden transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Search Bar - Hidden on very small screens or adaptable */}
            <div className="hidden md:flex relative max-w-md w-full">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-text)]" />
              <input
                type="text"
                placeholder="جستجو در پنل ادمین..."
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] py-2 pr-10 pl-4 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Right Side - Actions & User */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Notifications */}
            <button className="relative rounded-full p-2 text-[color:var(--muted-text)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--brand)] transition-all">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[color:var(--card)]">
                  {notifications}
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 md:gap-3 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--surface)] pl-2 md:pl-4 pr-1 py-1 hover:bg-[color:var(--surface-muted)] transition-all outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-offset-2">
                  <div className="relative h-8 w-8 shrink-0">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={`${user?.f_name} ${user?.l_name}`}
                        className="h-full w-full rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--brand)] to-purple-600 text-xs font-bold text-white border-2 border-white shadow-sm">
                        {user?.f_name?.[0]}{user?.l_name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:flex flex-col items-start gap-0.5 text-right mr-2">
                    <span className="text-sm font-semibold text-[color:var(--foreground)] truncate max-w-[100px]">
                      {user?.f_name} {user?.l_name}
                    </span>
                    <span className="text-[10px] text-[color:var(--muted-text)] font-medium">
                      {user?.role?.display_name || "مدیر سیستم"}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onSelect={() => setShowProfileModal(true)}
                  >
                    <User className="ml-2 h-4 w-4" />
                    <span>پروفایل کاربری</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="ml-2 h-4 w-4" />
                    <span>راهنما و پشتیبانی</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onSelect={handleLogout}
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>خروج از حساب</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <ProfileSettingsModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
}
