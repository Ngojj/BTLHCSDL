"use client";
import { defaultUserLogin } from "@/app/dtos/user.dto";
import { userLoginState } from "@/state";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

interface AvatarDropdownProps {
  avatar: string;
  name: string;
  email: string;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ avatar, name, email }) => {
  const [isOpen, setIsOpen] = useState(false);
  const setUserLogin = useSetRecoilState(userLoginState);
  const userLogin = useRecoilValue(userLoginState);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handeLogout = () => {
    const confirm = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (!confirm) return;
    sessionStorage.removeItem("userLogin");
    setUserLogin(defaultUserLogin);
    router.push("/");
  };

  const profilePath = String(userLogin.role || "").toLowerCase() === "teacher"
    ? "/teacher"
    : "/student/updatestu";

  return (
    <div className="relative">
      <button
        id="avatarButton"
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 shadow transition-all hover:bg-gray-200"
        onClick={toggleDropdown}
      >
        <img
          src={avatar}
          alt="User Avatar"
          className="h-8 w-8 rounded-full"
        />
        <span className="text-sm font-medium text-gray-800">{name}</span>
      </button>

      {isOpen && (
        <div
          id="userDropdown"
          className="absolute right-0 z-10 mt-2 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow"
        >
          <div className="px-4 py-3 text-sm text-gray-900">
            <div>{name}</div>
            <div className="truncate font-medium text-gray-500">{email}</div>
          </div>
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => router.push(profilePath)}
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
