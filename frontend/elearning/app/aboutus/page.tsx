"use client";

import React, { useEffect, useState } from "react";
import BKNavbar from "@/components/BKNavbar";
import BKNavbar2 from "@/components/BKNavbar2";
import Footer from "@/components/Footer";
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";

const AboutPage = () => {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (userLogin.id !== "") return;
    const userFromSessionRaw = sessionStorage.getItem("userLogin");
    if (!userFromSessionRaw) return;
    setUserLogin(JSON.parse(userFromSessionRaw));
  }, []);

  const isLoggedIn = userLogin.id !== "";

  return (
    <>
      {isMounted ? (isLoggedIn ? <BKNavbar2 /> : <BKNavbar />) : <BKNavbar />}

      <main className="overflow-hidden bg-slate-50 min-h-screen pb-20">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-sky-700">
              Về Chúng Tôi
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Nền Tảng E-Learning Hiện Đại
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Bách Khoa E-Learning là giải pháp giáo dục trực tuyến toàn diện, mang đến trải nghiệm học tập và giảng dạy tối ưu, kết nối kiến thức và người học ở mọi lúc, mọi nơi.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 transition-transform hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900">Sứ mệnh</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Cung cấp một môi trường học tập trực tuyến thông minh, trực quan và dễ sử dụng. Chúng tôi mong muốn phá bỏ rào cản về không gian và thời gian, giúp mọi cá nhân có thể tiếp cận nguồn tri thức chất lượng cao một cách dễ dàng và công bằng nhất.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 transition-transform hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900">Tầm nhìn</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Trở thành nền tảng giáo dục hàng đầu, không chỉ phục vụ sinh viên trong môi trường học thuật mà còn lan tỏa giá trị tri thức cho cộng đồng. Xây dựng một hệ sinh thái học tập gắn kết giữa người dạy, người học và nhà tuyển dụng.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-10">
              Giá Trị Cốt Lõi
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                  <svg className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="mt-6 text-lg font-semibold text-slate-900">Chất lượng</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">Đảm bảo nội dung bài giảng, chất lượng hình ảnh và giao diện tối ưu nhất cho người sử dụng.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                  <svg className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h4 className="mt-6 text-lg font-semibold text-slate-900">Đổi mới</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">Liên tục cập nhật công nghệ, cải tiến các tính năng giúp quá trình tiếp thu kiến thức hiệu quả hơn.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                  <svg className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="mt-6 text-lg font-semibold text-slate-900">Cộng đồng</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">Khuyến khích tương tác đa chiều, tạo dựng cộng đồng học viên năng động và sẵn sàng sẻ chia kiến thức.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;