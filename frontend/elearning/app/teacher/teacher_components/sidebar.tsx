'use client';

import Image from 'next/image';
import teacherimg from "../../public/tichcho.jpeg";
import { useRouter } from 'next/navigation';

const Sidebar = (firstName: string, lastName: string) => {
  const router = useRouter();

  const menuItems = [
    { label: 'Dashboard', action: () => router.push('/teacher') },
    { label: 'Quản lý khóa học', action: () => window.open('/teacher/courses', '_blank') },
    { label: 'Doanh thu', action: () => router.push('/teacher/revenue') },
    { label: 'Lộ trình', action: () => router.push('/teacher/roadmap') },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem('userLogin')
    router.push('/')
  }

  return (
    <aside className="col-start-1 col-end-3 row-span-11 rounded-[30px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6 text-center">
        <Image src={teacherimg} alt="Profile Picture" className="mx-auto h-20 w-20 rounded-full object-cover" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900">{firstName} {lastName}</h2>
        <p className="text-sm text-slate-500">Giảng viên hệ thống e-learning</p>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-50"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
