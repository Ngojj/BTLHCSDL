"use client"
import React from "react";
import AvatarDropdown from "./AvatarDropdown";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userLoginState } from "@/state";

const BKNavbar2 = () => {
  const userLogin = useRecoilValue(userLoginState)
  const router = useRouter()

  return (
    <nav className="bg-white shadow-md flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-8">
        <div>
          <img
            src="https://lms.hcmut.edu.vn/pluginfile.php/3/theme_academi/logo/1725955904/logoBK.png"
            alt="Logo"
            className="w-12 h-12"
          />
        </div>

        <div className="flex gap-8">
          <button
            className="text-gray-800 text-sm font-medium hover:text-blue-600 hover:scale-110 active:scale-90 transition-colors"
            onClick={() => router.push('/')}
          >
            Trang chủ
          </button>
          <button
            className="text-gray-800 text-sm font-medium hover:text-blue-600 hover:scale-110 active:scale-90 transition-colors"
            onClick={() => router.push('/student/mycourse')}
          >
            Khóa học của tôi
          </button>
          <button
            className="text-gray-800 text-sm font-medium hover:text-blue-600 hover:scale-110 active:scale-90 transition-colors"
            onClick={() => router.push('/student/roadmap')}
          >
            Lộ trình khóa học
          </button>
        </div>
      </div>

      <div className="relative">
        <AvatarDropdown
          avatar="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
          name={userLogin.firstName + ' ' + userLogin.lastName}
          email={userLogin.email}
        />
      </div>
    </nav>
  );
};

export default BKNavbar2;
