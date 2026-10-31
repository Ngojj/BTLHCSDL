import Link from "next/link";
import { ReactNode } from "react";
import BrandMark from "./BrandMark";

type AuthPanelProps = {
  eyebrow: string;
  title: ReactNode;
  points: string[];
};

// Khối navy bên trái của trang đăng nhập / đăng ký
export default function AuthPanel({ eyebrow, title, points }: AuthPanelProps) {
  return (
    <section className="bp-grid-dark relative hidden overflow-hidden bg-bk-navy px-12 py-10 text-white lg:flex lg:flex-col">
      <Link href="/" aria-label="Trang chủ">
        <BrandMark inverted subtitle="" />
      </Link>

      <svg viewBox="0 0 320 420" className="pointer-events-none absolute right-0 top-24 h-[70%] text-[#8FC6F0]" fill="none" aria-hidden="true">
        <path d="M120 20 300 380" stroke="currentColor" strokeOpacity="0.7" />
        <path d="M120 20 0 300" stroke="currentColor" strokeOpacity="0.7" />
        <path d="M120 140 245 300H0" stroke="currentColor" />
        <path d="M120 140 0 300" stroke="currentColor" />
        <path d="M120 20v360" stroke="currentColor" strokeOpacity="0.5" strokeDasharray="3 4" />
        <circle cx="120" cy="20" r="4" stroke="currentColor" fill="#032B91" />
        <circle cx="120" cy="140" r="4" stroke="currentColor" fill="#032B91" />
        <text x="134" y="12" fill="currentColor" fontSize="10" fontFamily="monospace" opacity="0.8">A · 60°</text>
      </svg>

      <div className="relative my-auto max-w-md py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">{eyebrow}</p>
        <h2 className="mt-5 text-5xl font-semibold leading-[1.08] tracking-tight">{title}</h2>
        <ol className="mt-10 border-t border-white/15">
          {points.map((point, index) => (
            <li key={point} className="flex gap-5 border-b border-white/15 py-3.5 text-sm text-white/90">
              <span className="font-mono text-[11px] text-white/50">{String(index + 1).padStart(2, "0")}</span>
              {point}
            </li>
          ))}
        </ol>
      </div>

      <div className="relative flex items-end gap-4" aria-hidden="true">
        <div className="w-56 rounded-[10px] bg-white p-4 text-bk-ink">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bk-slate">Quiz chương 3 · CO2013</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="font-display text-3xl font-semibold">
              10<span className="text-sm text-bk-slate">/10</span>
            </p>
            <span className="font-mono text-[10px] tracking-[0.12em] text-bk-gold">★ TỐI ĐA</span>
          </div>
        </div>
        <div className="mb-8 w-48 rounded-[10px] border border-white/10 bg-bk-night p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/60">Tiến độ tuần này</p>
          <div className="mt-3 flex gap-1.5">
            {[1, 1, 0.6, 1, 0.2, 0.2, 0.2].map((o, i) => (
              <span key={i} className="h-5 flex-1 rounded-[3px] bg-bk-blue" style={{ opacity: o }} />
            ))}
          </div>
          <p className="mt-2 text-xs text-white/80">4 / 7 ngày có học</p>
        </div>
      </div>
    </section>
  );
}
