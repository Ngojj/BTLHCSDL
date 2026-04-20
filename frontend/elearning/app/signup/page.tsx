'use client';
import Image from "next/image";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserLoginDto } from "../dtos/user.dto";
import { useSetRecoilState } from "recoil";
import { userLoginState } from "@/state";

export default function Signup() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [role, setRole] = useState("Teacher");
  const [password, setPassword] = useState("");
  const setUserLogin = useSetRecoilState(userLoginState);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const getRegisterErrorMessage = (error: any) => {
    return error?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại sau.";
  };

  const saveAuthAndRedirect = (response: any, redirectPath: string) => {
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
      throw new Error("Invalid signup response");
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
    router.push(redirectPath);
  };

  const handleSignup = async () => {
    if (!email || !username || !firstName || !lastName || !bankName || !bankAccountNumber || !password) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    try {
      const path =
        role === "Student"
          ? `${API_BASE_URL}/auth/register-as-student`
          : `${API_BASE_URL}/auth/register-as-teacher`;

      const response = await axios.post(path, {
        firstName,
        lastName,
        username,
        password,
        email,
        bankName,
        bankAccount: bankAccountNumber,
      });

      if (response.status === 200) {
        alert("Đăng ký thành công.");
        saveAuthAndRedirect(response, role === "Student" ? "/" : "/teacher");
      }
    } catch (error) {
      console.log(error);
      alert(getRegisterErrorMessage(error));
    }
  };

  return (
    <main className="section-shell py-10 sm:py-14">
      <div className="grid min-h-[82vh] overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-slate-900 px-10 py-12 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_22%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-100">
                Create Account
              </span>
              <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight">
                Tạo tài khoản để bắt đầu học tập hoặc quản lý khóa học trong một hệ thống thống nhất.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
                Phù hợp cho cả sinh viên và giảng viên, với dashboard rõ ràng, lộ trình học tập và trải nghiệm quản lý trực quan hơn.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Bạn sẽ có gì</p>
                <ul className="mt-3 space-y-3 text-sm text-slate-100">
                  <li>Truy cập hệ thống học tập trực tuyến ngay sau khi đăng ký.</li>
                  <li>Quản lý tiến độ, quiz, khóa học và lộ trình từ một tài khoản duy nhất.</li>
                  <li>Trải nghiệm giao diện đồng bộ cho cả người học và người dạy.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-8 text-center">
              <Image
                className="mx-auto h-16 w-16 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                src="https://lms.hcmut.edu.vn/pluginfile.php/3/theme_academi/logo/1725955904/logoBK.png"
                width={96}
                height={96}
                alt="Bách Khoa"
              />
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
                Đăng ký tài khoản
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Điền thông tin bên dưới để bắt đầu sử dụng hệ thống.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Địa chỉ email</label>
                <input
                  type="email"
                  required
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tài khoản</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Vai trò</label>
                <select
                  required
                  value={role}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Họ</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tên</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tên ngân hàng</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Số tài khoản</label>
                <input
                  type="number"
                  required
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <button
              type="button"
              className="button-primary mt-6 w-full"
              onClick={handleSignup}
            >
              Đăng ký
            </button>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                className="font-semibold text-sky-700 transition hover:text-sky-800"
                onClick={() => router.push("/login")}
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
