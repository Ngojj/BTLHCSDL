'use client'
import BKNavbar2 from "@/components/BKNavbar2";
import Footer from "@/components/Footer";
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
            <BKNavbar2 />
            <div className="px-8 py-8 flex flex-col items-center justify-center">
                <h2 className="font-bold text-4xl mb-4">Khóa học của tôi</h2>
                <div className="w-full">
                    {TableCourse(userLogin.id)}
                </div>
            </div>
        </>
    );
};
export default Mycourse;