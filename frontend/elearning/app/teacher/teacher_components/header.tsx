'use client';

// import { FiBookOpen } from "react-icons/fi";
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";


const Header = (teacherName: string) => {
  const router = useRouter();

  return (
    <div className="bg-hcmutDarkBlue text-white col-span-12 row-span-2 grid grid-cols-3 items-center h-40">
      <div className="flex flex-col items-center">
        {/* <FiBookOpen className="text-5xl" /> */}
        <h1 className="font-mono font-extrabold text-4xl m-4">EZLearn</h1>
      </div>
      <div className="text-center">
        <h1 className="font-mono font-extrabold text-3xl m-4">Welcome, {teacherName}</h1>
        <p>Your education is your power, create more and more</p>
        <Button className="bg-hcmutLightBlue border-1 border-white m-4"
          onClick={
            () => {
              router.push('/teacher/create')
              // window.open('/teacher/create', '_blank');
            }
          }
        >
          Tạo khóa học</Button>
      </div>
      <div className="flex justify-center">
        <h1 className="font-mono font-extrabold text-4xl m-4">DATABASE(CO2013)</h1>
      </div>
    </div>
  );
};

export default Header;
