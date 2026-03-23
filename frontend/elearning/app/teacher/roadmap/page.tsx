'use client';
import { useEffect, useState } from "react";
import Header from "../teacher_components/header";
import Sidebar from "../teacher_components/sidebar";
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import * as request from '@/app/axios/axios';

interface Course {
  courseId: number;
  courseName: string;
  language: string;
  description: string;
  price: string;
  averageQuizScore: string;
  topics: string[];
  creationTime: string;
}

const RoadMapPage = () => {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState)
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [roadmapName, setRoadmapName] = useState('');
  const [roadmapDescription, setRoadmapDescription] = useState('');
  const [learningTip, setLearningTip] = useState('');

  const handleCheckboxChange = (course: Course, isChecked: boolean) => {
    setSelectedCourses((prev) => {
      if (isChecked) {
        return [...prev, course];
      }

      return prev.filter((c) => c.courseId !== course.courseId);
    });
  };

  const fetchCourses = async () => {
    if (userLogin.token === '') return;
    try {
      const data = await request.get(`/course/teacherId/${userLogin.id}`);
      if (data.status === 200) {
        setCourses(data.data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.log("Khong the tai danh sach khoa hoc", error);
      setCourses([]);
    }
  }

  useEffect(() => {
    const userFromSessionRaw = sessionStorage.getItem('userLogin')
    if(!userFromSessionRaw) return
    setUserLogin(JSON.parse(userFromSessionRaw))  
  }, [])

  useEffect(() => {
    if (!userLogin) return
    fetchCourses();
  }, [userLogin]);

  const handleSubmit = async () =>{
    const formData = {
      name: roadmapName,
      description: roadmapDescription,
      instruction: learningTip,
      teacherId: userLogin.id,
      includeCourse: selectedCourses.map(course => ({
        courseId: course.courseId
      }))
    }

    try {
      const roadmap = await request.post('/roadMap/create', formData);
      if (roadmap.status === 200) {
        alert('Tạo lộ trình thành công.');
      } else {
        console.log(roadmap.message);
      }
    } catch (error) {
      console.log("Khong the tao lo trinh", error);
      alert("Không thể tạo lộ trình lúc này.");
    }
  }

  return (
    <main className="section-shell py-8">
      <div className="grid min-h-screen grid-cols-12 gap-6">
        <div className="col-span-12">
          {Header(userLogin.lastName + ' ' + userLogin.firstName)}
        </div>

        {Sidebar(userLogin.firstName, userLogin.lastName)}

        <section className="col-span-10 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Teacher Planner
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              Tạo lộ trình giảng dạy
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Xây dựng một lộ trình có cấu trúc từ các khóa học hiện có để học viên theo dõi tiến độ và định hướng học tập rõ ràng hơn.
            </p>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tên lộ trình</label>
                <input
                  type="text"
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  onChange={(e) => setRoadmapName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Mô tả lộ trình</label>
                <textarea
                  className="block min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  onChange={(e) => setRoadmapDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Hướng dẫn học tập</label>
                <textarea
                  className="block min-h-[160px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  onChange={(e) => setLearningTip(e.target.value)}
                />
              </div>

              <button className="button-primary w-full" onClick={handleSubmit}>
                Tạo lộ trình
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Khóa học hiện có</p>
                <div className="mt-4 space-y-3">
                  {courses.map((course) => (
                    <label
                      key={course.courseId}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-sky-200"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-700"
                        onChange={(e) => handleCheckboxChange(course, e.target.checked)}
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{course.courseName}</p>
                        <p className="mt-1 text-sm text-slate-500">{course.language}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Đã chọn</p>
                <div className="mt-4 space-y-3">
                  {selectedCourses.length > 0 ? selectedCourses.map((course, index) => (
                    <div key={course.courseId} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Bước {index + 1}</p>
                      <p className="mt-2 font-semibold text-slate-900">{course.courseName}</p>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                      Chọn khóa học ở cột bên trái để bắt đầu tạo lộ trình.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RoadMapPage;
