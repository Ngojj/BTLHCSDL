'use client'

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import * as request from '../../axios/axios';
import { useRouter } from 'next/navigation';

interface Course {
  courseId: number;
  courseName: string;
  language: string;
  description: string;
  creationTime: string;
  price: number | string;
}

interface JoinRecord {
  studentId: number;
  courseId: number;
  progress: number;
}

const CoursesContent = (teacherId: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [joins, setJoins] = useState<JoinRecord[]>([]);
  const router = useRouter();

  const fetchCourses = async () => {
    if (!teacherId) return;
    try {
      const response = await request.get(`/course/teacherId/${teacherId}`);
      if (response.status === 200) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchJoinData = async () => {
    if (!teacherId) return;
    try {
      const response = await request.get(`/join/teacherId/${teacherId}`);
      if (response.status === 200) {
        setJoins(response.data);
      } else {
        setJoins([]);
      }
    } catch (error) {
      console.error('Error fetching join data:', error);
      setJoins([]);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!id) {
      alert('Invalid course ID!');
      return;
    }

    if (confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await request.del(`/course/delete/id/${id}`);
        if (response.message === "success") {
          alert('Course deleted successfully!');
          fetchCourses();
        } else {
          alert('Failed to delete course. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('An error occurred while deleting the course.');
      }
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchJoinData();
  }, [teacherId]);

  if (!teacherId) {
    return <div>Teacher not found</div>;
  }

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("vi-VN");
  };

  const formatPrice = (value: number | string) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return `${value} VND`;
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const shownCourses = courses.slice(0, 6);
  const totalEnrollments = joins.length;
  const uniqueStudents = new Set(joins.map((item) => item.studentId)).size;
  const completedEnrollments = joins.filter((item) => item.progress === 100).length;
  const averageProgress =
    joins.length > 0
      ? Math.round(joins.reduce((sum, item) => sum + item.progress, 0) / joins.length)
      : 0;

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Course Snapshot</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Courses</h1>
          <p className="mt-2 text-sm text-slate-600">
            Dữ liệu bên dưới được liên kết trực tiếp với tiến độ học của sinh viên ở dashboard student.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="button-secondary" onClick={() => router.push('/teacher/courses')}>
            Xem tất cả
          </Button>
          <Button className="button-primary" onClick={() => router.push('/teacher/create')}>
            Tạo khóa học
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lượt đăng ký</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalEnrollments}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Học viên thực</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{uniqueStudents}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Hoàn thành</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{completedEnrollments}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tiến độ TB</p>
          <p className="mt-2 text-3xl font-semibold text-sky-700">{averageProgress}%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shownCourses.map((course) => (
          <article
            key={course.courseId}
            className="flex min-h-[240px] flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50"
          >
            <div className="rounded-t-2xl bg-sky-600 px-4 py-3 text-center text-white">
              <span className="text-xl font-semibold uppercase">{course.courseName}</span>
            </div>

            <div className="flex-1 px-4 py-4">
              <h2 className="text-lg font-bold text-slate-900">{course.courseName}</h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{course.language}</p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{course.description}</p>
              <p className="mt-2 text-sm text-slate-500">{formatDate(course.creationTime)}</p>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-4 py-3">
              <div className="flex gap-2">
                <Button
                  className="border-2 bg-hcmutDarkBlue"
                  onClick={() => {
                    router.push(`/teacher/edit_course/${course.courseId}`);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className="border-2 bg-red-500 text-white"
                  onClick={() => handleDeleteCourse(course.courseId)}
                >
                  Delete
                </Button>
              </div>
              <span className="text-sm font-semibold text-slate-900">{formatPrice(course.price)}</span>
            </div>
          </article>
        ))}

        {shownCourses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-slate-500 sm:col-span-2 xl:col-span-3">
            Chưa có khóa học nào.
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesContent;
