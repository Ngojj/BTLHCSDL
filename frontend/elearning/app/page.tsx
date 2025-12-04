"use client"

import BKNavbar from "@/components/BKNavbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import Image from "next/image";
import BKNavbar2 from "@/components/BKNavbar2";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import { useEffect, useState } from "react";
import * as request from "@/app/axios/axios";
import { CourseWithTeacherNameDto } from "./dtos/course.dto";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import "@/components/ui/styles.css"

export default function Home() {

  const [userLogin, setUserLogin] = useRecoilState(userLoginState)
  const [course, setCourse] = useState<CourseWithTeacherNameDto[]>([])
  const isLoggedIn : boolean = userLogin.id !== "" ? true : false;
  const router = useRouter()

  const fetchCourse = async () => {
    try{
      const response = await request.get(`/course/teacher`)
      setCourse(response.data)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    fetchCourse()
    if(userLogin.id !== "") return
    
    const userFromSessionRaw = sessionStorage.getItem('userLogin')

    if(!userFromSessionRaw) return

    setUserLogin(JSON.parse(userFromSessionRaw))  

  },[])

  return (
    <>
      {isLoggedIn ? (
        <BKNavbar2 />
      ) : (
        <BKNavbar />
      )}

      <div className="w-full flex flex-col min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-500 to-blue-700 flex flex-row items-center justify-between px-8 py-12">
          <div className="flex-1 pr-8">
            {isLoggedIn ? (
              <>
                <h1 className="text-white text-5xl font-extrabold mb-4">
                  Chào mừng, <span className="underline">{userLogin.lastName}</span>!
                </h1>
                <p className="text-white text-lg leading-relaxed mb-6">
                  Cảm ơn bạn đã tin tưởng đồng hành cùng chúng tôi. Tiếp tục
                  khám phá và nâng cao kỹ năng của bạn với các khóa học đặc sắc
                  dưới đây!
                </p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="bg-white text-blue-600 font-medium text-sm px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
                    onClick={() => {
                      router.push('/student/mycourse')
                    }}
                  >
                    Xem khóa học của tôi
                  </button>
                  <button
                    type="button"
                    className="bg-transparent border border-white text-white font-medium text-sm px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300"
                    onClick={() => router.push('/aboutus')}
                  >
                    Về chúng tôi
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-white text-5xl font-bold mb-4">
                  Giới thiệu trang
                </h1>
                <p className="text-white text-lg leading-relaxed mb-6">
                  Đây là một nền tảng học tập dành cho tất cả mọi người, nơi bạn
                  có thể tham gia các khóa học chất lượng cao. Hãy cùng chúng tôi
                  khám phá và nâng cao kỹ năng của bạn ngay hôm nay!
                </p>
                <button
                  type="button"
                  className="bg-white text-blue-600 font-medium text-sm px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
                >
                  Tham gia cùng chúng tôi
                </button>
              </>
            )}
          </div>

          <div className="flex-1 flex justify-center">
            <Image
              className="rounded-lg shadow-lg"
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3R1ZHl8ZW58MHx8MHx8fDA%3D"
              alt="Học tập"
              width={500}
              height={500}
            />
          </div>
        </section>

        {/* Courses Section */}
        <section className="bg-gray-50 py-16">
          <h2 className="text-center text-4xl font-bold mb-12 text-gray-800">
            Các khóa học bán chạy
          </h2>
          <div className="px-8">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{ clickable: true }}
              modules={[EffectCoverflow, Pagination]}
              className="mySwiper"
            >
              {course && course.length > 0 ? course.map((cour) => (
                <SwiperSlide key={cour.courseId}>
                  <CourseCard
                    courseName={cour.courseName}
                    teacher={cour.teacherFirstName + ' ' + cour.teacherLastName}
                    price={cour.price}
                    id={cour.courseId}
                    description={cour.description}
                  />
                </SwiperSlide>
              )) : (
                <p className="text-center text-gray-600">Không có khóa học nào để hiển thị.</p>
              )}
            </Swiper>
          </div>
        </section>

      </div>
      <Footer/>
    </>
  );
}
