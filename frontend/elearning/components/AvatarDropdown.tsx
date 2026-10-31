"use client";
import { defaultUserLogin } from "@/app/dtos/user.dto";
import { userLoginState } from "@/state";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

interface AvatarDropdownProps {
  name: string;
  email: string;
}

export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "BK";

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ name, email }) => {
  const [isOpen, setIsOpen] = useState(false);
  const setUserLogin = useSetRecoilState(userLoginState);
  const userLogin = useRecoilValue(userLoginState);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

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
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Tài khoản"
        aria-expanded={isOpen}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-bk-navy font-display text-xs font-semibold text-white transition hover:bg-bk-blue"
        onClick={() => setIsOpen(!isOpen)}
      >
        {getInitials(name)}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-60 overflow-hidden rounded-[10px] border border-bk-line bg-white shadow-[0_12px_32px_-12px_rgba(11,27,63,0.25)]">
          <div className="border-b border-bk-line px-4 py-3">
            <p className="text-sm font-semibold text-bk-ink">{name}</p>
            <p className="truncate font-mono text-[11px] text-bk-slate">{email}</p>
          </div>
          <div className="p-1.5">
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-bk-ink hover:bg-bk-mist"
              onClick={() => {
                setIsOpen(false);
                router.push(profilePath);
              }}
            >
              <UserRound className="h-4 w-4 text-bk-slate" strokeWidth={1.5} />
              Hồ sơ
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-[#C2410C] hover:bg-orange-50"
              onClick={handeLogout}
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
