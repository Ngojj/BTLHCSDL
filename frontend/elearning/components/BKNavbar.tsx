"use client";

import Link from "next/link";
import BrandMark from "./BrandMark";

const links = [
  { label: "Khóa học", href: "/#khoa-hoc" },
  { label: "Lộ trình", href: "/#lo-trinh" },
  { label: "Quiz", href: "/#cach-hoc" },
  { label: "Về chúng tôi", href: "/aboutus" },
];

function BKNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-bk-line bg-white">
      <nav className="section-shell flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Trang chủ">
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-bk-slate transition-colors hover:text-bk-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/signup" className="hidden px-3 py-2 text-sm font-medium text-bk-ink hover:text-bk-navy sm:inline-flex">
            Đăng ký
          </Link>
          <Link href="/login" className="button-primary px-4 py-2">
            Đăng nhập
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default BKNavbar;
