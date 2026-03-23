"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

function BKNavbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="section-shell flex items-center justify-between py-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-3 text-left"
        >
          <Image
            src="https://lms.hcmut.edu.vn/pluginfile.php/3/theme_academi/logo/1725955904/logoBK.png"
            alt="Bách Khoa"
            width={46}
            height={46}
            className="h-11 w-11 object-contain"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900">Bách Khoa E-Learning</p>
            <p className="text-xs text-slate-500">Nền tảng học tập trực tuyến</p>
          </div>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            className="text-sm font-medium text-slate-600 transition hover:text-sky-800"
            onClick={() => router.push("/")}
          >
            Trang chủ
          </button>
          <button
            type="button"
            className="text-sm font-medium text-slate-600 transition hover:text-sky-800"
            onClick={() => router.push("/aboutus")}
          >
            Giới thiệu
          </button>
          <button
            type="button"
            className="text-sm font-medium text-slate-600 transition hover:text-sky-800"
            onClick={() => router.push("/signup")}
          >
            Khóa học
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="button-secondary"
            onClick={() => router.push("/login")}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className="button-primary"
            onClick={() => router.push("/signup")}
          >
            Đăng ký
          </button>
        </div>
      </nav>
    </header>
  );
}

export default BKNavbar;
