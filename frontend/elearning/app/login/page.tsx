'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AuthPanel from "@/components/AuthPanel";
import BrandMark from "@/components/BrandMark";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserLoginDto } from "../dtos/user.dto";
import { useSetRecoilState } from "recoil";
import { userLoginState } from "@/state";
import { GoogleLogin } from '@react-oauth/google';

const roles = [
  { value: "student", label: "Sinh viên" },
  { value: "teacher", label: "Giảng viên" },
];

export default function Login() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const setUserLogin = useSetRecoilState(userLoginState);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginSuccess = async (response: any) => {
    try {
      const googleToken = response.credential;

      const res = await axios.post(`${API_BASE_URL}/auth/google-login`, {
        token: googleToken,
        role
      });

      const serverUser = res.data.user as {
        id: number | string;
        role: string;
        firstName: string;
        lastName: string;
        email: string;
        bankName?: string;
        bankAccount?: string;
      } | undefined;

      if (!serverUser || !res.data.token) {
        throw new Error("Invalid login response");
      }

      const data: UserLoginDto = {
        id: String(serverUser.id),
        role: serverUser.role,
        firstName: serverUser.firstName,
        lastName: serverUser.lastName,
        token: res.data.token,
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
    } catch (error) {
      console.error("Google login error:", error);
      alert("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
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
    <main className="grid min-h-screen lg:grid-cols-2">
      <AuthPanel
        eyebrow="Chào mừng trở lại"
        title={<>Tiếp tục bài học <span className="text-[#8FC6F0]">còn dang dở.</span></>}
        points={[
          "Theo dõi tiến độ từng khóa và từng section",
          "Bảng điểm quiz cập nhật ngay sau khi nộp",
          "Nhận chứng chỉ khi hoàn thành lộ trình",
        ]}
      />

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-block lg:hidden" aria-label="Trang chủ">
            <BrandMark />
          </Link>

          <div className="grid grid-cols-2 gap-1 rounded-lg border border-bk-line bg-bk-mist p-1" role="tablist">
            {roles.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={role === item.value}
                onClick={() => setRole(item.value)}
                className={`rounded-md py-2 text-sm transition-colors ${
                  role === item.value
                    ? "border border-bk-line bg-white font-semibold text-bk-navy"
                    : "border border-transparent text-bk-slate hover:text-bk-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className="eyebrow mt-8">Đăng nhập · {roles.find((r) => r.value === role)?.label}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-bk-ink">Vào tài khoản</h1>
          <p className="mt-2 text-sm text-bk-slate">
            Chưa có tài khoản?{" "}
            <Link href="/signup" className="font-semibold text-bk-blue hover:text-bk-navy">
              Đăng ký
            </Link>
          </p>

          <form className="mt-8 space-y-3" onSubmit={handleLogin}>
            <label className="block rounded-md border border-bk-line px-3.5 pb-2 pt-2.5 transition focus-within:border-bk-blue focus-within:ring-2 focus-within:ring-bk-blue/15">
              <span className="block text-xs text-bk-slate">Tên đăng nhập</span>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                onChange={(e) => setUsername(e.target.value)}
                className="mt-0.5 block w-full bg-transparent text-sm text-bk-ink outline-none placeholder:text-bk-slate/60"
                placeholder="Nhập tên đăng nhập"
              />
            </label>

            <label className="flex items-end gap-3 rounded-md border border-bk-line px-3.5 pb-2 pt-2.5 transition focus-within:border-bk-blue focus-within:ring-2 focus-within:ring-bk-blue/15">
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-bk-slate">Mật khẩu</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-0.5 block w-full bg-transparent text-sm text-bk-ink outline-none placeholder:text-bk-slate/60"
                  placeholder="Nhập mật khẩu"
                />
              </span>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="pb-0.5 text-xs text-bk-slate hover:text-bk-navy"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </label>

            <button type="submit" className="button-primary !mt-6 w-full py-3">
              Đăng nhập <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-bk-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bk-slate">Hoặc</span>
            <span className="h-px flex-1 bg-bk-line" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => alert("Đăng nhập bằng Google thất bại")}
              width="400"
              text="continue_with"
            />
          </div>

          <p className="mt-8 text-xs leading-5 text-bk-slate">
            Đăng nhập bằng Google sẽ tạo tài khoản {role === "teacher" ? "giảng viên" : "sinh viên"} nếu email chưa
            được đăng ký.
          </p>
        </div>
      </section>
    </main>
  );
}
