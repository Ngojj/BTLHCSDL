'use client';
import { useEffect, useState } from "react";
import Header from "../teacher_components/header";
import Sidebar from "../teacher_components/sidebar";
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import * as request from '@/app/axios/axios';
import RevenueChart from "../teacher_components/chart";

interface CourseJoin {
    GPA: number | null;
    courseId: number;
    courseName: string;
    description: string;
    price: number;
    creationTime: string;
    dateStart: string;
    dateComplete: string | null;
    progress: number;
    studentId: number;
    teacherId: number;
    teacherFirstName: string;
    teacherLastName: string;
}

const RevenuePage = () => {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState)
  const [courses, setCourses] = useState<CourseJoin[]>([]);

  useEffect(() => {
    const userFromSessionRaw = sessionStorage.getItem('userLogin')
    if(!userFromSessionRaw) return
    setUserLogin(JSON.parse(userFromSessionRaw))  
  }, [])

  const fetchCourses = async () => {
      if (userLogin.token === '') return;
      try {
        const data = await request.get(`/join/teacherId/${userLogin.id}`);
        if (data.status === 200) {
          setCourses(data.data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.log("Khong the tai du lieu doanh thu", error);
        setCourses([]);
      }
    };

  useEffect(() => {
    if (!userLogin) return;
    fetchCourses();
  }, [userLogin]);

  const totalRevenue = courses.reduce((sum, course) => sum + Number(course.price || 0), 0);
  const totalEnrollments = courses.length;
  const completedEnrollments = courses.filter((course) => course.progress === 100).length;

  if (!userLogin) return <>Not Logged in</>;
  
  return (
    <main className="section-shell py-8">
      <div className="grid min-h-screen grid-cols-12 gap-6">
        <div className="col-span-12">
          {Header(userLogin.lastName + ' ' + userLogin.firstName)}
        </div>

        {Sidebar(userLogin.firstName, userLogin.lastName)}

        <section className="col-span-10 space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Revenue Overview
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              Doanh thu khóa học
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Theo dõi tổng doanh thu, số lượt đăng ký và hiệu quả khóa học trong một màn hình phân tích gọn gàng hơn.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tổng doanh thu</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{totalRevenue}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lượt đăng ký</p>
                <p className="mt-2 text-3xl font-semibold text-sky-700">{totalEnrollments}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Hoàn thành</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-600">{completedEnrollments}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm">
            <RevenueChart/>
          </div>        
        </section>
      </div>
    </main>
  );
}
export default RevenuePage;
