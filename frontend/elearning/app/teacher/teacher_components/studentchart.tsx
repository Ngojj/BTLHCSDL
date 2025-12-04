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
    studentCount: number;
    date: string;
}

const transformToCourseData = (courses: CourseJoin[]): CourseData[] => {
  // Use a map to accumulate student registrations by course and date
  const groupedData: { [key: string]: { courseId: number; studentCount: number; date: string } } = {};

  courses.forEach((course) => {
    const key = `${course.courseId}-${course.dateStart}`; // Unique key for course ID and date
    if (!groupedData[key]) {
      groupedData[key] = {
        courseId: course.courseId,
        studentCount: 0,
        date: course.dateStart,
      };
    }

    // Add student for the specific course and date
    groupedData[key].studentCount += 1;
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
        existingData || { courseId, date, studentCount: 0 }
      );
    });
  });

  return filledData.sort((a, b) => (a.date < b.date ? -1 : 1));
};

const RegistrationChart = () => {
    const [userLogin, setUserLogin] = useRecoilState(userLoginState);
    const [courses, setCourses] = useState<CourseJoin[]>([]);
    
    useEffect(() => {
        const userFromSessionRaw = sessionStorage.getItem('userLogin')
        if(!userFromSessionRaw) return
        setUserLogin(JSON.parse(userFromSessionRaw));  
    }, []);

    const fetchCourses = async () => {
        if (userLogin.token === '') return;
        const data = await request.get(`/join/teacherId/${userLogin.id}`);
        if (data.status === 200) {
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

    // Find min and max dates
    const minDate = new Date(Math.min(...courses.map(course => new Date(course.dateStart).getTime())));
    const maxDate = new Date(Math.max(...courses.map(course => new Date(course.dateStart).getTime())));

    const labels = [];
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
        labels.push(d.toISOString().slice(0, 10));
    }

    const data = transformToCourseData(courses);
    const filledData = fillMissingDates(data, minDate, maxDate);

    const groupedByCourse = filledData.reduce<{ [key: number]: { dates: string[]; studentCounts: number[] } }>(
        (acc, curr) => {
            if (!acc[curr.courseId]) {
                acc[curr.courseId] = { dates: [], studentCounts: [] };
            }
            acc[curr.courseId].dates.push(curr.date);
            acc[curr.courseId].studentCounts.push(curr.studentCount);
            return acc;
        },
        {}
    );
    const getRandomDarkBlueToPurpleShade = () => {
        const red = Math.floor(Math.random() * 56) + 100; // Red value (100 to 155)
        const green = Math.floor(Math.random() * 50); // Green value (0 to 49)
        const blue = Math.floor(Math.random() * 100) + 155; // Blue value (155 to 255)
        return `rgb(${red}, ${green}, ${blue})`;
    };
    // Dataset for each course
    const datasets = Object.keys(groupedByCourse).map((courseId) => ({
        label: `${courses.find((c) => c.courseId === Number(courseId))?.courseName}`,
        data: groupedByCourse[Number(courseId)].studentCounts,
        borderColor: getRandomDarkBlueToPurpleShade(),
        borderWidth: 2,
        tension: 0.4,
        borderDash: [] as number[], // Add borderDash property
    }));

    // Calculate total student registrations by day
    const dates = Array.from(new Set(filledData.map((d) => d.date))).sort();
    const totalStudentsByDay = dates.map((date) =>
        filledData
        .filter((d) => d.date === date)
        .reduce((sum, curr) => sum + curr.studentCount, 0)
    );

    // Add a dataset for total student registrations
    datasets.push({
        label: "Tổng lượt đăng kí ngày",
        data: totalStudentsByDay,
        borderColor: "#FF5733", // Distinct color for total students
        borderWidth: 3,
        tension: 0.1,
        borderDash: [10, 5], // Dashed line for total students
    });

    // Chart data configuration
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
                        return `Students: ${context.raw}`;
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
                    text: "Số lượng học sinh",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="bg-white rounded-lg p-6 h-max">
            <h2 className="text-2xl font-bold mb-20 text-center">Số lượng học sinh đăng kí</h2>
            <Line data={dataConfig} options={options} />
        </div>
    );
};

export default RegistrationChart;
