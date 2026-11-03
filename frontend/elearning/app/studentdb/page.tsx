"use client"
import BKNavbar2 from "@/components/BKNavbar2";
import CourseDropdown from "@/components/CourseDrop";
import Footer from "@/components/Footer";
import { CourseWithTeacherNameDto } from "../dtos/course.dto";
import { CourseProgressDto, formatGrade, formatIsoDate } from "../dtos/progress.dto";
import { useRouter, useSearchParams } from "next/navigation";
import { SectionDto } from "../dtos/section.dto";
import { Suspense, useCallback, useEffect, useState } from "react";
import request from "../axios/axios";
import * as api from "../axios/axios";
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import Link from "next/link";
import { ArrowRight, Award, Play } from "lucide-react";

const StudentdbContent = () =>{
  const [userLogin, setUserLogin] = useRecoilState(userLoginState);
  const [sections, setSections] = useState<SectionDto[]>([])
  const [progress, setProgress] = useState<CourseProgressDto | null>(null)
  const [openSection, setOpenSection] = useState<number | "intro" | null>(null)
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseParam = searchParams.get("course");

  const course: (CourseWithTeacherNameDto & { teacherFirstName?: string; teacherLastName?: string }) | null = courseParam
    ? JSON.parse(courseParam)
    : null;

  useEffect(() => {
    const userFromSessionRaw = sessionStorage.getItem('userLogin')
    if(!userFromSessionRaw) {
      router.push('/login')
      return
    }
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

  // the server owns the progress: a lecture finished in the player is reflected here after a refetch
  const fetchProgress = useCallback(async () => {
    if (!course?.courseId) return;
    try {
      setProgress(await api.get(`/progress/course/${course.courseId}`));
    } catch (error) {
      console.log(error);
      setProgress(null);
    }
  }, [course?.courseId]);

  useEffect(() => {
    fetchSection()
  }, [searchParams])

  useEffect(() => {
    if (userLogin.id) fetchProgress();
  }, [userLogin.id, fetchProgress])

  // open the section that holds the next step as soon as we know it
  useEffect(() => {
    if (progress?.next && openSection === null) setOpenSection(progress.next.sectionId);
  }, [progress?.next?.sectionId])

  if (!userLogin.id) return <>Loading...</>

  const next = progress?.next ?? null;
  const percent = progress?.progress ?? 0;
  const teacher = [course?.teacherFirstName, course?.teacherLastName].filter(Boolean).join(" ");

  const continueLearning = () => {
    if (!next) return;
    setOpenSection(next.sectionId);
    setTimeout(() => document.getElementById(`section-${next.sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <>
      <BKNavbar2 />
      <main className="section-shell py-12 sm:py-14">
        <p className="eyebrow">Khóa học{course?.courseId ? ` · #${String(course.courseId).padStart(4, "0")}` : ""}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-bk-ink sm:text-5xl">{course?.courseName}</h1>
        {teacher && <p className="mt-2 text-sm text-bk-slate">Giảng viên {teacher}</p>}

        <section className="mt-8 grid overflow-hidden rounded-[10px] border border-bk-line md:grid-cols-[0.9fr_1.1fr]">
          <div className="bp-grid-dark flex items-center gap-6 bg-bk-navy p-7 text-white">
            <div className="relative h-24 w-24 shrink-0">
              <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={`${(percent / 100) * 97.4} 100`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-semibold">
                {percent}<span className="text-xs">%</span>
              </span>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-3"><dt className="w-20 text-white/60">Bài giảng</dt><dd className="font-mono">{progress?.totals.lecturesDone ?? 0}/{progress?.totals.lectures ?? 0}</dd></div>
              <div className="flex gap-3"><dt className="w-20 text-white/60">Quiz</dt><dd className="font-mono">{progress?.totals.quizzesDone ?? 0}/{progress?.totals.quizzes ?? 0}</dd></div>
              <div className="flex gap-3"><dt className="w-20 text-white/60">Điểm TB</dt><dd className="font-mono">{formatGrade(progress?.gpa ?? null)}</dd></div>
            </dl>
          </div>

          <div className="flex flex-col justify-between gap-5 bg-white p-7">
            {progress?.certificate ? (
              <div className="cut-corner rounded-[10px] border border-bk-gold/60 bg-[#FFFBEF] p-5">
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bk-gold">
                  <Award className="h-4 w-4" strokeWidth={1.5} /> Đã nhận chứng chỉ
                </p>
                <p className="mt-2 text-sm text-bk-ink">
                  Cấp ngày {formatIsoDate(progress.certificate.issuedAt)} · mã <span className="font-mono">{progress.certificate.code}</span>
                </p>
                <Link href="/student/certificates" className="button-link mt-3 text-xs">
                  Xem và tải chứng chỉ <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bk-slate">
                  {next ? "Bài tiếp theo" : "Chứng chỉ"}
                </p>
                <p className="mt-1.5 text-lg font-semibold text-bk-ink">
                  {next
                    ? `${next.type === "quiz" ? "Quiz" : "Bài giảng"} · ${next.name}`
                    : progress?.completed
                    ? `Bạn đã học hết nhưng điểm trung bình ${formatGrade(progress.gpa)} chưa đạt ${formatGrade(progress.passGpa)}`
                    : "Chưa có nội dung"}
                </p>
                <p className="mt-1 text-sm text-bk-slate">
                  {next
                    ? next.sectionName
                    : progress?.completed
                    ? "Làm lại quiz để nâng điểm trung bình và nhận chứng chỉ."
                    : ""}
                </p>
                <p className="mt-3 text-xs text-bk-slate">
                  Hoàn thành 100% nội dung và đạt điểm trung bình quiz từ {formatGrade(progress?.passGpa ?? 5)} để nhận chứng chỉ.
                </p>
              </div>
            )}
            {next && (
              <div>
                <button type="button" className="button-primary" onClick={continueLearning}>
                  <Play className="h-3.5 w-3.5 fill-white" /> {next.positionSeconds > 5 ? "Học tiếp" : "Bắt đầu học"}
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Tổng quan</p>
            <h2 className="mt-2 text-2xl font-semibold text-bk-ink">Về khóa học này</h2>
            <p className="mt-4 text-sm leading-7 text-bk-slate">{course?.description}</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-bk-slate">{sections.length} chương</p>
          </div>

          <div>
            <p className="eyebrow">Nội dung khóa học</p>
            <div className="mt-3 border-t border-bk-line">
              <CourseDropdown
                title="Giới thiệu"
                description={course?.description}
                sectionId=""
                open={openSection === "intro"}
                onToggle={() => setOpenSection(openSection === "intro" ? null : "intro")}
              />
              {sections.map((section, index)=> (
                <CourseDropdown
                  userId={userLogin.id}
                  key={section.id ?? index}
                  title={`Chương ${index + 1}: ${section.name}`}
                  sectionId={section.id}
                  progress={progress?.sections.find((s) => s.id === section.id)}
                  open={openSection === section.id}
                  onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
                  onProgressChange={fetchProgress}
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
