'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Check, Copy, Download, ExternalLink } from "lucide-react";
import request from "@/app/axios/axios";
import * as api from "@/app/axios/axios";
import { CertificateDto, formatGrade, formatIsoDate } from "@/app/dtos/progress.dto";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateDto[] | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [downloading, setDownloading] = useState("");

  useEffect(() => {
    api
      .get("/certificate/mine")
      .then((response) => setCertificates(response.data))
      .catch(() => setError("Không thể tải danh sách chứng chỉ. Vui lòng thử lại."));
  }, []);

  const verifyLink = (code: string) => `${window.location.origin}/verify/${code}`;

  const copyLink = async (code: string) => {
    try {
      await navigator.clipboard.writeText(verifyLink(code));
      setCopied(code);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      window.prompt("Sao chép liên kết xác minh:", verifyLink(code));
    }
  };

  // the PDF is only served to its holder, so it is fetched with the token and saved from memory
  const download = async (code: string) => {
    try {
      setDownloading(code);
      const response = await request.get(`/certificate/${code}/pdf`, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `chung-chi-${code}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Không thể tải chứng chỉ lúc này. Vui lòng thử lại.");
    } finally {
      setDownloading("");
    }
  };

  return (
    <main className="section-shell py-12 sm:py-14">
      <p className="eyebrow">Thành tích</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-bk-ink sm:text-5xl">
        Chứng chỉ <span className="text-bk-navy">của tôi</span>
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-bk-slate">
        Chứng chỉ được cấp tự động khi bạn hoàn thành 100% khóa học và đạt điểm trung bình quiz từ 5,0. Mỗi chứng chỉ có mã
        xác minh công khai để nhà tuyển dụng kiểm tra.
      </p>

      {error && <p className="mt-8 rounded-md border-l-2 border-[#C2410C] bg-orange-50 px-4 py-3 text-sm text-[#9A3412]">{error}</p>}

      {certificates && certificates.length === 0 && (
        <div className="bp-grid mt-10 rounded-[10px] border border-dashed border-bk-line p-12 text-center">
          <Award className="mx-auto h-8 w-8 text-bk-slate" strokeWidth={1.5} />
          <p className="mt-4 font-display text-lg font-semibold text-bk-ink">Bạn chưa có chứng chỉ nào</p>
          <p className="mt-1 text-sm text-bk-slate">Hoàn thành một khóa học để nhận chứng chỉ đầu tiên.</p>
          <Link href="/student/mycourse" className="button-primary mt-6">Về khóa học của tôi</Link>
        </div>
      )}

      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {certificates?.map((cert) => (
          <li key={cert.code} className="cut-corner flex flex-col rounded-[10px] border border-bk-gold/60 bg-[#FFFBEF] p-6">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bk-gold">
              <Award className="h-4 w-4" strokeWidth={1.5} /> Chứng chỉ hoàn thành
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-bk-ink">{cert.courseName}</h2>
            <p className="mt-1 text-sm text-bk-slate">Giảng viên {cert.teacherName}</p>

            <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-bk-gold/30 pt-4 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-bk-slate">Ngày cấp</dt>
                <dd className="mt-1 font-semibold text-bk-ink">{formatIsoDate(cert.issuedAt)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-bk-slate">Điểm TB</dt>
                <dd className="mt-1 font-semibold text-bk-ink">{formatGrade(cert.grade)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-bk-slate">Mã</dt>
                <dd className="mt-1 font-mono text-xs font-semibold text-bk-navy">{cert.code}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button type="button" className="button-primary px-4 py-2 text-xs" disabled={downloading === cert.code} onClick={() => download(cert.code)}>
                <Download className="h-3.5 w-3.5" /> {downloading === cert.code ? "Đang tạo PDF..." : "Tải PDF"}
              </button>
              <button type="button" className="button-secondary px-4 py-2 text-xs" onClick={() => copyLink(cert.code)}>
                {copied === cert.code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === cert.code ? "Đã sao chép" : "Sao chép liên kết xác minh"}
              </button>
              <Link href={`/verify/${cert.code}`} className="button-link px-1 text-xs">
                Trang xác minh <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
