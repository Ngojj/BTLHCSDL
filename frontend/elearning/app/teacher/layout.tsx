"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRecoilState } from "recoil";
import { Menu, Plus } from "lucide-react";
import { userLoginState } from "@/state";
import Sidebar from "./teacher_components/sidebar";

const crumbs: Record<string, string> = {
  courses: "Quản lý khóa học",
  create: "Tạo khóa học",
  revenue: "Doanh thu",
  roadmap: "Lộ trình",
  certificate: "Chứng chỉ",
  edit_course: "Sửa khóa học",
  edit_section: "Sửa section",
  edit_quiz: "Sửa quiz",
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (userLogin.id !== "") return;
    const userFromSessionRaw = sessionStorage.getItem("userLogin");
    if (userFromSessionRaw) setUserLogin(JSON.parse(userFromSessionRaw));
  }, []);

  const segment = pathname?.split("/")[2];
  const crumb = segment ? crumbs[segment] || segment : "Dashboard";

  return (
    <div className="min-h-screen bg-bk-mist/60 lg:pl-64">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar firstName={userLogin.firstName} lastName={userLogin.lastName} />
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-bk-ink/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <Sidebar
              firstName={userLogin.firstName}
              lastName={userLogin.lastName}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-bk-line bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Mở menu"
              className="rounded-md border border-bk-line p-2 text-bk-ink lg:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bk-slate">
              Giảng viên / <span className="text-bk-ink">{crumb}</span>
            </p>
          </div>
          <Link href="/teacher/create" className="button-primary px-4 py-2">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Tạo khóa học</span>
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}
