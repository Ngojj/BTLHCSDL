'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import * as request from '@/app/axios/axios';
import Link from 'next/link';

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        const processPayment = async () => {
            const status = searchParams.get('status');
            const courseId = searchParams.get('courseId');
            const studentId = searchParams.get('studentId');
            
            // payOS cũng trả về mã lỗi trong URL (vd: code=00 là thành công)
            const code = searchParams.get('code');
            const cancel = searchParams.get('cancel');

            if (status === 'CANCEL' || cancel === 'true') {
                setMessage('Thanh toán đã bị hủy.');
                setIsSuccess(false);
                return;
            }

            if (status === 'PAID' || code === '00') {
                if (courseId && studentId) {
                    try {
                        const response = await request.post('/join/create', {
                            courseId: Number(courseId),
                            studentId: Number(studentId)
                        });
                        setMessage('Thanh toán thành công! Bạn đã tham gia khóa học.');
                        setIsSuccess(true);
                    } catch (error: any) {
                        console.error('Error joining course:', error);
                        setMessage(error.response?.data?.message || 'Thanh toán thành công nhưng có lỗi khi tham gia khóa học.');
                        setIsSuccess(true); // Vẫn tính là thanh toán thành công
                    }
                } else {
                    setMessage('Thanh toán thành công nhưng thiếu thông tin khóa học.');
                    setIsSuccess(true);
                }
            } else {
                setMessage('Trạng thái thanh toán không hợp lệ.');
                setIsSuccess(false);
            }
        };

        processPayment();
    }, [searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
                <div className="text-center">
                    {isSuccess === true && (
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                    {isSuccess === false && (
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                        Trạng thái thanh toán
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        {message}
                    </p>
                    <div className="mt-8">
                        <Link 
                            href="/" 
                            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition"
                        >
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Đang tải...</div>}>
            <PaymentStatusContent />
        </Suspense>
    );
}
