'use client';
import { ChangeEvent, useEffect, useState } from "react";
import Header from "../teacher_components/header"
import Sidebar from "../teacher_components/sidebar"
import { Button } from '@/components/ui/button';
import { userLoginState } from "@/state";
import { useRecoilState } from "recoil";
const CertificatePage = () => {
    const [userLogin, setUserLogin] = useRecoilState(userLoginState)
    useEffect(() => {
        const userFromSessionRaw = sessionStorage.getItem('userLogin')
        if(!userFromSessionRaw) return
        setUserLogin(JSON.parse(userFromSessionRaw))  
    }, [])
    return (
       <div className="bg-grayBG">
            <div className="grid grid-cols-12 grid-rows-12 min-h-screen gap-4">
                {Header(userLogin.lastName + ' ' + userLogin.firstName)}
                {Sidebar(userLogin.firstName, userLogin.lastName)}
                <div className="bg-white col-span-10 row-span-10 mb-4 rounded-xl">
                    <h1 className="bg-orange-600 h-20 rounded-t-xl text-center text-3xl text-white font-semibold uppercase p-2 flex items-center justify-center">MY STUDENT CERIFICATE</h1>
                </div>
            </div>
        </div>
    );
}
export default CertificatePage;