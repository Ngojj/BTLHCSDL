'use client'

import TableCourse from "@/components/TableCourse";
import { userLoginState } from "@/state";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const Mycourse = () =>{
    const [userLogin, setUserLogin] = useRecoilState(userLoginState);

    useEffect(() => {
        const userFromSessionRaw = sessionStorage.getItem('userLogin')
        if(!userFromSessionRaw) return
        setUserLogin(JSON.parse(userFromSessionRaw))  
    }, [])

    if (!userLogin) return <>Loading...</>

    return(
        <>
            <main className="section-shell py-10 sm:py-14">
                <section className="mb-8 rounded-[34px] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
                    <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                        Học tập cá nhân
                    </span>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                        Khóa học của tôi
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                        Theo dõi toàn bộ khóa học đã đăng ký, cập nhật tiến độ và truy cập nhanh vào bài giảng từ một dashboard trực quan hơn.
                    </p>
                </section>

                <TableCourse userLoginId={userLogin.id} />
            </main>
        </>
    );
};

export default Mycourse;
