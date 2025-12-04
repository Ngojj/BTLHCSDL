'use client';

import Image from 'next/image';
import aba from "../../public/aba.jpg";
import shifu from "../../public/techer.jpg";
import teacherimg from "../../public/tichcho.jpeg";
import { useRouter } from 'next/navigation';
// import { userLoginState } from '@/state';
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import { defaultUserLogin } from '@/app/dtos/user.dto';

const Sidebar = (firstName: string, lastName: string) => {
  const router = useRouter();
  const handleBack = () => {
    router.push('/teacher');
  }
  const handleRoadmap = () => {
    router.push('/teacher/roadmap');
  }
  const handleRevenue = () => {
    router.push('/teacher/revenue');
  }
  const handleCourse = () => {
    // router.push('/teacher/courses');
    window.open('/teacher/courses', '_blank');
  }
  
  const handeLogout = () => {
  sessionStorage.removeItem('userLogin')

  router.push('/')
  }
  return (
    <div className="bg-white rounded-xl col-start-1 col-end-3 row-span-10 flex flex-col mb-4 shadow-xl min-h-screen">
      {/* Profile Section */}
      <div className="bg-gray-200 text-center py-6 rounded-t-xl">
        <Image src={teacherimg} alt="Profile Picture" className="w-20 h-20 mx-auto rounded-full" />
        <h2 className="mt-4 text-lg font-semibold text-gray-700">{firstName + ' ' +  lastName}</h2>
        <p className="text-sm text-gray-500">master CS</p>
      </div>

      {/* Menu Section */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center px-6 py-3 hover:bg-gray-300 cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full">🏠</div>
          <span className="ml-4 text-gray-700 font-medium" onClick={handleBack}>Dashboard</span>
        </div>
        <div className="flex items-center px-6 py-3 hover:bg-gray-300 cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full">🌐</div>
          <span className="ml-4 text-gray-700 font-medium" onClick={handleCourse}>Manage courses</span>
        </div>
        <div className="flex items-center px-6 py-3 hover:bg-gray-300 cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full">💲</div>
          <span className="ml-4 text-gray-700 font-medium" onClick={handleRevenue}>My revenue</span>
        </div>
        <div className="flex items-center px-6 py-3 hover:bg-gray-300 cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center bg-yellow-600 text-white rounded-full">🛣️</div>
          <span className="ml-4 text-gray-700 font-medium" onClick={handleRoadmap}>My Roadmap</span>
        </div>
        <div className="flex items-center px-6 py-3 hover:bg-gray-300 cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full">⛔</div>
          <span className="ml-4 text-gray-700 font-medium" onClick={handeLogout}>Log out</span>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-200 text-center py-3 rounded-b-xl">
        <span className="text-sm text-gray-600">Team information</span>
      </div>
    </div>
  );
};

export default Sidebar;
