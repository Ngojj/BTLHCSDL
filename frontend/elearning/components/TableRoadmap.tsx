"use client"
import React, { useEffect, useState } from "react";
import * as request from "../app/axios/axios"
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import { useRouter } from "next/navigation";
import { RoadmapShowForStudentDto } from "@/app/dtos/roadmap.dto";
function TableRoadmap() {
    const [userLogin, setUserLogin] = useRecoilState(userLoginState)
    const [roadmaps, setRoadmaps] = useState<RoadmapShowForStudentDto[]>([])
    const router = useRouter()

    const fetchRoadmaps = async () => {
        try {
            const response = await request.get(`/includeCourse/student/${userLogin.id}`)
            setRoadmaps(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const userFromSessionRaw = sessionStorage.getItem('userLogin')
        if(!userFromSessionRaw) return
        setUserLogin(JSON.parse(userFromSessionRaw))  
        
    }, [])

    useEffect(() => {
        fetchRoadmaps()
    }, [userLogin])

    return (
        <div className="relative overflow-x-auto">
            <div className="p-4">
            <form className="max-w-md mx-auto">   
                <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Tìm kiếm</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input 
                    type="search" 
                    id="default-search" 
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Nhập tên lộ trình hoặc mã lộ trình..." 
                    required />
                </div>
            </form>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-center">
                            Mã lộ trình
                        </th>
                        <th scope="col" className="px-6 py-3 text-center ">
                            Tên lộ trình
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Giảng viên
                        </th>
                        <th scope="col" className="px-6 py-3 w-[300px] text-center ">
                            Mô tả
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Tùy chọn 
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        roadmaps.map((roadmap, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {roadmap.id}
                                </th>
                                <td className="px-6 py-4 text-center">
                                    {roadmap.name}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {roadmap.teacherFirstName + " " + roadmap.teacherLastName}
                                </td>
                                <td className="px-6 py-4 w-[300px] text-center">
                                    {roadmap.description}
                                </td>

                                <td>

                                <button
                                    type="button"
                                    className="text-blue-500 px-6 py-4 text-center"
                                    onClick={() =>
                                        router.push(`/student/roadmap/detail?roadmap=${encodeURIComponent(JSON.stringify(roadmap))}`)
                                    }
                                    >
                                    Xem lộ trình
                                </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};
export default TableRoadmap;