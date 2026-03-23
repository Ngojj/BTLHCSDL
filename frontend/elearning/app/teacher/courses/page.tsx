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
  price: number | string;
  averageQuizScore: string;
  topics: string[];
  creationTime: string;
}

const ManageCourses = () => {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('vi-VN');
  };

  const formatPrice = (value: number | string) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return `${value} VND`;
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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
      console.log('Cannot load courses', error);
      setCourses([]);
    }
  };

  useEffect(() => {
    const userFromSessionRaw = sessionStorage.getItem('userLogin');
    if (!userFromSessionRaw) return;
    setUserLogin(JSON.parse(userFromSessionRaw));
  }, [setUserLogin]);

  useEffect(() => {
    if (!userLogin) return;
    fetchCourses();
  }, [userLogin]);

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [courses, searchTerm]
  );

  const totalCourses = courses.length;
  const totalRevenue = courses.reduce((sum, course) => sum + (Number(course.price) || 0), 0);
  const avgPrice = totalCourses > 0 ? Math.round(totalRevenue / totalCourses) : 0;

  const handleDeleteCourse = async (id: number, name: string) => {
    if (window.confirm(`Ban co chac muon xoa khoa hoc ${name}?`)) {
      try {
        const res = await request.del(`/course/delete/id/${id}`);
        if (res.message === 'success') {
          setCourses(courses.filter((course) => course.courseId !== id));
        } else {
          alert('Khong the xoa khoa hoc.');
        }
      } catch (error) {
        console.log('Cannot delete course', error);
        alert('Khong the xoa khoa hoc.');
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
              Quan ly khoa hoc
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Theo doi khoa hoc, cap nhat va xoa nhanh trong mot bo cuc dong bo voi dashboard.
            </p>
          </div>

          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="search"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              placeholder="Tim theo ten khoa hoc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="button-primary whitespace-nowrap"
              onClick={() => router.push('/teacher/create')}
            >
              Tao khoa hoc
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tong khoa hoc</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalCourses}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tong hoc phi</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPrice(totalRevenue)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Hoc phi trung binh</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPrice(avgPrice)}</p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-6 py-5 font-semibold">Khoa hoc</th>
                <th className="px-6 py-5 font-semibold">Ngon ngu</th>
                <th className="px-6 py-5 font-semibold">Hoc phi</th>
                <th className="px-6 py-5 font-semibold">Ngay tao</th>
                <th className="px-6 py-5 text-center font-semibold">Thao tac</th>
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
                    <td className="px-6 py-5 font-medium text-slate-800">{formatPrice(course.price)}</td>
                    <td className="px-6 py-5">{formatDate(course.creationTime)}</td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => router.push(`/teacher/edit_course/${course.courseId}`)}
                          className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                        >
                          Sua
                        </button>
                        <button
                          type="button"
                          onClick={async () => await handleDeleteCourse(course.courseId, course.courseName)}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          Xoa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-slate-500">
                    {searchTerm ? 'Khong tim thay khoa hoc phu hop.' : 'Chua co khoa hoc nao.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6">
        <button className="button-secondary" onClick={() => router.push('/teacher')}>
          Quay lai dashboard
        </button>
      </div>
    </main>
  );
};

export default ManageCourses;
