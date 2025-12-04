'use client';

import { userLoginState } from '@/state';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import * as request from '@/app/axios/axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
interface Course {
  courseId: number;
  courseName: string;
  language: string;
  description: string;
  price: string;
  averageQuizScore: string;
  topics: string[];
  creationTime: string;
}

const ManageCourses = () => {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState)
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    if (userLogin.token === '') return;
    const data = await request.get(`/course/teacherId/${userLogin.id}`);
    if (data.status === 200) {
      console.log(data.data);
      setCourses(data.data);
    } else {
      console.log(data.message);
    }
  }
  useEffect(() => {
    const userFromSessionRaw = sessionStorage.getItem('userLogin')
    if(!userFromSessionRaw) return
    setUserLogin(JSON.parse(userFromSessionRaw))  
  }, [])

  useEffect(() => {
    if (!userLogin) return
    fetchCourses();
  }, [userLogin]);

  const handleDeleteCourse = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name} course?`)) {

      // Delete course
      const res = await request.del(`/course/delete/id/${id}`);
      console.log(res);
      if (res.message === 'success') {
        setCourses(courses.filter((course) => course.courseId !== id));
      }
      else {
        alert('Failed to delete course');
      }
    }
  };

  if (!userLogin) return <>Loading...</>;
  const router = useRouter()
  return (
    <div className="manage-courses-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="rounded-lg mt-10 text-center text-2xl/9 font-bold tracking-tight text-white bg-hcmutDarkBlue">
            Manage Courses
          </h2>

      {courses.length > 0 ? (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Course Name</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Language</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Price (coins)</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Created At</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseId}>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{course.courseName}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{course.language}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{course.price}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{course.creationTime}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={async () => await handleDeleteCourse(course.courseId, course.courseName)}
                    style={{
                      background: 'red',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      <Button className='mt-4 bg-hcmutDarkBlue' onClick={
        () => {
          router.push('/teacher')
        }
      }>Quay lại</Button>
    </div>
  );
};

export default ManageCourses;
