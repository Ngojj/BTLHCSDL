import Image from "next/image";
import logoBK from "@/app/public/logoBK.png";

type BrandMarkProps = {
  subtitle?: string;
  inverted?: boolean;
};

// Logo Trường ĐH Bách Khoa — ĐHQG TP.HCM; nền tối thì đặt trên ô trắng
export function BrandLogo({ inverted = false, className = "h-8 w-8" }: { inverted?: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${
        inverted ? "rounded-md bg-white p-1" : ""
      } ${className}`}
    >
      <Image src={logoBK} alt="Logo Trường Đại học Bách Khoa" className="h-full w-full object-contain" priority />
    </span>
  );
}

export default function BrandMark({ subtitle = "E-LEARNING", inverted = false }: BrandMarkProps) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandLogo inverted={inverted} />
      <span className="leading-none">
        <span className={`block font-display text-[15px] font-semibold ${inverted ? "text-white" : "text-bk-ink"}`}>
          Bách Khoa
        </span>
        {subtitle && (
          <span
            className={`mt-1 block font-mono text-[9px] tracking-[0.2em] ${
              inverted ? "text-white/60" : "text-bk-slate"
            }`}
          >
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
