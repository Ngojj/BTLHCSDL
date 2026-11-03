"use client";

import AvatarDropdown from "./AvatarDropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userLoginState } from "@/state";
import BrandMark from "./BrandMark";

const studentLinks = [
  { label: "Khóa học của tôi", href: "/student/mycourse" },
  { label: "Bảng điểm", href: "/student/tablescore" },
  { label: "Lộ trình", href: "/student/roadmap" },
  { label: "Chứng chỉ", href: "/student/certificates" },
];

const teacherLinks = [
  { label: "Dashboard", href: "/teacher" },
  { label: "Quản lý khóa học", href: "/teacher/courses" },
];

const BKNavbar2 = () => {
  const userLogin = useRecoilValue(userLoginState);
  const pathname = usePathname();

  const isTeacher = String(userLogin.role || "").toLowerCase() === "teacher";
  const links = isTeacher ? teacherLinks : studentLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-bk-line bg-white">
      <nav className="section-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Trang chủ">
          <BrandMark subtitle="" />
        </Link>

        <div className="hidden items-center gap-1 rounded-lg border border-bk-line bg-bk-mist p-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "border border-bk-line bg-white font-semibold text-bk-navy"
                    : "border border-transparent text-bk-slate hover:text-bk-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <AvatarDropdown
          name={`${userLogin.firstName} ${userLogin.lastName}`.trim()}
          email={userLogin.email}
        />
      </nav>
    </header>
  );
};

export default BKNavbar2;
