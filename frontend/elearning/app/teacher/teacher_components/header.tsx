'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

const Header = (teacherName: string) => {
  const router = useRouter();

  return (
    <div className="col-span-12 rounded-[30px] border border-slate-200 bg-white px-8 py-7 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
            Teacher Dashboard
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Xin chào, {teacherName}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Quản lý khóa học, doanh thu, số lượng học viên và lộ trình giảng dạy trong một không gian trực quan hơn.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            className="button-primary"
            onClick={() => {
              router.push('/teacher/create')
            }}
          >
            Tạo khóa học
          </Button>
          <Button
            className="button-secondary"
            onClick={() => {
              router.push('/teacher/roadmap')
            }}
          >
            Tạo lộ trình
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
