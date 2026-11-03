'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Clock, X } from 'lucide-react';
import * as request from '@/app/axios/axios';

type Outcome = 'checking' | 'paid' | 'cancelled' | 'failed' | 'refund' | 'error';

const MAX_CHECKS = 12; // ~30 seconds: the bank confirmation can arrive a moment after the redirect

// The browser never decides whether a payment succeeded. It only asks the server, which verifies
// the order with the payment provider and enrolls the student itself.
function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const orderCode = searchParams.get('orderCode');
    const [outcome, setOutcome] = useState<Outcome>('checking');
    const attempts = useRef(0);

    useEffect(() => {
        if (!orderCode) {
            setOutcome('error');
            return;
        }
        // a cancelled checkout needs no confirmation (only a *successful* payment must come from the server)
        if (searchParams.get('status') === 'CANCEL' || searchParams.get('cancel') === 'true') {
            setOutcome('cancelled');
            return;
        }

        let stopped = false;
        let timer: ReturnType<typeof setTimeout>;

        const check = async () => {
            try {
                const order = await request.get(`/payment/order/${orderCode}`);
                if (stopped) return;
                if (order.status === 'PAID') return setOutcome('paid');
                if (order.status === 'ENROLL_FAILED') return setOutcome('refund');
                if (order.status === 'CANCELLED' || order.status === 'EXPIRED') return setOutcome('cancelled');
                if (++attempts.current >= MAX_CHECKS) return setOutcome('failed');
                timer = setTimeout(check, 2500);
            } catch {
                if (!stopped) setOutcome('error');
            }
        };
        check();

        return () => {
            stopped = true;
            clearTimeout(timer);
        };
    }, [orderCode]);

    const view = {
        checking: { icon: <Clock className="h-6 w-6 text-bk-blue" />, tone: 'bg-bk-mist', title: 'Đang xác nhận thanh toán', text: 'Vui lòng đợi trong giây lát, chúng tôi đang kiểm tra giao dịch với ngân hàng.' },
        paid: { icon: <Check className="h-6 w-6 text-[#1F8A5B]" />, tone: 'bg-emerald-50', title: 'Thanh toán thành công', text: 'Bạn đã được ghi danh vào khóa học và có thể bắt đầu học ngay.' },
        cancelled: { icon: <X className="h-6 w-6 text-[#C2410C]" />, tone: 'bg-orange-50', title: 'Thanh toán đã bị hủy', text: 'Chưa có khoản tiền nào bị trừ. Bạn có thể đăng ký lại bất cứ lúc nào.' },
        failed: { icon: <Clock className="h-6 w-6 text-bk-blue" />, tone: 'bg-bk-mist', title: 'Chưa nhận được xác nhận', text: 'Nếu bạn đã chuyển khoản, khóa học sẽ tự động được mở sau khi ngân hàng xác nhận. Hãy kiểm tra lại mục Khóa học của tôi sau ít phút.' },
        refund: { icon: <X className="h-6 w-6 text-[#C2410C]" />, tone: 'bg-orange-50', title: 'Không thể ghi danh', text: 'Giao dịch đã thành công nhưng bạn đang học tối đa 3 khóa. Vui lòng liên hệ giảng viên hoặc quản trị viên để được hoàn tiền.' },
        error: { icon: <X className="h-6 w-6 text-[#C2410C]" />, tone: 'bg-orange-50', title: 'Không thể kiểm tra giao dịch', text: 'Vui lòng đăng nhập lại hoặc thử lại sau.' },
    }[outcome];

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-md rounded-[10px] border border-bk-line p-10 text-center">
                <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${view.tone}`}>{view.icon}</span>
                <p className="eyebrow mt-6">Thanh toán</p>
                <h1 className="mt-2 text-2xl font-semibold text-bk-ink">{view.title}</h1>
                <p className="mt-3 text-sm leading-6 text-bk-slate">{view.text}</p>
                <div className="mt-8 flex flex-col gap-3">
                    {outcome === 'paid' && (
                        <Link href="/student/mycourse" className="button-primary">Vào khóa học của tôi</Link>
                    )}
                    {outcome !== 'checking' && outcome !== 'paid' && (
                        <Link href="/student/mycourse" className="button-secondary">Khóa học của tôi</Link>
                    )}
                    <Link href="/" className="button-link justify-center">Về trang chủ</Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-sm text-bk-slate">Đang tải...</div>}>
            <PaymentStatusContent />
        </Suspense>
    );
}
