'use client';

import { SectionDto } from '@/app/dtos/section.dto';
import { userLoginState } from '@/state';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as request from "@/app/axios/axios";
import ReactDOM from 'react-dom';
import { ArrowRight, X } from 'lucide-react';

const glyphs: [string, string][] = [
  ['cơ sở dữ liệu', 'SQL'],
  ['database', 'SQL'],
  ['giải thuật', 'O(n log n)'],
  ['machine learning', 'ŷ = σ(wx)'],
  ['học máy', 'ŷ = σ(wx)'],
  ['mạng', 'TCP/IP'],
  ['hệ điều hành', '$ sudo'],
  ['kiến trúc', '0x1F'],
];

export const courseGlyph = (name: string) => {
  const lower = String(name || '').toLowerCase();
  const match = glyphs.find(([keyword]) => lower.includes(keyword));
  if (match) return match[1];
  return String(name || 'BK')
    .split(' ')
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

export const formatVnd = (value: number | string) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return `${value} ₫`;
  return `${amount.toLocaleString('vi-VN')} ₫`;
};

const languageCode = (language?: string) => {
  const lower = String(language || '').toLowerCase();
  if (!lower) return 'VI';
  if (lower.startsWith('en') || lower.includes('anh')) return 'EN';
  if (lower.startsWith('vi') || lower.includes('việt')) return 'VI';
  return lower.slice(0, 2).toUpperCase();
};

function CourseCard(props: any) {
  const [modal, setModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [section, setSection] = useState<SectionDto[]>([]);
  const user = useRecoilValue(userLoginState);

  const featured = Boolean(props.featured);
  const year = props.creationTime ? new Date(props.creationTime).getFullYear() : null;
  const meta = [`#${String(props.id).padStart(4, '0')}`, languageCode(props.language), year].filter(Boolean).join(' · ');
  const avgQuiz = Number(props.avgQuiz || 0);

  const toggleModal = async () => {
    try {
      const response = await request.get(`/section/course/${props.id}`);
      setSection(response.data);
      setModal(true);
    } catch (error) {
      console.log(error);
      alert('Không thể mở khóa học hoặc khóa học chưa có nội dung hiển thị.');
    }
  };

  const handleBuyNow = async () => {
    if (!user.id) {
      window.location.assign("/login");
      return;
    }
    setModal(false);

    // free courses are joined directly; paid ones go through the payment gateway
    if (Number(props.price) === 0) {
      try {
        await request.post("/join/create", { courseId: Number(props.id) });
        window.location.assign("/student/mycourse");
      } catch (e: any) {
        alert(e?.response?.data?.message || "Không thể đăng ký khóa học lúc này. Vui lòng thử lại.");
      }
      return;
    }
    setPaymentModal(true);
  };

  const handlePaid = async (courseId: string) => {
    try {
      // only the course id is sent: the server takes the price from the database and the student from the token
      const response = await request.post('/payment/create-link', { courseId: Number(courseId) });

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        alert("Không nhận được link thanh toán.");
        setPaymentModal(false);
      }
    } catch (e: any) {
      console.error("Payment error:", e);
      const errorMessage = e.response?.data?.message || "Không thể tạo link thanh toán vào lúc này. Vui lòng thử lại.";
      alert(errorMessage);
      setPaymentModal(false);
    }
  };

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        className={`group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[10px] border bg-white text-left transition duration-200 hover:-translate-y-0.5 ${
          featured ? 'border-bk-navy' : 'border-bk-line hover:border-bk-navy'
        }`}
        onClick={toggleModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter') toggleModal();
        }}
      >
        <div
          className={`relative flex flex-col justify-between overflow-hidden px-5 pb-4 pt-4 ${
            featured ? 'bp-grid-dark h-52 bg-bk-navy text-white' : 'bp-grid h-32 border-b border-bk-line bg-bk-mist text-bk-navy'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${featured ? 'text-white/70' : 'text-bk-slate'}`}>
              {meta}
            </span>
            {featured && (
              <span className="rounded-md border border-bk-gold/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bk-gold">
                Nổi bật
              </span>
            )}
          </div>
          <span className={`font-display font-medium leading-none ${featured ? 'text-6xl' : 'text-3xl'}`}>
            {courseGlyph(props.courseName)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-semibold text-bk-ink">{props.courseName}</h3>
          <p className="mt-1 text-xs text-bk-slate">
            {[props.teacher, props.language].filter(Boolean).join(' · ')}
          </p>
          <p className="mb-5 mt-3 line-clamp-2 text-sm leading-6 text-bk-slate">
            {props.description || 'Chưa có mô tả cho khóa học này.'}
          </p>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-bk-line pt-4">
            <span className="font-display text-lg font-semibold text-bk-navy">
              {formatVnd(props.price)}
            </span>
            {avgQuiz > 0 ? (
              <span className="text-xs text-bk-slate">
                Quiz TB <span className="font-semibold text-bk-ink">{avgQuiz.toFixed(1).replace('.', ',')}</span>/10
              </span>
            ) : (
              <span className="button-link text-xs">
                Xem khóa học <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </div>
        </div>
      </article>

      {modal && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-40 bg-bk-ink/50" onClick={() => setModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-3xl overflow-hidden rounded-[10px] border border-bk-line bg-white">
              <div className="bp-grid-dark bg-bk-navy px-6 py-6 text-white">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
                      {meta} · Đề cương
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">{props.courseName}</h3>
                    <p className="mt-2 text-sm text-white/70">Giảng viên {props.teacher}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Đóng"
                    className="rounded-md border border-white/20 p-2 transition hover:bg-white/10"
                    onClick={() => setModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
                <div className="max-h-[55vh] overflow-y-auto p-6">
                  <p className="eyebrow">Nội dung khóa học · {section?.length || 0} section</p>
                  {section?.length > 0 ? (
                    <ol className="mt-4 divide-y divide-bk-line border-y border-bk-line">
                      {section.map((s, index) => (
                        <li key={index} className="flex items-baseline gap-4 py-3">
                          <span className="font-mono text-xs text-bk-blue">{String(index + 1).padStart(2, '0')}</span>
                          <span className="text-sm font-medium text-bk-ink">{s.name}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-4 text-sm text-bk-slate">Chưa có nội dung chi tiết cho khóa học này.</p>
                  )}
                </div>

                <div className="flex flex-col border-t border-bk-line bg-bk-mist p-6 lg:border-l lg:border-t-0">
                  <p className="eyebrow text-bk-slate">Học phí</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-bk-navy">
                    {formatVnd(props.price)}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-bk-slate">
                    Nội dung được chia theo từng section, kèm quiz chấm điểm ngay sau mỗi chương.
                  </p>
                  <div className="mt-6 flex flex-col gap-2.5 lg:mt-auto">
                    <button type="button" className="button-primary" onClick={handleBuyNow}>
                      Đăng ký ngay <ArrowRight className="h-4 w-4" />
                    </button>
                    <button type="button" className="button-secondary" onClick={() => setModal(false)}>
                      Để sau
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {paymentModal && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-50 bg-bk-ink/50" onClick={() => setPaymentModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-md rounded-[10px] border border-bk-line bg-white p-7">
              <p className="eyebrow">Thanh toán</p>
              <h3 className="mt-2 text-2xl font-semibold text-bk-ink">Xác nhận đăng ký khóa học</h3>
              <p className="mt-1 text-sm text-bk-slate">{props.courseName}</p>
              <dl className="mt-6 divide-y divide-bk-line border-y border-bk-line text-sm">
                <div className="flex items-center justify-between py-3">
                  <dt className="text-bk-slate">Số tiền</dt>
                  <dd className="font-display text-lg font-semibold text-bk-navy">{formatVnd(props.price)}</dd>
                </div>
                <div className="flex items-start justify-between gap-6 py-3">
                  <dt className="shrink-0 text-bk-slate">Tài khoản thanh toán</dt>
                  <dd className="text-right font-mono text-xs leading-5 text-bk-ink">
                    {user.bankAccount} · {user.bankName}<br />{user.firstName} {user.lastName}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex gap-3">
                <button type="button" className="button-secondary flex-1" onClick={() => setPaymentModal(false)}>
                  Hủy
                </button>
                <button type="button" className="button-primary flex-1" onClick={() => handlePaid(props.id)}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default CourseCard;
