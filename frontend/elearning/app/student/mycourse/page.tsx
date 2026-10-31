'use client'

import TableCourse from "@/components/TableCourse";
import { userLoginState } from "@/state";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const today = () => {
    const text = new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const Mycourse = () =>{
    const [userLogin, setUserLogin] = useRecoilState(userLoginState);

    useEffect(() => {
        const userFromSessionRaw = sessionStorage.getItem('userLogin')
        if(!userFromSessionRaw) return
        setUserLogin(JSON.parse(userFromSessionRaw))
    }, [])

    if (!userLogin) return null

    return(
        <main className="section-shell py-12 sm:py-14">
            <p className="eyebrow">{today()}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-bk-ink sm:text-5xl">
                Chào {userLogin.lastName || "bạn"}, <span className="text-bk-navy">học tiếp nhé.</span>
            </h1>

            <div className="mt-10">
                <TableCourse userLoginId={userLogin.id} />
            </div>
        </main>
    );
};

export default Mycourse;
