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

const features = [
  {
    title: "Khóa học",
    desc: "Theo dõi danh sách khóa học, giảng viên và nội dung một cách rõ ràng."
  },
  {
    title: "Quiz",
    desc: "Làm bài, xem tiến độ và kết quả trong cùng một quy trình dễ hiểu."
  },
  {
    title: "Lộ trình",
    desc: "Định hướng lộ trình học phù hợp thay vì chỉ liệt kê môn học rời rạc."
  },
];

const highlights = [
  "Bố cục gọn, nhấn mạnh vào các tác vụ học tập chính.",
  "Khóa học hiển thị rõ học phí, giảng viên và đề cương.",
  "Tối ưu cho cả người học lẫn giảng viên trong cùng một hệ thống."
];

export default function Home() {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState);
  const [course, setCourse] = useState<CourseWithTeacherNameDto[]>([]);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
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

  return (
    <>
      {isLoggedIn ? <BKNavbar2 /> : <BKNavbar />}

      <main className="overflow-hidden">
        <section className="section-shell py-10 sm:py-14">
          <div className="hero-grid overflow-hidden rounded-[36px] border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10 lg:px-14 lg:py-14">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="inline-flex rounded-full bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                  Bách Khoa E-Learning
                </span>

                <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                  {isLoggedIn
                    ? `Chào mừng trở lại, ${userLogin.lastName}. Tiếp tục học tập một cách có hệ thống.`
                    : "Nền tảng học tập trực tuyến rõ ràng, gọn gàng và phù hợp với môi trường học thuật."}
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  Hệ thống được thiết kế để ưu tiên tính dễ dùng: xem khóa học, học bài giảng,
                  làm quiz và theo dõi lộ trình trong một giao diện thống nhất.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  {isLoggedIn ? (
                    <>
                      <button
                        type="button"
                        className="button-primary"
                        onClick={() => router.push(isTeacher ? "/teacher" : "/student/mycourse")}
                      >
                        {isTeacher ? "Vào dashboard teacher" : "Vào khu học tập"}
                      </button>
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => router.push(isTeacher ? "/teacher/courses" : "/student/roadmap")}
                      >
                        {isTeacher ? "Quản lý khóa học" : "Xem lộ trình"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="button-primary"
                        onClick={() => router.push("/signup")}
                      >
                        Đăng ký tài khoản
                      </button>
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => router.push("/aboutus")}
                      >
                        Tìm hiểu thêm
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {features.map((feature) => (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <p className="text-lg font-semibold text-slate-900">{feature.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6">
                <div className="rounded-[26px] bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">
                    Tổng quan
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                    Học tập trong một giao diện thống nhất
                  </h2>
                  <div className="mt-6 grid gap-4">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-medium text-slate-500">Khóa học sẵn có</p>
                      <p className="mt-2 text-3xl font-semibold text-slate-900">{course.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-medium text-slate-500">Đối tượng phù hợp</p>
                      <p className="mt-2 text-base leading-7 text-slate-700">
                        Sinh viên, giảng viên và người quản lý cần một hệ thống rõ, dễ theo dõi và dễ thao tác.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-medium text-slate-500">Mục tiêu giao diện</p>
                      <p className="mt-2 text-base leading-7 text-slate-700">
                        Giảm rối mắt, tăng tính nhất quán và ưu tiên nội dung học tập thay vì trang trí.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell py-8 sm:py-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)]">
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm xl:p-10">
              <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">
                Định hướng giao diện
              </span>
              <h2 className="section-title mt-5 max-w-md text-balance">
                Trực quan hơn cho cả người học và người dạy
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-slate-600">
                Giao diện mới ưu tiên nhóm thông tin quan trọng, giảm các khối nặng nề và đưa các thao tác
                chính ra vị trí dễ thấy, dễ bấm, dễ tiếp tục.
              </p>
              <div className="mt-8 grid gap-4">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-700" />
                    <p className="text-sm leading-7 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm xl:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700">
                    Khóa học nổi bật
                  </span>
                  <h2 className="section-title mt-5">Khám phá các khóa học nổi bật</h2>
                </div>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() =>
                    isLoggedIn
                      ? router.push(isTeacher ? "/teacher/courses" : "/student/mycourse")
                      : router.push("/signup")
                  }
                >
                  {isLoggedIn ? (isTeacher ? "Quản lý khóa học" : "Xem khóa học của tôi") : "Đăng ký để truy cập"}
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <input
                  type="search"
                  value={courseSearchTerm}
                  onChange={(e) => setCourseSearchTerm(e.target.value)}
                  placeholder="Tìm khóa học theo tên, giảng viên, mô tả..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:max-w-md"
                />
                <p className="text-sm text-slate-500">
                  Đang hiển thị {Math.min(filteredCourses.length, 8)}/{filteredCourses.length} khóa học phù hợp
                </p>
              </div>

              <div className="mt-8 min-h-[22rem]">
                {isLoadingCourses ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-[23rem] animate-pulse rounded-[26px] border border-slate-200 bg-slate-50"
                      />
                    ))}
                  </div>
                ) : filteredCourses.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {filteredCourses.slice(0, 8).map((cour) => (
                      <CourseCard
                        key={cour.courseId}
                        courseName={cour.courseName}
                        teacher={`${cour.teacherFirstName} ${cour.teacherLastName}`}
                        price={cour.price}
                        id={cour.courseId}
                        description={cour.description}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[22rem] items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                    {courseSearchTerm
                      ? "Không tìm thấy khóa học phù hợp với từ khóa bạn vừa nhập."
                      : "Hệ thống chưa có khóa học nào để hiển thị hoặc dữ liệu hiện tại đang trống."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}



