'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { Award, BookOpen, LayoutGrid, LogOut, Route, Wallet } from 'lucide-react';
import { userLoginState } from '@/state';
import { defaultUserLogin } from '@/app/dtos/user.dto';
import { BrandLogo } from '@/components/BrandMark';
import { getInitials } from '@/components/AvatarDropdown';

type SidebarProps = {
  firstName: string;
  lastName: string;
  courseCount?: number;
  onNavigate?: () => void;
};

const menuItems = [
  { label: 'Dashboard', href: '/teacher', icon: LayoutGrid },
  { label: 'Quản lý khóa học', href: '/teacher/courses', icon: BookOpen, countKey: 'courses' },
  { label: 'Doanh thu', href: '/teacher/revenue', icon: Wallet },
  { label: 'Lộ trình', href: '/teacher/roadmap', icon: Route },
  { label: 'Chứng chỉ', href: '/teacher/certificate', icon: Award },
];

const Sidebar = ({ firstName, lastName, courseCount, onNavigate }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const setUserLogin = useSetRecoilState(userLoginState);
  const fullName = `${firstName} ${lastName}`.trim();

  const handleLogout = () => {
    sessionStorage.removeItem('userLogin')
    setUserLogin(defaultUserLogin)
    router.push('/')
  }

  return (
    <aside className="bp-grid-dark flex h-full w-64 flex-col bg-bk-night text-white">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5" onClick={onNavigate}>
        <BrandLogo inverted className="h-9 w-9" />
        <span className="leading-none">
          <span className="block font-display text-[15px] font-semibold">Bách Khoa</span>
          <span className="mt-1 block font-mono text-[9px] tracking-[0.2em] text-white/50">GIẢNG VIÊN</span>
        </span>
      </Link>

      <div className="mx-4 flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/[0.04] p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bk-blue font-display text-xs font-semibold">
          {getInitials(fullName)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{fullName || 'Giảng viên'}</span>
          <span className="block text-xs text-white/50">Giảng viên hệ thống</span>
        </span>
      </div>

      <p className="px-5 pb-2 pt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Quản lý</p>
      <nav className="flex-1 space-y-0.5 px-3">
        {menuItems.map((item) => {
          const active = item.href === '/teacher' ? pathname === '/teacher' : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                active ? 'bg-white/10 font-semibold text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              <span className="flex-1">{item.label}</span>
              {item.countKey && courseCount !== undefined && (
                <span className="rounded bg-bk-blue/25 px-1.5 font-mono text-[10px] text-[#8FC6F0]">{courseCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-[#F4A27A] transition-colors hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
