"use client";

import AvatarDropdown from "./AvatarDropdown";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userLoginState } from "@/state";
import Image from "next/image";

const BKNavbar2 = () => {
  const userLogin = useRecoilValue(userLoginState);
  const router = useRouter();

  const role = String(userLogin.role || "").toLowerCase();
  const isTeacher = role === "teacher";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="section-shell flex items-center justify-between py-4">
        <button
          type="button"
          className="flex items-center gap-3 text-left"
          onClick={() => router.push("/")}
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
            <p className="text-xs text-slate-500">Không gian học tập của bạn</p>
          </div>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <button
            className="text-sm font-medium text-slate-600 transition hover:text-sky-800"
            onClick={() => router.push("/")}
          >
            Trang chủ
          </button>

          {isTeacher ? (
            <>
              <button
                className="text-sm font-medium text-slate-600 transition hover:text-sky-800"
                onClick={() => router.push("/teacher")}
              >
                Dashboard
              </button>
              <button
                className="text-sm font-medium text-slate-600 transition hover:text-sky-800"
                onClick={() => router.push("/teacher/courses")}
              >
                Quản lý khóa học
              </button>
            </>
          ) : (
            <>
              <button
                className="text-sm font-medium text-slate-600 transition hover:text-sky-800"
                onClick={() => router.push("/student/mycourse")}
              >
                Khóa học của tôi
              </button>
              <button
                className="text-sm font-medium text-slate-600 transition hover:text-sky-800"
                onClick={() => router.push("/student/roadmap")}
              >
                Lộ trình
              </button>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-2 py-1 shadow-sm">
          <AvatarDropdown
            avatar="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
            name={`${userLogin.firstName} ${userLogin.lastName}`}
            email={userLogin.email}
          />
        </div>
      </nav>
    </header>
  );
};

export default BKNavbar2;
