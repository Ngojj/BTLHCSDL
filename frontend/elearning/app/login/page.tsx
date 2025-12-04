'use client';
import Image from "next/image";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserLoginDto } from "../dtos/user.dto";
import { useSetRecoilState } from "recoil";
import { userLoginState } from "@/state";
import jwt from "jsonwebtoken";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUserLogin = useSetRecoilState(userLoginState)
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        username,
        password,
      });

      console.log(response.data);
      const decoded = jwt.decode(response.data.token) as jwt.JwtPayload | null;

      if (!decoded) {
        throw new Error("Invalid token");
      }

      const data: UserLoginDto = {
        id: decoded.id as string, 
        role: decoded.role as string,
        firstName: decoded.firstName as string,
        lastName: decoded.lastName as string,
        token: response.data.token,
        email: decoded.email as string,
        bankName: decoded.bankName as string,
        bankAccount: decoded.bankAccount as string,
      };
      // console.log(data);
      setUserLogin(data);

      sessionStorage.setItem('userLogin', JSON.stringify(data));

      if(decoded.role === "student") 
      router.push('/');
      else router.push('/teacher');
    } 
    
    catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response) {
        if(e.response.data.message === "Invalid username"){
          alert("Tên đăng nhập không chính xác! vui lòng kiểm tra lại! Nếu bạn chưa có tài khoản, hãy đăng ký ngay!")
        }
        if(e.response.data.message === "Invalid password"){
          alert("Mật khẩu không chính xác! Vui lòng đăng nhập lại")
        }
      }
    }
  };

  const navigateToSignUp = () => {
    router.push('signup');
  };

  return (
    <div className="bg-white">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-20 w-auto rounded-xl"
            src="https://lms.hcmut.edu.vn/pluginfile.php/3/theme_academi/logo/1725955904/logoBK.png"
            alt="Your Company"
            width={100} height={100}
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Đăng nhập vào tài khoản của bạn
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}> {/* Handle form submission here */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Tài khoản
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Mật khẩu
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0112 6c2.945 0 5.678.994 7.796 2.646M12 18c-2.945 0-5.678-.994-7.796-2.646M3.98 15.777A10.477 10.477 0 0112 18c2.945 0 5.678-.994-7.796-2.646M15.454 12A3.454 3.454 0 1112 8.546 3.454 3.454 0 0115.454 12z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.93 4.93l14.14 14.14"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18c-2.945 0-5.678-.994-7.796-2.646M3.98 15.777A10.477 10.477 0 0112 18c2.945 0 5.678-.994-7.796-2.646M3.98 8.223A10.477 10.477 0 0112 6c2.945 0 5.678.994 7.796 2.646M15.454 12A3.454 3.454 0 1112 8.546 3.454 3.454 0 0115.454 12z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit" // This will now correctly trigger form submission
                className="flex w-full justify-center rounded-md bg-hcmutDarkBlue px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-hcmutLightBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Đăng nhập
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Không phải thành viên?{" "}
            <a
              href="#"
              className="font-semibold text-hcmutDarkBlue hover:text-hcmutLightBlue"
              onClick={navigateToSignUp}
            >
              Đăng ký tài khoản
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

