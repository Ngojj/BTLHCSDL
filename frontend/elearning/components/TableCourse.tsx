"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as request from "../app/axios/axios";
import { useRouter } from "next/navigation";
import { JoinFullDto } from "@/app/dtos/join.dto";

type TableCourseProps = {
  userLoginId: string;
};

function TableCourse({ userLoginId }: TableCourseProps) {
  const [courses, setCourses] = useState<JoinFullDto[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<JoinFullDto | null>(null);
  const [updateData, setUpdateData] = useState({
    progress: 0,
    GPA: 0,
    dateComplete: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const fetchCourse = async () => {
    try {
      const data = await request.get(`/join/studentId/${userLoginId}`);
      if (data.status === 200) {
        setCourses(data.data);
      } else {
        setCourses([]);
      }
    } catch (fetchError) {
      console.log("Error fetching courses:", fetchError);
      setCourses([]);
    }
  };

  useEffect(() => {
    if (userLoginId) {
      fetchCourse();
    }
  }, [userLoginId]);

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.courseId.toString().includes(searchTerm)
      ),
    [courses, searchTerm]
  );

  const totalCourses = courses.length;
  const completedCourses = courses.filter((course) => course.progress === 100).length;
  const inProgressCourses = courses.filter(
    (course) => course.progress > 0 && course.progress < 100
  ).length;
  const averageProgress =
    courses.length > 0
      ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)
      : 0;

  const handleUpdate = (course: JoinFullDto) => {
    setSelectedCourse(course);
    setUpdateData({
      progress: course.progress,
      GPA: course.GPA || 0,
      dateComplete: course.dateComplete
        ? new Date(course.dateComplete).toISOString().split("T")[0]
        : "",
    });
    setShowUpdateModal(true);
    setError("");
    setSuccess("");
  };

  const handleUpdateSubmit = async () => {
    if (!selectedCourse) return;

    setError("");
    setSuccess("");

    try {
      const response = await request.patch("/join/update", {
        courseId: selectedCourse.courseId,
        studentId: selectedCourse.studentId,
        progress: updateData.progress,
        GPA: updateData.GPA || null,
        dateComplete: updateData.dateComplete || null,
        dateStart: selectedCourse.dateStart,
      });

      if (response.status === 200) {
        setSuccess("Cập nhật thành công.");
        setShowUpdateModal(false);
        fetchCourse();
      }
    } catch (updateError: any) {
      setError(updateError.response?.data?.message || "Có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleDelete = async (courseId: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đăng ký khóa học này?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await request.del(
        `/join/delete/courseId/${courseId}/studentId/${userLoginId}`
      );

      if (response.status === 200) {
        setSuccess("Hủy đăng ký thành công.");
        fetchCourse();
      }
    } catch (deleteError: any) {
      setError(deleteError.response?.data?.message || "Có lỗi xảy ra khi hủy đăng ký.");
    }
  };

  const getProgressBadge = (progress: number) => {
    if (progress === 100) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (progress > 0) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="space-y-6">
      {(error || success) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || success}
        </div>
      )}

      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Student Dashboard
            </span>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              Quản lý khóa học đã đăng ký
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Theo dõi tiến độ, cập nhật kết quả và truy cập nhanh vào từng khóa học trong một giao diện gọn gàng hơn.
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <svg
                className="h-4 w-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              placeholder="Tìm theo tên hoặc mã khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tổng khóa học</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalCourses}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Đã hoàn thành</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{completedCourses}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Đang học</p>
            <p className="mt-2 text-3xl font-semibold text-amber-500">{inProgressCourses}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tiến độ trung bình</p>
            <p className="mt-2 text-3xl font-semibold text-sky-700">{averageProgress}%</p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-6 py-5 text-center font-semibold">Mã khóa học</th>
                <th className="px-6 py-5 font-semibold">Tên khóa học</th>
                <th className="px-6 py-5 font-semibold">Giảng viên</th>
                <th className="px-6 py-5 text-center font-semibold">GPA</th>
                <th className="px-6 py-5 text-center font-semibold">Ngày đăng ký</th>
                <th className="px-6 py-5 text-center font-semibold">Tiến độ</th>
                <th className="px-6 py-5 text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <tr
                    key={`${course.courseId}-${index}`}
                    className="border-t border-slate-200 transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex min-w-12 justify-center rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-800">
                        {course.courseId}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-slate-900">{course.courseName}</p>
                        <p className="mt-1 max-w-sm text-xs leading-6 text-slate-500">
                          {course.description || "Chưa có mô tả cho khóa học này."}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-slate-700">
                        {course.teacherFirstName} {course.teacherLastName}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="font-semibold text-slate-800">
                        {course.progress === 100
                          ? `${course.GPA?.toFixed(2) || "0.00"}`
                          : "Chưa có kết quả"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {new Date(course.dateStart).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="mx-auto max-w-[180px]">
                        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                          <span>{course.progress === 100 ? "Hoàn tất" : "Đang học"}</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              course.progress === 100 ? "bg-emerald-500" : "bg-sky-700"
                            }`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span
                          className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getProgressBadge(
                            course.progress
                          )}`}
                        >
                          {course.progress === 100
                            ? "Đã hoàn thành"
                            : course.progress > 0
                            ? `Hoàn thành ${course.progress}%`
                            : "Chưa bắt đầu"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                          onClick={() =>
                            router.push(`/studentdb?course=${encodeURIComponent(JSON.stringify(course))}`)
                          }
                        >
                          Xem
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          onClick={() => handleUpdate(course)}
                        >
                          Cập nhật
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          onClick={() => handleDelete(course.courseId)}
                        >
                          Hủy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-500">
                    {searchTerm ? "Không tìm thấy khóa học phù hợp." : "Bạn chưa đăng ký khóa học nào."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showUpdateModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-7 shadow-2xl">
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Cập nhật tiến độ
            </span>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              {selectedCourse.courseName}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Điều chỉnh tiến độ học, GPA và ngày hoàn thành để dữ liệu học tập được phản ánh chính xác hơn.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tiến độ (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={updateData.progress}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, progress: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">GPA</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={updateData.GPA}
                  onChange={(e) => setUpdateData({ ...updateData, GPA: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Ngày hoàn thành
                </label>
                <input
                  type="date"
                  value={updateData.dateComplete}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, dateComplete: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleUpdateSubmit}
                className="button-primary flex-1"
              >
                Lưu thay đổi
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedCourse(null);
                  setError("");
                }}
                className="button-secondary flex-1"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableCourse;
