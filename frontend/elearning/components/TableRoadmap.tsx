"use client"
import React, { useEffect, useMemo, useState } from "react";
import * as request from "../app/axios/axios"
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import { useRouter } from "next/navigation";
import { RoadmapShowForStudentDto } from "@/app/dtos/roadmap.dto";

function TableRoadmap() {
    const [userLogin, setUserLogin] = useRecoilState(userLoginState)
    const [roadmaps, setRoadmaps] = useState<RoadmapShowForStudentDto[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()

    const fetchRoadmaps = async () => {
        try {
            const response = await request.get(`/includeCourse/student/${userLogin.id}`)
            setRoadmaps(response.data)
        } catch (error) {
            console.log(error)
            setRoadmaps([])
        }
    }

    useEffect(() => {
        const userFromSessionRaw = sessionStorage.getItem('userLogin')
        if(!userFromSessionRaw) return
        setUserLogin(JSON.parse(userFromSessionRaw))  
    }, [])

    useEffect(() => {
        if (!userLogin.id) return
        fetchRoadmaps()
    }, [userLogin])

    const filteredRoadmaps = useMemo(() => roadmaps.filter((roadmap) =>
        roadmap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.id.toString().includes(searchTerm)
    ), [roadmaps, searchTerm])

    return (
        <div className="space-y-6">
            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                            Learning Roadmaps
                        </span>
                        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                            Lộ trình học tập của bạn
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            Xem nhanh các lộ trình đã được gợi ý, theo dõi người phụ trách và mở chi tiết để xem toàn bộ tiến trình.
                        </p>
                    </div>

                    <div className="relative w-full max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                            <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input 
                            type="search" 
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" 
                            placeholder="Tìm theo tên hoặc mã lộ trình..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tổng lộ trình</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">{roadmaps.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Đang hiển thị</p>
                        <p className="mt-2 text-3xl font-semibold text-sky-700">{filteredRoadmaps.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mục đích</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Định hướng học tập rõ ràng thay vì học rời rạc theo từng môn.</p>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                            <tr>
                                <th className="px-6 py-5 text-center font-semibold">Mã lộ trình</th>
                                <th className="px-6 py-5 font-semibold">Tên lộ trình</th>
                                <th className="px-6 py-5 font-semibold">Giảng viên</th>
                                <th className="px-6 py-5 font-semibold">Mô tả</th>
                                <th className="px-6 py-5 text-center font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoadmaps.length > 0 ? (
                                filteredRoadmaps.map((roadmap, index) => (
                                    <tr key={`${roadmap.id}-${index}`} className="border-t border-slate-200 transition hover:bg-slate-50/70">
                                        <td className="px-6 py-5 text-center">
                                            <span className="inline-flex min-w-12 justify-center rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-800">
                                                {roadmap.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-semibold text-slate-900">{roadmap.name}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-medium text-slate-700">{roadmap.teacherFirstName} {roadmap.teacherLastName}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="max-w-md text-sm leading-6 text-slate-600">{roadmap.description}</p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button
                                                type="button"
                                                className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                                                onClick={() =>
                                                    router.push(`/student/roadmap/detail?roadmap=${encodeURIComponent(JSON.stringify(roadmap))}`)
                                                }
                                            >
                                                Xem lộ trình
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-14 text-center text-slate-500">
                                        {searchTerm ? "Không tìm thấy lộ trình phù hợp." : "Chưa có lộ trình nào để hiển thị."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default TableRoadmap;
