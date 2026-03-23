'use client';

import { userLoginState } from '@/state';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import * as request from '@/app/axios/axios';
import { useRouter } from 'next/navigation';

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

const ManageCourses = () => {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState)
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter()

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

  const filteredCourses = useMemo(() => courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  ), [courses, searchTerm])

  const handleDeleteCourse = async (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa khóa học ${name}?`)) {
      try {
        const res = await request.del(`/course/delete/id/${id}`);
        if (res.message === 'success') {
          setCourses(courses.filter((course) => course.courseId !== id));
        } else {
          alert('Không thể xóa khóa học.');
        }
      } catch (error) {
        console.log("Khong the xoa khoa hoc", error);
        alert('Không thể xóa khóa học.');
      }
    }
  };

  if (!userLogin) return <>Loading...</>;

  return (
    <main className="section-shell py-10 sm:py-14">
      <section className="mb-8 rounded-[34px] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Course Manager
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              Quản lý khóa học
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Theo dõi toàn bộ khóa học bạn đã tạo, rà soát thông tin nhanh và thao tác quản lý trong một bảng điều khiển gọn hơn.
            </p>
          </div>

          <input
            type="search"
            className="block w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            placeholder="Tìm theo tên khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-6 py-5 font-semibold">Khóa học</th>
                <th className="px-6 py-5 font-semibold">Ngôn ngữ</th>
                <th className="px-6 py-5 font-semibold">Học phí</th>
                <th className="px-6 py-5 font-semibold">Ngày tạo</th>
                <th className="px-6 py-5 text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.courseId} className="border-t border-slate-200 transition hover:bg-slate-50/70">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-900">{course.courseName}</p>
                      <p className="mt-1 max-w-md text-xs leading-6 text-slate-500">{course.description}</p>
                    </td>
                    <td className="px-6 py-5">{course.language}</td>
                    <td className="px-6 py-5 font-medium text-slate-800">{course.price}</td>
                    <td className="px-6 py-5">{course.creationTime}</td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={async () => await handleDeleteCourse(course.courseId, course.courseName)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-slate-500">
                    {searchTerm ? "Không tìm thấy khóa học phù hợp." : "Chưa có khóa học nào."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6">
        <button className='button-secondary' onClick={() => router.push('/teacher')}>
          Quay lại dashboard
        </button>
      </div>
    </main>
  );
};

export default ManageCourses;
