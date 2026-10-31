"use client";

import BKNavbar from "@/components/BKNavbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import BKNavbar2 from "@/components/BKNavbar2";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import { useEffect, useMemo, useState } from "react";
import * as request from "@/app/axios/axios";
import { CourseWithTeacherNameDto } from "./dtos/course.dto";
import { ArrowRight, Award, Check, Play, Search } from "lucide-react";

const suggestions = [
  { label: "Tất cả", keyword: "" },
  { label: "Dữ liệu", keyword: "dữ liệu" },
  { label: "AI", keyword: "learning" },
  { label: "Giải thuật", keyword: "giải thuật" },
  { label: "Hệ thống", keyword: "hệ" },
];

const subjects = [
  "Hệ cơ sở dữ liệu",
  "Giải thuật",
  "Machine Learning",
  "Mạng máy tính",
  "Hệ điều hành",
  "Kiến trúc máy tính",
];

const steps = [
  { title: "Khóa học", desc: "Bài giảng video, tài liệu đính kèm và bài tập theo từng section." },
  { title: "Lộ trình", desc: "Chuỗi khóa học có thứ tự cho từng định hướng nghề." },
  { title: "Quiz", desc: "Kiểm tra sau mỗi chương, chấm điểm ngay, lưu vào bảng điểm." },
];

const formatNumber = (value: number, digits = 0) =>
  value.toLocaleString("vi-VN", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export default function Home() {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState);
  const [course, setCourse] = useState<CourseWithTeacherNameDto[]>([]);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const role = String(userLogin.role || "").toLowerCase();
  const isLoggedIn = userLogin.id !== "";
  const isTeacher = role === "teacher";
  const router = useRouter();

  const filteredCourses = useMemo(() => {
    const keyword = courseSearchTerm.trim().toLowerCase();
    if (!keyword) return course;

    return course.filter((c) => {
      const courseName = String(c.courseName || "").toLowerCase();
      const teacherName = `${c.teacherFirstName || ""} ${c.teacherLastName || ""}`.toLowerCase();
      const description = String(c.description || "").toLowerCase();

      return (
        courseName.includes(keyword) ||
        teacherName.includes(keyword) ||
        description.includes(keyword)
      );
    });
  }, [course, courseSearchTerm]);

  const stats = useMemo(() => {
    const teachers = new Set(course.map((c) => c.teacherId)).size;
    const languages = new Set(course.map((c) => String(c.languege || "").toLowerCase()).filter(Boolean)).size;
    const quizzes = course.map((c) => Number(c.avgQuiz || 0)).filter((v) => v > 0);
    const avgQuiz = quizzes.length ? quizzes.reduce((a, b) => a + b, 0) / quizzes.length : 0;
    return { teachers, languages, avgQuiz, quizCourses: quizzes.length };
  }, [course]);

  const shownCourses = showAll ? filteredCourses : filteredCourses.slice(0, 5);

  const fetchCourse = async () => {
    try {
      setIsLoadingCourses(true);
      const response = await request.get(`/course/teacher`);
      setCourse(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.log(e);
      setCourse([]);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    if (userLogin.id !== "") return;

    const userFromSessionRaw = sessionStorage.getItem("userLogin");
    if (!userFromSessionRaw) return;

    setUserLogin(JSON.parse(userFromSessionRaw));
  }, []);

  const scrollToCourses = () => {
    document.getElementById("khoa-hoc")?.scrollIntoView({ behavior: "smooth" });
  };

  const goRoadmap = () => {
    if (!isLoggedIn) router.push("/signup");
    else router.push(isTeacher ? "/teacher/roadmap" : "/student/roadmap");
  };

  return (
    <>
      {isLoggedIn ? <BKNavbar2 /> : <BKNavbar />}

      <main className="overflow-hidden">
        {/* HERO */}
        <section className="bp-grid relative border-b border-bk-line">
          <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.16em] text-bk-slate/70">
            BK-ELN / SHEET 01 / SCALE 1:1
          </span>
          <span className="absolute right-4 top-4 h-3 w-3 border-r border-t border-bk-navy/40" />
          <span className="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-bk-navy/40" />

          <div className="section-shell grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
            <div className="animate-fade-slide-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-bk-line bg-white px-3 py-1 text-xs text-bk-slate">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {isLoggedIn ? `Xin chào, ${userLogin.lastName} ${userLogin.firstName}` : "Học kỳ mới đang mở đăng ký"}
              </span>

              <h1 className="mt-6 text-balance text-[44px] font-semibold leading-[1.05] tracking-tight text-bk-ink sm:text-6xl">
                Học kỹ thuật <span className="text-bk-navy">bài bản</span>, từ giảng đường Bách Khoa.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-bk-slate">
                Khóa học do giảng viên HCMUT biên soạn, lộ trình theo định hướng nghề và bài quiz chấm điểm
                ngay. Hoàn thành lộ trình để nhận chứng chỉ.
              </p>

              <form
                className="mt-8 flex max-w-xl items-center gap-2 rounded-lg border border-bk-line bg-white p-1.5 pl-4 focus-within:border-bk-blue"
                onSubmit={(e) => {
                  e.preventDefault();
                  scrollToCourses();
                }}
              >
                <Search className="h-4 w-4 shrink-0 text-bk-slate" strokeWidth={1.5} />
                <input
                  type="search"
                  aria-label="Tìm khóa học"
                  value={courseSearchTerm}
                  onChange={(e) => setCourseSearchTerm(e.target.value)}
                  placeholder="Tìm khóa học theo tên, giảng viên, mô tả..."
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-bk-ink outline-none placeholder:text-bk-slate/70"
                />
                <button type="submit" className="button-primary px-4 py-2">
                  Tìm kiếm
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.16em] text-bk-slate">Gợi ý</span>
                {suggestions.map((item) => {
                  const active = courseSearchTerm.trim().toLowerCase() === item.keyword;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setCourseSearchTerm(item.keyword)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        active
                          ? "border-bk-navy bg-bk-navy text-white"
                          : "border-bk-line bg-white text-bk-ink hover:border-bk-navy"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {isLoggedIn && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => router.push(isTeacher ? "/teacher" : "/student/mycourse")}
                  >
                    {isTeacher ? "Vào dashboard" : "Vào khu học tập"} <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => router.push(isTeacher ? "/teacher/courses" : "/student/roadmap")}
                  >
                    {isTeacher ? "Quản lý khóa học" : "Xem lộ trình"}
                  </button>
                </div>
              )}
            </div>

            {/* Minh họa: bảng học tập */}
            <div className="hidden gap-3 lg:grid" aria-hidden="true">
              <div className="card flex items-center gap-5 p-5 shadow-[0_16px_40px_-24px_rgba(3,43,145,0.35)]">
                <div className="relative h-16 w-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--bk-line)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--bk-navy)" strokeWidth="3" strokeDasharray="70 100" strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-display text-base font-semibold text-bk-ink">
                    72<span className="text-[9px]">%</span>
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow">Đang học</p>
                  <p className="mt-1 font-display text-lg font-semibold text-bk-ink">Hệ cơ sở dữ liệu</p>
                  <p className="mt-0.5 text-xs text-bk-slate">Tiếp theo: Section 05 · Tối ưu truy vấn</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bk-navy text-white">
                  <Play className="h-3.5 w-3.5 fill-white" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="card p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bk-slate">Quiz gần nhất</p>
                  <p className="mt-3 font-display text-4xl font-semibold text-bk-ink">
                    9,0<span className="text-base font-medium text-bk-slate">/10</span>
                  </p>
                  <div className="mt-4 flex h-8 items-end gap-1.5">
                    {[35, 45, 40, 60, 55, 100].map((h, i) => (
                      <span
                        key={i}
                        className={`flex-1 rounded-[2px] ${i === 5 ? "bg-bk-navy" : "bg-bk-blue/30"}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="cut-corner flex flex-col justify-between rounded-[10px] border border-bk-gold/60 bg-[#FFFBEF] p-5">
                  <Award className="h-5 w-5 text-bk-gold" strokeWidth={1.5} />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bk-gold">Chứng chỉ</p>
                    <p className="mt-1 text-sm font-semibold text-bk-ink">Kỹ sư Dữ liệu</p>
                  </div>
                </div>
              </div>

              <div className="card flex items-center gap-4 px-5 py-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bk-slate">Lộ trình</span>
                <div className="flex flex-1 items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bk-navy text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="h-px flex-1 bg-bk-navy" />
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-bk-navy bg-white font-mono text-[8px] text-bk-navy">02</span>
                  <span className="h-px flex-1 border-t border-dashed border-bk-line" />
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-bk-line bg-white font-mono text-[8px] text-bk-slate">03</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BĂNG MÔN HỌC */}
        <div className="overflow-hidden bg-bk-navy py-4">
          <div className="animate-marquee flex w-max gap-14 whitespace-nowrap">
            {[...subjects, ...subjects].map((subject, index) => (
              <span key={index} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/85">
                <span className="h-1 w-1 bg-bk-blue" />
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* 01 — KHÓA HỌC */}
        <section id="khoa-hoc" className="section-shell scroll-mt-20 py-20 sm:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">01 — Khóa học</p>
              <h2 className="section-title mt-3 max-w-md">Khám phá các khóa học nổi bật</h2>
            </div>
            {filteredCourses.length > 5 && (
              <button type="button" className="button-link" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Thu gọn" : `Xem tất cả ${filteredCourses.length} khóa học`}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {courseSearchTerm && (
            <p className="mt-4 text-sm text-bk-slate">
              {filteredCourses.length} kết quả cho “<span className="text-bk-ink">{courseSearchTerm}</span>” ·{" "}
              <button type="button" className="text-bk-blue hover:text-bk-navy" onClick={() => setCourseSearchTerm("")}>
                Xóa bộ lọc
              </button>
            </p>
          )}

          <div className="mt-10">
            {isLoadingCourses ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-72 animate-pulse rounded-[10px] border border-bk-line bg-bk-mist" />
                ))}
              </div>
            ) : shownCourses.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shownCourses.map((cour, index) => (
                  <div key={cour.courseId} className={index === 0 ? "md:col-span-2 lg:row-span-2" : ""}>
                    <CourseCard
                      featured={index === 0}
                      courseName={cour.courseName}
                      teacher={`${cour.teacherFirstName} ${cour.teacherLastName}`}
                      price={cour.price}
                      id={cour.courseId}
                      description={cour.description}
                      language={cour.languege}
                      creationTime={cour.creationTime}
                      avgQuiz={cour.avgQuiz}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bp-grid flex min-h-[16rem] items-center justify-center rounded-[10px] border border-dashed border-bk-line p-10 text-center text-sm text-bk-slate">
                {courseSearchTerm
                  ? "Không tìm thấy khóa học phù hợp với từ khóa bạn vừa nhập."
                  : "Hệ thống chưa có khóa học nào để hiển thị."}
              </div>
            )}
          </div>
        </section>

        {/* SỐ LIỆU */}
        <section className="border-y border-bk-line bg-bk-mist">
          <div className="section-shell grid grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Khóa học", value: formatNumber(course.length), note: "Đang mở đăng ký" },
              { label: "Giảng viên", value: formatNumber(stats.teachers), note: "Trực tiếp biên soạn" },
              { label: "Ngôn ngữ", value: formatNumber(stats.languages), note: "Tiếng Việt & English" },
              {
                label: "Điểm quiz TB",
                value: stats.avgQuiz ? formatNumber(stats.avgQuiz, 1) : "—",
                note: `Trên ${stats.quizCourses} khóa có quiz`,
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`border-bk-line py-8 pr-4 ${index % 2 === 1 ? "border-l pl-6" : "lg:pl-6"} ${index === 2 ? "lg:border-l" : ""}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bk-slate">{item.label}</p>
                <p className="mt-3 font-display text-4xl font-semibold text-bk-ink">{item.value}</p>
                <p className="mt-2 text-xs text-bk-slate">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 02 — CÁCH HỌC */}
        <section id="cach-hoc" className="section-shell scroll-mt-20 py-20 sm:py-24">
          <p className="eyebrow">02 — Cách học</p>
          <h2 className="section-title mt-3 max-w-md">Ba bước, một mạch học liền lạc</h2>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <ol className="border-t border-bk-line">
              {steps.map((step, index) => {
                const active = index === activeStep;
                return (
                  <li key={step.title}>
                    <button
                      type="button"
                      onClick={() => setActiveStep(index)}
                      className={`flex w-full gap-5 border-b border-bk-line px-4 py-6 text-left transition-colors ${
                        active ? "-mt-px border-t-2 border-t-bk-navy bg-bk-mist" : "hover:bg-bk-mist/60"
                      }`}
                    >
                      <span className="pt-1 font-mono text-[11px] text-bk-blue">{String(index + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block font-display text-xl font-semibold text-bk-ink">{step.title}</span>
                        <span className="mt-1.5 block text-sm leading-6 text-bk-slate">{step.desc}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="bp-grid flex items-center justify-center rounded-[10px] border border-bk-line bg-bk-mist p-6 sm:p-10" aria-hidden="true">
              {activeStep === 0 && (
                <div className="w-full max-w-md overflow-hidden rounded-[10px] border border-bk-line bg-white shadow-[0_20px_40px_-24px_rgba(11,27,63,0.35)]">
                  <div className="relative flex aspect-video items-center justify-center bg-bk-ink">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                      <Play className="h-4 w-4 fill-bk-navy text-bk-navy" />
                    </span>
                    <span className="absolute bottom-3 left-3 font-mono text-[10px] text-white/70">12:04 / 31:40</span>
                    <span className="absolute bottom-0 left-0 h-0.5 w-[38%] bg-bk-blue" />
                  </div>
                  <div className="p-4">
                    <p className="eyebrow">Section 03 · Bài 02</p>
                    <p className="mt-1 font-semibold text-bk-ink">JOIN và truy vấn lồng</p>
                    <div className="mt-3 flex gap-2">
                      {["slide-join.pdf · 2,4 MB", "bai-tap-03.sql"].map((file) => (
                        <span key={file} className="rounded-md border border-bk-line px-2 py-1 font-mono text-[10px] text-bk-slate">
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeStep === 1 && (
                <ol className="w-full max-w-sm space-y-0">
                  {["Hệ cơ sở dữ liệu", "Cấu trúc dữ liệu & Giải thuật", "Machine Learning cơ bản"].map((name, i) => (
                    <li key={name} className="flex gap-4">
                      <span className="flex flex-col items-center">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] ${i === 0 ? "border-bk-navy bg-bk-navy text-white" : "border-bk-navy bg-white text-bk-navy"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {i < 2 && <span className="h-10 w-px border-l border-dashed border-bk-navy/40" />}
                      </span>
                      <span className="card mb-3 flex-1 px-4 py-2.5 text-sm font-medium text-bk-ink">{name}</span>
                    </li>
                  ))}
                </ol>
              )}
              {activeStep === 2 && (
                <div className="w-full max-w-sm space-y-2">
                  <p className="font-display text-lg font-semibold text-bk-ink">Dạng chuẩn nào loại bỏ phụ thuộc bắc cầu?</p>
                  {["2NF", "3NF", "BCNF"].map((opt, i) => (
                    <div key={opt} className={`flex items-center gap-3 rounded-md border bg-white px-3 py-2.5 text-sm ${i === 1 ? "border-bk-navy text-bk-navy" : "border-bk-line text-bk-ink"}`}>
                      <span className={`flex h-6 w-6 items-center justify-center rounded border font-mono text-[10px] ${i === 1 ? "border-bk-navy bg-bk-navy text-white" : "border-bk-line"}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 03 — LỘ TRÌNH */}
        <section id="lo-trinh" className="section-shell scroll-mt-20">
          <div className="bp-grid-dark relative overflow-hidden rounded-[12px] bg-bk-night px-6 py-12 sm:px-12 sm:py-14">
            <svg viewBox="0 0 300 260" className="pointer-events-none absolute -right-10 top-0 hidden h-full text-white/25 md:block" fill="none" aria-hidden="true">
              <path d="M150 0 300 260H0L150 0Z" stroke="currentColor" />
              <path d="M150 70 240 225H60l90-155Z" stroke="currentColor" />
              <path d="M150 0v260M0 260l240-35" stroke="currentColor" strokeWidth="0.6" />
            </svg>
            <div className="relative max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bk-blue">03 — Lộ trình đề xuất</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Trở thành <span className="text-[#E3C770]">Kỹ sư Dữ liệu</span> sau 3 khóa học.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70">
                Hệ cơ sở dữ liệu → Cấu trúc dữ liệu & Giải thuật → Machine Learning cơ bản. Hoàn thành cả ba để nhận
                chứng chỉ lộ trình.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={goRoadmap} className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-bk-navy transition hover:bg-bk-mist">
                  Bắt đầu lộ trình <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={goRoadmap} className="inline-flex items-center rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
                  Xem chi tiết lộ trình
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
