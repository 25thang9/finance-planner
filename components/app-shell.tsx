
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, type ReactNode } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  PiggyBank,
  WalletCards,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const links = [
  {
    href: "/dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
  },
  {
    href: "/transactions",
    label: "Giao dịch",
    icon: ArrowLeftRight,
  },
  {
    href: "/wishlist",
    label: "Mục tiêu tiết kiệm",
    icon: Target,
  },
  {
    href: "/budgets",
    label: "Ngân sách",
    icon: PiggyBank,
  },
];

type AppShellProps = {
  name: string;
  email: string;
  children: ReactNode;
};

export function AppShell({
  name,
  email,
  children,
}: AppShellProps) {
  const path = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();

  async function logout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  const nav = (
    <>
      {/* Logo và tên ứng dụng */}
      <div className="px-6 pb-8 pt-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d5f0ed] text-[#175c68]">
            <WalletCards size={24} />
          </span>

          <span>
            <strong className="block text-lg tracking-tight">
              Finance Planner
            </strong>
            <small className="text-xs text-[var(--muted-foreground)]">
              YOUR MONEY, CLEARER
            </small>
          </span>
        </Link>
      </div>

      {/* Điều hướng */}
      <p className="muted-label px-6 pb-3">
        KHÔNG GIAN CỦA BẠN
      </p>

      <nav
        className="space-y-1 px-3"
        aria-label="Điều hướng chính"
      >
        {links.map((link) => {
          const Icon = link.icon;
          const active = path.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                active
                  ? "bg-[#e0efef] text-[#1f6574] dark:bg-[#254859] dark:text-[#b1eded]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon size={19} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Thông tin bảo mật và người dùng */}
      <div className="mt-auto px-4 pb-6">
        <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
          <ShieldCheck
            size={19}
            className="mb-2 text-[#529e99]"
          />

          <p className="text-xs font-semibold">
            Dữ liệu của bạn được bảo vệ
          </p>

          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Mỗi tài khoản chỉ xem và quản lý giao dịch riêng.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-[var(--border)] pt-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dce6f4] font-bold text-[#36587b]">
            {name.trim().charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">
              {name}
            </div>

            <div className="truncate text-xs text-[var(--muted-foreground)]">
              {email}
            </div>
          </div>

          <button
            type="button"
            aria-label="Đăng xuất"
            title="Đăng xuất"
            onClick={logout}
            className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="app-grid">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-[var(--border)] bg-[var(--card)] md:flex">
        {nav}
      </aside>

      {/* Sidebar mobile */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex bg-[#07172db3] md:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            className="flex h-full w-[285px] flex-col bg-[var(--card)]"
            onClick={(event) => event.stopPropagation()}
          >
            {nav}
          </aside>
        </div>
      )}

      {/* Khu vực nội dung chính */}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-17 items-center justify-between border-b border-[var(--border)] bg-[var(--card)]/95 px-5 backdrop-blur sm:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Mở menu"
              className="rounded-lg border border-[var(--border)] p-2 md:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            <span className="text-sm font-medium text-[var(--muted-foreground)]">
              Quản lý tài chính cá nhân
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-[var(--muted-foreground)] sm:inline">
              Xin chào, {name.split(" ").at(-1)}
            </span>

            {/* 
              FIX HYDRATION:
              Render cả hai icon giống nhau trên server/client.
              CSS quyết định icon nào hiển thị theo theme.
            */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="Đổi giao diện sáng/tối"
              aria-label="Đổi giao diện sáng/tối"
              onClick={toggleTheme}
            >
              <Sun
                size={18}
                className="hidden dark:block"
              />
              <Moon
                size={18}
                className="block dark:hidden"
              />
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-[1320px] px-5 py-7 sm:px-10 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
