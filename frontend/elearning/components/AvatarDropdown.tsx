"use client";
import { defaultUserLogin } from "@/app/dtos/user.dto";
import { userLoginState } from "@/state";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

interface AvatarDropdownProps {
  avatar: string;
  name: string;
  email: string;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ avatar, name, email }) => {
  const [isOpen, setIsOpen] = useState(false);
  const setUserLogin = useSetRecoilState(userLoginState)
  const router = useRouter()

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handeLogout = () => {
    const confirm = window.confirm("Bạn có chắc chắn muốn đăng xuất không!")
    if(!confirm) return
    sessionStorage.removeItem('userLogin')

    setUserLogin(defaultUserLogin)
    router.push('/')
  }

  return (
    <div className="relative">
      <button
        id="avatarButton"
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition-all"
        onClick={toggleDropdown}
      >
        <img
          src={avatar}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-800 text-sm font-medium">{name}</span>
      </button>

      {isOpen && (
        <div
          id="userDropdown"
          className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          <div className="px-4 py-3 text-sm text-gray-900">
            <div>{name}</div>
            <div className="font-medium truncate text-gray-500">{email}</div>
          </div>
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => router.push('/student/updatestu')}
              >
                Hồ sơ
              </a>
            </li>
          </ul>
          <div className="py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handeLogout()}
            >
              Đăng xuất
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
