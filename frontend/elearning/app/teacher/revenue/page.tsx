'use client';
import { useEffect, useState } from "react";
import Header from "../teacher_components/header";
import Sidebar from "../teacher_components/sidebar";
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import * as request from '@/app/axios/axios';
import RevenueChart from "../teacher_components/chart";
interface CourseJoin {
    GPA: number | null; // GPA associated with the course or null
    courseId: number; // Unique identifier for the course
    courseName: string; // Name of the course
    description: string; // Description of the course
    price: number; // Price of the course
    creationTime: string; // ISO date string of course creation
    dateStart: string; // ISO date string for the course start
    dateComplete: string | null; // ISO date string or null for completion
    progress: number; // Progress percentage (0-100)
    studentId: number; // ID of the student enrolled
    teacherId: number; // ID of the teacher
    teacherFirstName: string; // First name of the teacher
    teacherLastName: string; // Last name of the teacher
}


const RevenuePage = () => {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState)
  const [courses, setCourses] = useState<CourseJoin[]>([]);
  useEffect(() => {
    const userFromSessionRaw = sessionStorage.getItem('userLogin')
    if(!userFromSessionRaw) return
    setUserLogin(JSON.parse(userFromSessionRaw))  
  }, [])
  const fetchCourses = async () => {
      if (userLogin.token === '') return;
      const data = await request.get(`/join/teacherId/${userLogin.id}`);
      if (data.status === 200) {
        //   console.log(data.data);
        setCourses(data.data);
      } else {
        console.log(data.message);
      }
    };
  useEffect(() => {
    if (!userLogin) return;
    fetchCourses();
  }, [userLogin]);
  if (!userLogin) return <>Not Logged in</>;
    console.log("COURSE:", courses);
  
  return (
    <div className="bg-grayBG">
      <div className="grid grid-cols-12 grid-rows-12 min-h-screen gap-4">
        {Header(userLogin.lastName + ' ' + userLogin.firstName)}
        {Sidebar(userLogin.firstName, userLogin.lastName)}
        <div className="bg-white col-span-10 row-span-10 mb-4 rounded-xl shadow-xl">
            <h1 className="bg-green-600 h-20 rounded-t-xl text-center text-3xl text-white font-semibold uppercase p-2 flex items-center justify-center">MY REVENUE</h1>
            <div className="p-6">
                <RevenueChart/>
            </div>        
        </div>
      </div>
    </div>
  );
}
export default RevenuePage;