'use client'; // Add this line at the top to mark this component as a client component
import { SectionDto } from '@/app/dtos/section.dto';
import { userLoginState } from '@/state';
import axios from 'axios';
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
      alert('Không thể mở khóa hoặc khóa học không có nội dung để hiển thị!');
    }
  };

  const handleBuyNow = () => {
    setModal(false);
    setPaymentModal(true);
  };

  const handlePaid = async (courseId: string) => {
    try {
      const response = await request.post('/join/create', {
        courseId,
        studentId: user.id
      });
      setPaymentModal(false);
      alert("Thanh toán thành công!");
    } catch (e: any) {
      if (e.response.data.data === "Join already exists") {
        alert("Bạn đã tham gia khóa học này!");
        setPaymentModal(false);
      } else {
        alert("Không thể thanh toán vào lúc này! Vui lòng thử lại!");
      }
    }
  };

  return (
    <>
      {/* Entire Card is Clickable */}
      <div
        className="w-[300px] flex-shrink-0 rounded shadow-lg border border-gray-200 bg-white cursor-pointer"
        onClick={toggleModal} // Apply onClick to the entire card
      >
        <img
          className="w-full h-48 object-cover"
          src={
            props.image ||
            'https://vnn-imgs-f.vgcloud.vn/2022/03/07/08/7-khoa-hoc-truc-tuyen-ve-khoa-hoc-du-lieu-tot-nhat-cho-sinh-vien.jpg'
          }
          alt="Course preview"
        />
        <div className="p-4">
          <h2 className="font-bold text-lg mb-2">{props.courseName}</h2>
          <p className="text-gray-500 text-sm">{props.description}</p>
          <p className="text-gray-600 text-sm">{props.teacher}</p>
          <p className="font-semibold text-xl text-gray-800">
            {props.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </p>
        </div>
      </div>

      {/* Modal for Course Details */}
      {modal &&
      ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setModal(false)}></div>
          <div
            id="default-modal"
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-96 bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {props.courseName}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                  onClick={() => setModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="p-5 space-y-4">
                {section?.map((s, index) => (
                  <p key={index} className="text-base text-gray-600 dark:text-gray-400">
                    <b>Chương {index + 1}: {s.name}</b>
                  </p>
                ))}
              </div>
              <div className="flex justify-center p-5 border-t border-gray-200 dark:border-gray-600 space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  onClick={() => setModal(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={handleBuyNow}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body // Render the modal to the <body>
      )}


      {/* Payment Modal */}
      {paymentModal && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setPaymentModal(false)}></div>
          <div
            id="payment-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen"
          >
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <div className="p-5 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Thanh toán qua tài khoản ngân hàng
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Số tiền: {props.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </p>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Tài khoản: <b>{user.bankAccount}</b> - <b>{user.bankName}</b> - <b>{user.firstName} {user.lastName}</b>
                </p>
              </div>
              <div className="flex justify-center p-5 border-t border-gray-200 dark:border-gray-600 space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:scale-110"
                  onClick={() => setPaymentModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:scale-110"
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
