'use client';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import * as request from '@/app/axios/axios';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface CourseJoin {
    GPA: number | null;
    courseId: number;
    courseName: string;
    description: string;
    price: number;
    creationTime: string;
    dateStart: string;
    dateComplete: string | null;
    progress: number;
    studentId: number;
    teacherId: number;
    teacherFirstName: string;
    teacherLastName: string;
}

interface CourseData {
    courseId: number;
    revenueByDay: number;
    date: string;
}
const transformToCourseData = (courses: CourseJoin[]): CourseData[] => {
  // Use a map to accumulate revenue by course and date
  const groupedData: { [key: string]: { courseId: number; revenueByDay: number; date: string } } = {};

  courses.forEach((course) => {
    const key = `${course.courseId}-${course.dateStart}`; // Unique key for course ID and date
    if (!groupedData[key]) {
      groupedData[key] = {
        courseId: course.courseId,
        revenueByDay: 0,
        date: course.dateStart,
      };
    }

    // Add revenue for the specific course and date
    groupedData[key].revenueByDay += course.price;
  });

  // Convert the grouped data into an array
  return Object.values(groupedData);
};
const fillMissingDates = (data: CourseData[], startDate: Date, endDate: Date): CourseData[] => {
  const courseIds = Array.from(new Set(data.map((d) => d.courseId)));
  const dateSet = new Set(
    Array.from({ length: (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1 })
      .map((_, i) => {
        const date = new Date(new Date(startDate).getTime() + i * (1000 * 60 * 60 * 24));
        return date.toISOString().split("T")[0];
      })
  );

  const filledData: CourseData[] = [];

  courseIds.forEach((courseId) => {
    const courseData = data.filter((d) => d.courseId === courseId);
    dateSet.forEach((date) => {
      const existingData = courseData.find((d) => d.date === date);
      filledData.push(
        existingData || { courseId, date, revenueByDay: 0 }
      );
    });
  });

  return filledData.sort((a, b) => (a.date < b.date ? -1 : 1));
};

const RevenueChart = () => {
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

    const minDate = new Date(Math.min(...courses.map(course => new Date(course.dateStart).getTime())));
    const maxDate = new Date(Math.max(...courses.map(course => new Date(course.dateStart).getTime())));
    const labels = [];
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
        labels.push(d.toISOString().slice(0, 10));
    }
    const data = transformToCourseData(courses);
    console.log("data", data);
    const filledData = fillMissingDates(data, minDate, maxDate);
    const groupedByCourse = filledData.reduce<{ [key: number]: { dates: string[]; revenues: number[] } }>(
    (acc, curr) => {
      if (!acc[curr.courseId]) {
        acc[curr.courseId] = { dates: [], revenues: [] };
      }
      acc[curr.courseId].dates.push(curr.date);
      acc[curr.courseId].revenues.push(curr.revenueByDay);
      return acc;
    },
    {}
    );
    const getRandomCyanToLightBlueShade = () => {
        const red = Math.floor(Math.random() * 100); // Red value (0 to 99)
        const green = Math.floor(Math.random() * 56) + 200; // Green value (200 to 255)
        const blue = Math.floor(Math.random() * 56) + 200; // Blue value (200 to 255)
        return `rgb(${red}, ${green}, ${blue})`;
    };
    const datasets = Object.keys(groupedByCourse).map((courseId) => ({
        label: `${courses.find((c) => c.courseId === Number(courseId))?.courseName}`,
        data: groupedByCourse[Number(courseId)].revenues,
        borderColor: getRandomCyanToLightBlueShade(),
        borderWidth: 2,
        tension: 0.4,
        borderDash: [] as number[], // Add borderDash property
    }));

    const dataConfig = {
        labels: Array.from(new Set(filledData.map((d) => d.date))),
        datasets,
    };
    // Chart.js Options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: { raw: number }) {
                        return `Revenue: ${context.raw.toLocaleString()} VND`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Ngày",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Tổng doanh thu",
                },
                beginAtZero: true,
            },
        },
    };
     // Calculate total revenue by day
    const dates = Array.from(new Set(filledData.map((d) => d.date))).sort();
    const totalRevenueByDay = dates.map((date) =>
        filledData
        .filter((d) => d.date === date)
        .reduce((sum, curr) => sum + curr.revenueByDay, 0)
    );
    datasets.push({
        label: "Tổng doanh thu ngày",
        data: totalRevenueByDay,
        borderColor: "green", // Distinct color for total revenue
        borderWidth: 3,
        tension: 0.1,
        borderDash: [10, 5], // Dashed line for total revenue
    });
    return (
        <div className="bg-white rounded-lg p-6 h-max">
            <h2 className="text-2xl font-bold mb-20 text-center">Doanh thu theo ngày</h2>
            <Line data={dataConfig} options={options} />
        </div>
    );
};

export default RevenueChart;
