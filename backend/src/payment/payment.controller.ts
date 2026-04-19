import { Request, Response } from 'express';
import { PayOS } from '@payos/node';

const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID || "client_id",
  apiKey: process.env.PAYOS_API_KEY || "api_key",
  checksumKey: process.env.PAYOS_CHECKSUM_KEY || "checksum_key"
});

class PaymentController {
    public async createPaymentLink(req: Request, res: Response) {
        try {
            const { courseId, studentId, price, courseName } = req.body;
            
            const orderCode = Number(String(new Date().getTime()).slice(-6)) + Math.floor(Math.random() * 1000);
            
            // Dùng origin frontend để callback (thường là http://localhost:3000)
            const YOUR_DOMAIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
            
            const requestData = {
                orderCode,
                amount: Number(price),
                description: `Thanh toan khoa hoc`,
                returnUrl: `${YOUR_DOMAIN}/payment-success?status=PAID&courseId=${courseId}&studentId=${studentId}`,
                cancelUrl: `${YOUR_DOMAIN}/payment-success?status=CANCEL`
            };

            const paymentLink = await payos.paymentRequests.create(requestData);
            
            return res.status(200).json({
                checkoutUrl: paymentLink.checkoutUrl,
                status: 200
            });
        } catch (error: any) {
            console.error("Error creating payment link:", error);
            return res.status(500).json({
                message: error?.message || "Lỗi tạo link thanh toán",
                status: 500
            });
        }
    }
}

export default new PaymentController();
