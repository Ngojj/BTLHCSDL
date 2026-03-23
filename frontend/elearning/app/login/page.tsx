'use client';

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserLoginDto } from "../dtos/user.dto";
import { useSetRecoilState } from "recoil";
import { userLoginState } from "@/state";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUserLogin = useSetRecoilState(userLoginState);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        username,
        password,
      });

      const serverUser = response.data.user as {
        id: number | string;
        role: string;
        firstName: string;
        lastName: string;
        email: string;
        bankName?: string;
        bankAccount?: string;
      } | undefined;

      if (!serverUser || !response.data.token) {
        throw new Error("Invalid login response");
      }

      const data: UserLoginDto = {
        id: String(serverUser.id),
        role: serverUser.role,
        firstName: serverUser.firstName,
        lastName: serverUser.lastName,
        token: response.data.token,
        email: serverUser.email,
        bankName: serverUser.bankName || "",
        bankAccount: serverUser.bankAccount || "",
      };

      setUserLogin(data);
      sessionStorage.setItem("userLogin", JSON.stringify(data));

      if (serverUser.role === "student") {
        router.push("/");
      } else {
        router.push("/teacher");
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response) {
        if (e.response.data.message === "Invalid username") {
          alert("Tên đăng nhập không chính xác. Nếu chưa có tài khoản, hãy đăng ký ngay.");
        }
        if (e.response.data.message === "Invalid password") {
          alert("Mật khẩu không chính xác. Vui lòng thử lại.");
        }
      }
    }
  };

  return (
    <main className="section-shell py-10 sm:py-14">
      <div className="grid min-h-[78vh] overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-slate-900 px-10 py-12 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_22%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-100">
                Student & Teacher Portal
              </span>
              <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight">
                Đăng nhập vào không gian học tập được thiết kế rõ ràng và hiện đại hơn.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
                Theo dõi khóa học, lộ trình, quiz và dữ liệu học tập trong một hệ thống thống nhất cho cả người học lẫn giảng viên.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Điểm nổi bật</p>
              <ul className="mt-3 space-y-3 text-sm text-slate-100">
                <li>Dashboard trực quan cho cả sinh viên và giảng viên.</li>
                <li>Quản lý khóa học, tiến độ và doanh thu trên cùng một hệ thống.</li>
                <li>Thiết kế ưu tiên trải nghiệm thực tế thay vì chỉ trình diễn.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <Image
                className="mx-auto h-16 w-16 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                src="https://lms.hcmut.edu.vn/pluginfile.php/3/theme_academi/logo/1725955904/logoBK.png"
                alt="Bách Khoa"
                width={96}
                height={96}
              />
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
                Đăng nhập tài khoản
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Truy cập nhanh vào hệ thống học tập và quản lý của bạn.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">
                  Tài khoản
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              <button type="submit" className="button-primary w-full">
                Đăng nhập
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                className="font-semibold text-sky-700 transition hover:text-sky-800"
                onClick={() => router.push("/signup")}
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
