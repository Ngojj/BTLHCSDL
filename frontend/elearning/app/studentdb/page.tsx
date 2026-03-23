"use client"
import BKNavbar2 from "@/components/BKNavbar2";
import CourseDropdown from "@/components/CourseDrop";
import Footer from "@/components/Footer";
import { CourseWithTeacherNameDto } from "../dtos/course.dto";
import { useSearchParams } from "next/navigation";
import { SectionDto } from "../dtos/section.dto";
import { Suspense, useEffect, useState } from "react";
import request from "../axios/axios";
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";

const StudentdbContent = () =>{  
  const [userLogin, setUserLogin] = useRecoilState(userLoginState);
  const [sections, setSections] = useState<SectionDto[]>([])
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course");

  const course: CourseWithTeacherNameDto | null = courseParam
    ? JSON.parse(courseParam)
    : null;

  useEffect(() => {
    const userFromSessionRaw = sessionStorage.getItem('userLogin')
    if(!userFromSessionRaw) return
    setUserLogin(JSON.parse(userFromSessionRaw))  
  }, [])

  const fetchSection = async () => {
    try {
      const response = await request.get(`/section/course/${course?.courseId}`);
      setSections(response.data.data);
    } catch (error) {
      console.log(error);
      setSections([]);
    }
  }

  useEffect(() => {
    fetchSection()
  }, [searchParams])

  if (!userLogin.id) return <>Loading...</>

  return (
    <>
      <BKNavbar2 />
      <main className="section-shell py-10 sm:py-14">
        <section className="mb-8 rounded-[34px] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Course Workspace
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            {course?.courseName}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Theo dõi đề cương, nội dung từng chương và truy cập nhanh bài giảng, quiz trong một màn hình học tập rõ ràng hơn.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tổng quan</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mô tả khóa học</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{course?.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Số chương</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{sections.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Trạng thái</p>
                  <p className="mt-2 text-lg font-semibold text-sky-700">Đang học</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Nội dung khóa học</p>
            <div className="mt-4">
              <CourseDropdown title="Giới thiệu" description={course?.description} sectionId=""/>
              {sections.map((section, index)=> (
                <CourseDropdown
                  userId={userLogin.id}
                  key={index + 1}
                  title={`Chương ${index + 1}: ${section.name}`}
                  sectionId={section.id}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}

export default function Studentdb() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <StudentdbContent />
    </Suspense>
  );
}
