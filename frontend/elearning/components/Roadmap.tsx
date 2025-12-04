"use client"
import request from "@/app/axios/axios";
import { CourseWithTeacherNameDto } from "@/app/dtos/course.dto";
import { RoadmapShowForStudentDto } from "@/app/dtos/roadmap.dto";
import { userLoginState } from "@/state";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";


const Roadmap = ({ roadmap }: { roadmap: RoadmapShowForStudentDto | null }) => {
    const [courses, setCourses] = useState<CourseWithTeacherNameDto[]>([])
    const [joins, setJoins] = useState<{ [key: string]: number}>({})
    const [userLogin, setUserLogin] = useRecoilState(userLoginState)
    const fetchCourse = async () => {
        try {
            const response = await request.get(`/includeCourse/rmId/${roadmap?.id}`)

            setCourses(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchJoin = async () => {
        try {
            const response = await request.get(`/join/studentId/${userLogin.id}`)

            const tmp: { [key: string]: number } = {};

            for(const join of response.data.data) {
                tmp[join.courseId] = join.progress;
            }

            setJoins(tmp)
            console.log(tmp)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const userFromSessionRaw = sessionStorage.getItem('userLogin')
        if(!userFromSessionRaw) return
        setUserLogin(JSON.parse(userFromSessionRaw))  
        fetchCourse()
    }, [])

    useEffect(() => {
        fetchJoin()
    }, [userLogin])
  return (
    <div className="p-4 h-full relative">
      <div>
        <button
          type="button"
          className="border-2 px-4 py-2 rounded border-gray-300 text-gray-300 hover:scale-110 active:scale-90"
          onClick={() => {
            window.history.back();
          }}
        >
          <b>Quay lại</b>
        </button>
      </div>
      <p className="text-center font-bold text-5xl text-white">{roadmap?.name}</p>
      <div className="w-full mt-2 text-white">
        <p className="text-center text-lg">
          <u>Giảng viên phụ trách lộ trình:</u> <b>{roadmap?.teacherFirstName} {roadmap?.teacherLastName}</b>
        </p>
        <p className="text-center text-sm mt-2">
          <u>Hướng dẫn học tập:</u> <i>{roadmap?.description}</i>
        </p>
      </div>
      <div className="flex flex-col grid-cols-9 p-2 mx-auto md:grid mt-2">
        {courses.map((course, index) => {
          console.log(course.courseId)
          const circleColor = joins[course.courseId] === undefined  
            ? "bg-red-500" 
            : joins[course.courseId] === 100
            ? "bg-green-500" 
            : "bg-yellow-500"; 

          return index % 2 === 0 ? (
            <div key={index} className="flex md:contents flex-row-reverse">
              <div
                className="relative p-4 my-6 text-gray-800 bg-white border-white border rounded-xl col-start-1 col-end-5 mr-auto md:mr-0 md:ml-auto"
              >
                <h3 className="text-lg font-semibold lg:text-xl">{course.courseName}</h3>
                <p className="mt-2 leading-6">{course.teacherFirstName} {course.teacherLastName}</p>
                <span className="absolute text-sm text-indigo-100/75 -top-5 left-2 whitespace-nowrap">
                    {course.creationTime ? new Date(course.creationTime).toISOString().split('T')[0] : ''}                
                </span>
              </div>
              <div className="relative col-start-5 col-end-6 mr-7 md:mx-auto">
                <div className="flex items-center justify-center w-6 h-full">
                  <div className="w-1 h-full bg-white"></div>
                </div>
                <div className={`absolute w-6 h-6 -mt-3 ${circleColor} border-4 border-white rounded-full top-1/2`}></div>
              </div>
            </div>
          ) : (
            <div key={index} className="flex md:contents">
              <div className="relative col-start-5 col-end-6 mr-7 md:mx-auto">
                <div className="flex items-center justify-center w-6 h-full">
                  <div className="w-1 h-full bg-white"></div>
                </div>
                <div className={`absolute w-6 h-6 -mt-3 ${circleColor} border-4 border-white rounded-full top-1/2`}></div>
              </div>
              <div
                className="relative p-4 my-6 text-gray-800 bg-white border-white border rounded-xl col-start-6 col-end-10 mr-auto"
              >
                <h3 className="text-lg font-semibold lg:text-xl">{course.courseName}</h3>
                <p className="mt-2 leading-6">{course.teacherFirstName} {course.teacherLastName}</p>
                <span className="absolute text-sm text-indigo-100/75 -top-5 left-2 whitespace-nowrap">
                    {course.creationTime ? new Date(course.creationTime).toISOString().split('T')[0] : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute top-4 right-4 bg-gray-800 text-white p-4 rounded shadow-md">
        <p className="font-bold text-sm">Chú thích:</p>
        <div className="flex items-center mt-2">
          <span className="w-4 h-4 bg-green-500 rounded-full inline-block mr-2 "></span>
          <p className="text-sm">Đã học xong</p>
        </div>
        <div className="flex items-center mt-2">
          <span className="w-4 h-4 bg-yellow-500 rounded-full inline-block mr-2"></span>
          <p className="text-sm">Đã đăng ký nhưng chưa học xong</p>
        </div>
        <div className="flex items-center mt-2">
          <span className="w-4 h-4 bg-red-500 rounded-full inline-block mr-2"></span>
          <p className="text-sm">Chưa đăng ký</p>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
