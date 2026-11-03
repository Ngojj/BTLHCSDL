"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as request from "../app/axios/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { JoinFullDto } from "@/app/dtos/join.dto";
import { CourseProgressDto, formatClock, isSectionDone } from "@/app/dtos/progress.dto";
import { courseGlyph } from "./CourseCard";
import { ArrowRight, Award, Play, Search } from "lucide-react";

type TableCourseProps = {
  userLoginId: string;
};

type Filter = "all" | "learning" | "done";

const formatDate = (value: Date | string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "—";

const formatScore = (value: number | null | undefined) =>
  value === null || value === undefined ? "—" : Number(value).toFixed(1).replace(".", ",");

function TableCourse({ userLoginId }: TableCourseProps) {
  const [courses, setCourses] = useState<JoinFullDto[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");
  const [outline, setOutline] = useState<CourseProgressDto | null>(null);
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

  const completed = courses.filter((course) => course.progress === 100);
  const learning = courses.filter((course) => course.progress < 100);
  const averageProgress =
    courses.length > 0
      ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)
      : 0;

  // Khóa đang học dở có tiến độ cao nhất
  const current = useMemo(
    () => [...learning].sort((a, b) => b.progress - a.progress)[0] || null,
    [courses]
  );

  // the server knows which lecture or quiz comes next; the browser does not have to guess from a percentage
  useEffect(() => {
    if (!current) return;
    request
      .get(`/progress/course/${current.courseId}`)
      .then((response) => setOutline(response))
      .catch(() => setOutline(null));
  }, [current?.courseId]);

  const sections = outline?.sections ?? [];
  const next = outline?.next ?? null;
  const doneSections = sections.filter(isSectionDone).length;

  const filteredCourses = useMemo(
    () =>
      courses
        .filter((course) =>
          filter === "all" ? true : filter === "done" ? course.progress === 100 : course.progress < 100
        )
        .filter(
          (course) =>
            course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.courseId.toString().includes(searchTerm)
        ),
    [courses, searchTerm, filter]
  );

  const openCourse = (course: JoinFullDto) =>
    router.push(`/studentdb?course=${encodeURIComponent(JSON.stringify(course))}`);

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

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Tất cả", count: courses.length },
    { key: "learning", label: "Đang học", count: learning.length },
    { key: "done", label: "Hoàn thành", count: completed.length },
  ];

  return (
    <div className="space-y-10">
      {(error || success) && (
        <div
          className={`rounded-md border-l-2 px-4 py-3 text-sm ${
            error ? "border-[#C2410C] bg-orange-50 text-[#9A3412]" : "border-[#1F8A5B] bg-emerald-50 text-[#166534]"
          }`}
        >
          {error || success}
        </div>
      )}

      {/* Tiếp tục học */}
      {current && (
        <section className="grid overflow-hidden rounded-[10px] border border-bk-line md:grid-cols-[0.95fr_1.05fr]">
          <div className="bp-grid-dark flex items-center gap-6 bg-bk-navy p-7 text-white">
            <div className="relative h-24 w-24 shrink-0">
              <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={`${(current.progress / 100) * 97.4} 100`}
                />
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-semibold">
                  {current.progress}<span className="text-xs">%</span>
                </span>
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                Tiếp tục · #{String(current.courseId).padStart(4, "0")}
              </p>
              <h2 className="mt-1.5 text-2xl font-semibold leading-tight">{current.courseName}</h2>
              <p className="mt-1 text-sm text-white/70">
                {current.teacherFirstName} {current.teacherLastName}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 bg-white p-7">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bk-slate">Phần tiếp theo</p>
              <p className="mt-1.5 text-lg font-semibold text-bk-ink">
                {next
                  ? `${next.type === "quiz" ? "Quiz" : "Bài giảng"} · ${next.name}`
                  : outline?.completed
                  ? "Bạn đã học hết nội dung khóa này"
                  : "Mở khóa học để xem nội dung"}
              </p>
              {next && (
                <p className="mt-1 text-sm text-bk-slate">
                  {next.sectionName}
                  {next.type === "lecture" && next.positionSeconds > 5 && ` · đang xem dở ${formatClock(next.positionSeconds)}`}
                </p>
              )}
              {sections.length > 0 && (
                <>
                  <div className="mt-4 flex gap-1">
                    {sections.map((s, i) => (
                      <span
                        key={s.id}
                        className={`h-1.5 flex-1 rounded-full ${
                          isSectionDone(s) ? "bg-bk-navy" : s.id === next?.sectionId ? "bg-bk-blue" : "bg-bk-line"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-1.5 flex justify-between font-mono text-[10px] text-bk-slate">
                    <span>SECTION 01</span>
                    <span>
                      {doneSections}/{String(sections.length).padStart(2, "0")} HOÀN THÀNH
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button type="button" className="button-primary" onClick={() => openCourse(current)}>
                <Play className="h-3.5 w-3.5 fill-white" /> Học tiếp
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Danh sách khóa học */}
        <section>
          <div className="flex flex-col gap-4 border-b border-bk-line sm:flex-row sm:items-end sm:justify-between">
            <h2 className="pb-3 text-2xl font-semibold text-bk-ink">Khóa học của tôi</h2>
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${
                    filter === tab.key
                      ? "border-bk-navy font-semibold text-bk-ink"
                      : "border-transparent text-bk-slate hover:text-bk-ink"
                  }`}
                >
                  {tab.label} <span className="font-mono text-[10px] text-bk-slate">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-md border border-bk-line px-3 focus-within:border-bk-blue">
            <Search className="h-4 w-4 text-bk-slate" strokeWidth={1.5} />
            <input
              type="search"
              aria-label="Tìm khóa học"
              className="w-full bg-transparent py-2.5 text-sm text-bk-ink outline-none placeholder:text-bk-slate/70"
              placeholder="Tìm theo tên hoặc mã khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ul className="mt-2 divide-y divide-bk-line">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => {
                const done = course.progress === 100;
                return (
                  <li key={`${course.courseId}-${index}`} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
                    <span className="bp-grid flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-bk-line bg-bk-mist px-1 text-center font-display text-sm font-medium leading-tight text-bk-navy">
                      {courseGlyph(course.courseName).slice(0, 6)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-bk-slate">
                        #{String(course.courseId).padStart(4, "0")} · {course.teacherFirstName} {course.teacherLastName}
                      </p>
                      <p className="mt-0.5 truncate font-display text-lg font-semibold text-bk-ink">{course.courseName}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-bk-line">
                          <div
                            className={`h-full rounded-full ${done ? "bg-[#1F8A5B]" : "bg-bk-navy"}`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className={`w-10 text-right font-mono text-[11px] ${done ? "text-[#1F8A5B]" : "text-bk-ink"}`}>
                          {course.progress}%
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-bk-slate">
                        {done
                          ? `Hoàn thành ${formatDate(course.dateComplete)} · GPA ${formatScore(course.GPA)}`
                          : `Đăng ký ${formatDate(course.dateStart)}`}
                        {" · "}
                        <button type="button" className="text-bk-slate hover:text-[#C2410C]" onClick={() => handleDelete(course.courseId)}>
                          Hủy đăng ký
                        </button>
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`${done ? "button-secondary" : "button-primary"} w-full shrink-0 sm:w-28`}
                      onClick={() => openCourse(course)}
                    >
                      {done ? "Xem lại" : course.progress === 0 ? "Bắt đầu" : "Học tiếp"}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="py-14 text-center text-sm text-bk-slate">
                {searchTerm ? (
                  "Không tìm thấy khóa học phù hợp."
                ) : courses.length === 0 ? (
                  <>
                    Bạn chưa đăng ký khóa học nào.{" "}
                    <Link href="/#khoa-hoc" className="font-semibold text-bk-blue hover:text-bk-navy">
                      Khám phá khóa học
                    </Link>
                  </>
                ) : (
                  "Không có khóa học nào trong mục này."
                )}
              </li>
            )}
          </ul>
        </section>

        {/* Cột phải */}
        <aside className="space-y-4">
          <div className="card p-5">
            <p className="eyebrow">Tổng quan học tập</p>
            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-bk-line bg-bk-line">
              {[
                { label: "Khóa học", value: courses.length },
                { label: "Đang học", value: learning.length },
                { label: "Hoàn thành", value: completed.length },
                { label: "Tiến độ TB", value: `${averageProgress}%` },
              ].map((item) => (
                <div key={item.label} className="bg-white p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-bk-slate">{item.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-bk-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex justify-between">
              <Link href="/student/tablescore" className="button-link text-xs">
                Bảng điểm <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/student/roadmap" className="button-link text-xs">
                Lộ trình <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {completed.length > 0 && (
            <div className="cut-corner rounded-[10px] border border-bk-gold/60 bg-[#FFFBEF] p-5">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bk-gold">
                <Award className="h-4 w-4" strokeWidth={1.5} /> Đã hoàn thành
              </p>
              <ul className="mt-3 space-y-3">
                {completed.map((course) => (
                  <li key={course.courseId}>
                    <p className="font-display text-base font-semibold text-bk-ink">{course.courseName}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-bk-slate">
                      {formatDate(course.dateComplete)} · GPA {formatScore(course.GPA)}
                    </p>
                  </li>
                ))}
              </ul>
              <Link href="/student/certificates" className="button-link mt-4 text-xs">
                Chứng chỉ của tôi <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </aside>
      </div>

    </div>
  );
}

export default TableCourse;
