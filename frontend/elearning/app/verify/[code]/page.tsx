'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Award, Check, X } from "lucide-react";
import BKNavbar from "@/components/BKNavbar";
import Footer from "@/components/Footer";
import request from "@/app/axios/axios";
import { CertificateDto, formatGrade, formatIsoDate } from "@/app/dtos/progress.dto";

type State = { status: "loading" } | { status: "valid"; certificate: CertificateDto } | { status: "missing" };

// Public page: this is where the QR code on a certificate leads.
export default function VerifyCertificate() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(String(params.code ?? "")).toUpperCase();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    request
      .get(`/certificate/verify/${encodeURIComponent(code)}`)
      .then((response) => setState({ status: "valid", certificate: response.data.certificate }))
      .catch(() => setState({ status: "missing" }));
  }, [code]);

  return (
    <>
      <BKNavbar />
      <main className="section-shell py-14 sm:py-20">
        <p className="eyebrow">Xác minh chứng chỉ</p>

        {state.status === "loading" && <p className="mt-6 text-sm text-bk-slate">Đang kiểm tra mã {code}...</p>}

        {state.status === "missing" && (
          <div className="mt-4 max-w-xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <X className="h-6 w-6 text-[#C2410C]" />
            </span>
            <h1 className="mt-5 text-3xl font-semibold text-bk-ink">Không tìm thấy chứng chỉ</h1>
            <p className="mt-3 text-sm leading-6 text-bk-slate">
              Không có chứng chỉ nào ứng với mã <span className="font-mono text-bk-ink">{code}</span>. Hãy kiểm tra lại từng ký tự
              hoặc quét lại mã QR trên bản PDF.
            </p>
            <Link href="/verify" className="button-primary mt-6">Nhập mã khác</Link>
          </div>
        )}

        {state.status === "valid" && (
          <div className="mt-6 grid overflow-hidden rounded-[10px] border border-bk-line md:grid-cols-[0.8fr_1.2fr]">
            <div className="bp-grid-dark flex flex-col justify-between gap-10 bg-bk-navy p-8 text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Check className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-3xl font-semibold leading-tight">Chứng chỉ hợp lệ</h1>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Chứng chỉ này do Bách Khoa E-Learning cấp và vẫn còn trong hệ thống.
                </p>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">Mã xác minh</p>
                <p className="mt-1 font-mono text-lg">{state.certificate.code}</p>
              </div>
            </div>

            <div className="bg-white p-8">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bk-gold">
                <Award className="h-4 w-4" strokeWidth={1.5} /> Chứng chỉ hoàn thành
              </p>
              <p className="mt-5 text-sm text-bk-slate">Chứng nhận</p>
              <p className="font-display text-3xl font-semibold text-bk-ink">{state.certificate.studentName}</p>
              <p className="mt-5 text-sm text-bk-slate">đã hoàn thành khóa học</p>
              <p className="font-display text-2xl font-semibold text-bk-navy">{state.certificate.courseName}</p>

              <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-bk-line pt-5 text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-bk-slate">Ngày cấp</dt>
                  <dd className="mt-1 font-semibold text-bk-ink">{formatIsoDate(state.certificate.issuedAt)}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-bk-slate">Điểm TB quiz</dt>
                  <dd className="mt-1 font-semibold text-bk-ink">{state.certificate.grade === null ? "—" : `${formatGrade(state.certificate.grade)} / 10`}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-bk-slate">Giảng viên</dt>
                  <dd className="mt-1 font-semibold text-bk-ink">{state.certificate.teacherName}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
