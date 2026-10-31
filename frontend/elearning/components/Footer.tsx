import Link from "next/link";
import { BrandLogo } from "./BrandMark";

const columns = [
  {
    title: "Học tập",
    links: [
      { label: "Khóa học", href: "/#khoa-hoc" },
      { label: "Lộ trình", href: "/student/roadmap" },
      { label: "Bảng điểm", href: "/student/tablescore" },
    ],
  },
  {
    title: "Giảng viên",
    links: [
      { label: "Dashboard", href: "/teacher" },
      { label: "Tạo khóa học", href: "/teacher/create" },
      { label: "Doanh thu", href: "/teacher/revenue" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-bk-line bg-white">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandLogo className="h-7 w-7" />
            <span className="font-display text-[15px] font-semibold text-bk-ink">Bách Khoa E-Learning</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-bk-slate">
            Trường Đại học Bách Khoa — ĐHQG TP.HCM. Bài tập lớn môn Hệ cơ sở dữ liệu.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bk-slate">{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-bk-blue transition-colors hover:text-bk-navy">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bk-slate">Liên hệ</p>
          <p className="mt-4 text-sm leading-6 text-bk-ink">268 Lý Thường Kiệt, Q.10, TP.HCM</p>
          <p className="mt-1 font-mono text-xs text-bk-slate">elearning@hcmut.edu.vn</p>
        </div>
      </div>

      <div className="section-shell flex items-center justify-between border-t border-bk-line py-5 font-mono text-[10px] uppercase tracking-[0.16em] text-bk-slate">
        <span>© 2026 HCMUT · CO2013</span>
        <span>BK-ELN · REV. 02</span>
      </div>
    </footer>
  );
};

export default Footer;
