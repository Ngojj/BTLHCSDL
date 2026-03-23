'use client';

import Header from './teacher_components/header';
import Sidebar from './teacher_components/sidebar';
import CoursesContent from './teacher_components/courses';
import RevenueChart from './teacher_components/chart';
import RegistrationChart from './teacher_components/studentchart';
import { useRecoilState } from 'recoil';
import { userLoginState } from '@/state';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DashBoard = () => {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState)
  const router = useRouter()

  useEffect(() => {
    const userFromSessionRaw = sessionStorage.getItem('userLogin')
    if(!userFromSessionRaw) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userFromSessionRaw)
    setUserLogin(parsedUser)

    if (String(parsedUser.role || '').toLowerCase() !== 'teacher') {
      router.push('/')
    }
  }, [router, setUserLogin])

  return (
    <main className="section-shell py-8">
      <div className="grid min-h-screen grid-cols-12 gap-6">
        <div className="col-span-12">
          {Header(userLogin.lastName + ' ' + userLogin.firstName)}
        </div>

        {Sidebar(userLogin.firstName, userLogin.lastName)}

        <section className="col-span-10 grid gap-6">
          {CoursesContent(userLogin.id)}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className='rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm'>
              <RevenueChart/>
            </div>
            <div className='rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm'>
              <RegistrationChart />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashBoard;
