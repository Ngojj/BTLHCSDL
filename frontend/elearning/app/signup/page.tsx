'use client';
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AuthPanel from "@/components/AuthPanel";
import BrandMark from "@/components/BrandMark";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserLoginDto } from "../dtos/user.dto";
import { useSetRecoilState } from "recoil";
import { userLoginState } from "@/state";
import { GoogleLogin } from '@react-oauth/google';

export default function Signup() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [role, setRole] = useState("Student");
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

  const handleGoogleSignup = async (response: any) => {
    try {
      const googleToken = response.credential;

      const res = await axios.post(`${API_BASE_URL}/auth/google-login`, {
        token: googleToken,
        role: role
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
        throw new Error("Invalid signup response");
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
      console.error("Google signup error:", error);
      alert("Đăng ký bằng Google thất bại. Vui lòng thử lại.");
    }
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

  const fields: { label: string; type: string; onChange: (value: string) => void; full?: boolean; autoComplete?: string }[] = [
    { label: "Địa chỉ email", type: "email", onChange: setEmail, full: true, autoComplete: "email" },
    { label: "Họ", type: "text", onChange: setFirstName, autoComplete: "family-name" },
    { label: "Tên", type: "text", onChange: setLastName, autoComplete: "given-name" },
    { label: "Tên đăng nhập", type: "text", onChange: setUsername, full: true, autoComplete: "username" },
    { label: "Tên ngân hàng", type: "text", onChange: setBankName },
    { label: "Số tài khoản", type: "number", onChange: setBankAccountNumber },
  ];

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <AuthPanel
        eyebrow="Tạo tài khoản"
        title={<>Bắt đầu học <span className="text-[#8FC6F0]">bài bản</span> từ hôm nay.</>}
        points={[
          "Truy cập khóa học ngay sau khi đăng ký",
          "Một tài khoản cho khóa học, quiz và lộ trình",
          "Giảng viên quản lý khóa học và doanh thu tại một nơi",
        ]}
      />

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-block lg:hidden" aria-label="Trang chủ">
            <BrandMark />
          </Link>

          <div className="grid grid-cols-2 gap-1 rounded-lg border border-bk-line bg-bk-mist p-1" role="tablist">
            {[
              { value: "Student", label: "Sinh viên" },
              { value: "Teacher", label: "Giảng viên" },
            ].map((item) => (
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

          <p className="eyebrow mt-8">Đăng ký · {role === "Teacher" ? "Giảng viên" : "Sinh viên"}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-bk-ink">Tạo tài khoản</h1>
          <p className="mt-2 text-sm text-bk-slate">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-bk-blue hover:text-bk-navy">
              Đăng nhập
            </Link>
          </p>

          <form
            className="mt-8 grid grid-cols-2 gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            {fields.map((field) => (
              <label
                key={field.label}
                className={`block rounded-md border border-bk-line px-3.5 pb-2 pt-2.5 transition focus-within:border-bk-blue focus-within:ring-2 focus-within:ring-bk-blue/15 ${
                  field.full ? "col-span-2" : "col-span-2 sm:col-span-1"
                }`}
              >
                <span className="block text-xs text-bk-slate">{field.label}</span>
                <input
                  type={field.type}
                  required
                  autoComplete={field.autoComplete}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="mt-0.5 block w-full bg-transparent text-sm text-bk-ink outline-none"
                />
              </label>
            ))}

            <label className="col-span-2 flex items-end gap-3 rounded-md border border-bk-line px-3.5 pb-2 pt-2.5 transition focus-within:border-bk-blue focus-within:ring-2 focus-within:ring-bk-blue/15">
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-bk-slate">Mật khẩu</span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-0.5 block w-full bg-transparent text-sm text-bk-ink outline-none"
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

            <button type="submit" className="button-primary col-span-2 mt-3 w-full py-3">
              Đăng ký <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-bk-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bk-slate">Hoặc</span>
            <span className="h-px flex-1 bg-bk-line" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => alert("Đăng ký bằng Google thất bại")}
              width="400"
              text="signup_with"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
