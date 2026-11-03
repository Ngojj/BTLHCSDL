"use client"

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import * as api from "@/app/axios/axios";
import { CertificateDto, formatGrade, formatIsoDate } from "@/app/dtos/progress.dto";

// Certificates are issued by the system when a student finishes a course with a passing score,
// so this page is a record for the teacher, not a form.
export default function TeacherCertificates() {
  const [certificates, setCertificates] = useState<CertificateDto[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/certificate/issued")
      .then((response) => setCertificates(response.data))
      .catch(() => setError("Không thể tải danh sách chứng chỉ."));
  }, []);

  const shown = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return certificates ?? [];
    return (certificates ?? []).filter((c) =>
      [c.studentName, c.courseName, c.code].some((value) => value.toLowerCase().includes(keyword))
    );
  }, [certificates, query]);

  return (
    <main className="space-y-5 px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Chứng chỉ đã cấp</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-bk-ink sm:text-4xl">
            Học viên đã <span className="text-bk-navy">hoàn thành khóa học</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-bk-slate">
            Hệ thống tự cấp chứng chỉ khi học viên hoàn thành 100% nội dung và đạt điểm trung bình quiz từ 5,0.
          </p>
        </div>
        <div className="flex w-full items-center gap-2 rounded-md border border-bk-line bg-white px-3 focus-within:border-bk-blue sm:w-72">
          <Search className="h-4 w-4 text-bk-slate" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Tìm chứng chỉ"
            placeholder="Tìm theo tên, khóa học, mã..."
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-bk-slate/70"
          />
        </div>
      </div>

      {error && <p className="rounded-md border-l-2 border-[#C2410C] bg-orange-50 px-4 py-3 text-sm text-[#9A3412]">{error}</p>}

      <section className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-bk-line bg-bk-mist/60 font-mono text-[10px] uppercase tracking-[0.14em] text-bk-slate">
              <tr>
                <th className="px-6 py-3 text-left font-normal">Học viên</th>
                <th className="px-3 py-3 text-left font-normal">Khóa học</th>
                <th className="px-3 py-3 text-right font-normal">Điểm TB</th>
                <th className="px-3 py-3 text-left font-normal">Ngày cấp</th>
                <th className="px-6 py-3 text-left font-normal">Mã xác minh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bk-line">
              {shown.map((cert) => (
                <tr key={cert.code}>
                  <td className="px-6 py-3 font-medium text-bk-ink">{cert.studentName}</td>
                  <td className="px-3 py-3 text-bk-ink">{cert.courseName}</td>
                  <td className="px-3 py-3 text-right font-semibold text-bk-ink">{formatGrade(cert.grade)}</td>
                  <td className="px-3 py-3 text-bk-slate">{formatIsoDate(cert.issuedAt)}</td>
                  <td className="px-6 py-3 font-mono text-xs text-bk-navy">{cert.code}</td>
                </tr>
              ))}
              {certificates && shown.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-sm text-bk-slate">
                    {query ? "Không có chứng chỉ phù hợp." : "Chưa có học viên nào nhận chứng chỉ."}
                  </td>
                </tr>
              )}
              {!certificates && !error && (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-sm text-bk-slate">Đang tải...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
