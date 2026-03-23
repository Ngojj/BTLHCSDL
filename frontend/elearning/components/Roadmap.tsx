"use client"
import request from "@/app/axios/axios";
import { CourseWithTeacherNameDto } from "@/app/dtos/course.dto";
import { RoadmapShowForStudentDto } from "@/app/dtos/roadmap.dto";
import { userLoginState } from "@/state";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Roadmap = ({ roadmap }: { roadmap: RoadmapShowForStudentDto | null }) => {
    const [courses, setCourses] = useState<CourseWithTeacherNameDto[]>([])
    const [joins, setJoins] = useState<{ [key: string]: number}>({})
    const [userLogin, setUserLogin] = useRecoilState(userLoginState)

    const fetchCourse = async () => {
        try {
            const response = await request.get(`/includeCourse/rmId/${roadmap?.id}`)
            setCourses(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchJoin = async () => {
        try {
            const response = await request.get(`/join/studentId/${userLogin.id}`)
            const tmp: { [key: string]: number } = {};

            for(const join of response.data.data) {
                tmp[join.courseId] = join.progress;
            }

            setJoins(tmp)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const userFromSessionRaw = sessionStorage.getItem('userLogin')
        if(!userFromSessionRaw) return
        setUserLogin(JSON.parse(userFromSessionRaw))  
        fetchCourse()
    }, [])

    useEffect(() => {
        if (!userLogin.id) return
        fetchJoin()
    }, [userLogin])

    const getStatus = (courseId: string) => {
        const progress = joins[courseId]

        if (progress === undefined) {
            return {
                dot: "bg-rose-500",
                label: "Chưa đăng ký"
            }
        }

        if (progress === 100) {
            return {
                dot: "bg-emerald-500",
                label: "Đã hoàn thành"
            }
        }

        return {
            dot: "bg-amber-500",
            label: `Đang học ${progress}%`
        }
    }

  return (
    <div className="section-shell py-10 sm:py-14">
      <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                window.history.back();
              }}
            >
              Quay lại
            </button>

            <span className="mt-6 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              Roadmap Detail
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              {roadmap?.name}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              <span className="font-semibold text-slate-800">Giảng viên phụ trách:</span>{" "}
              {roadmap?.teacherFirstName} {roadmap?.teacherLastName}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {roadmap?.description}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:min-w-[280px]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Chú thích</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
                <span>Đã học xong</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full bg-amber-500" />
                <span>Đã đăng ký nhưng chưa hoàn thành</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full bg-rose-500" />
                <span>Chưa đăng ký</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {courses.map((course, index) => {
            const status = getStatus(course.courseId)

            return (
              <div key={index} className="grid gap-4 lg:grid-cols-[72px_1fr]">
                <div className="hidden items-start justify-center lg:flex">
                  <div className="flex h-full flex-col items-center">
                    <div className={`h-5 w-5 rounded-full border-4 border-white shadow ${status.dot}`} />
                    {index < courses.length - 1 && <div className="mt-2 h-full w-1 rounded-full bg-slate-200" />}
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Bước {index + 1}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900">{course.courseName}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Giảng viên: {course.teacherFirstName} {course.teacherLastName}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Ngày tạo: {course.creationTime ? new Date(course.creationTime).toLocaleDateString('vi-VN') : ""}
                      </p>
                    </div>

                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      status.dot === "bg-emerald-500"
                        ? "bg-emerald-50 text-emerald-700"
                        : status.dot === "bg-amber-500"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700"
                    }`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
