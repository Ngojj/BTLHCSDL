'use client';

import { SectionDto } from '@/app/dtos/section.dto';
import { userLoginState } from '@/state';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as request from "@/app/axios/axios";
import ReactDOM from 'react-dom';

function CourseCard(props: any) {
  const [modal, setModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [section, setSection] = useState<SectionDto[]>([]);
  const user = useRecoilValue(userLoginState);

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

  const handleBuyNow = () => {
    setModal(false);
    setPaymentModal(true);
  };

  const handlePaid = async (courseId: string) => {
    try {
      const response = await request.post('/payment/create-link', {
        courseId: Number(courseId),
        studentId: Number(user.id),
        price: props.price,
        courseName: props.courseName
      });
      
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
      <div
        className="group relative flex min-h-[380px] w-full cursor-pointer flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        onClick={toggleModal}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            src={
              props.image ||
              'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'
            }
            alt="Course preview"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/15 to-transparent" />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-800">
              Khóa học
            </span>
            <span className="rounded-full bg-sky-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              {props.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              {props.courseName}
            </h2>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              Chi tiết
            </span>
          </div>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
            {props.description}
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Giảng viên
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">{props.teacher}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Trải nghiệm
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Xem đề cương trước khi đăng ký và theo dõi nội dung từng chương rõ ràng hơn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {modal && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
              <div className="border-b border-slate-200 bg-slate-900 px-6 py-6 text-white">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                      Tổng quan khóa học
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold">{props.courseName}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                      Xem trước các chương học để nắm được cấu trúc nội dung và chuẩn bị tốt hơn trước khi đăng ký.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                    onClick={() => setModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="max-h-[60vh] space-y-3 overflow-y-auto p-6">
                  {section?.length > 0 ? section.map((s, index) => (
                    <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                        Chương {index + 1}
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">{s.name}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-600">Chưa có nội dung chi tiết cho khóa học này.</p>
                  )}
                </div>

                <div className="border-t border-slate-200 bg-slate-50 p-6 lg:border-l lg:border-t-0">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Học phí
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                      {props.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </p>
                    <div className="mt-5 space-y-3 text-sm text-slate-600">
                      <p>Giảng viên: <span className="font-medium text-slate-800">{props.teacher}</span></p>
                      <p>Nội dung được chia theo từng chương để bạn dễ theo dõi tiến độ.</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    <button
                      type="button"
                      className="button-primary"
                      onClick={handleBuyNow}
                    >
                      Đăng ký ngay
                    </button>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => setModal(false)}
                    >
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
          <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm" onClick={() => setPaymentModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-7 shadow-2xl">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                Thanh toán
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                Xác nhận đăng ký khóa học
              </h3>
              <div className="mt-6 space-y-4 rounded-3xl bg-slate-50 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Số tiền</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {props.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Tài khoản thanh toán</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {user.bankAccount} - {user.bankName} - {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  className="button-secondary flex-1"
                  onClick={() => setPaymentModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="button-primary flex-1"
                  onClick={() => handlePaid(props.id)}
                >
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
