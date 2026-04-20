"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("@payos/node");
const payos = new node_1.PayOS({
    clientId: process.env.PAYOS_CLIENT_ID || "client_id",
    apiKey: process.env.PAYOS_API_KEY || "api_key",
    checksumKey: process.env.PAYOS_CHECKSUM_KEY || "checksum_key"
});
class PaymentController {
    createPaymentLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const paymentLink = yield payos.paymentRequests.create(requestData);
                return res.status(200).json({
                    checkoutUrl: paymentLink.checkoutUrl,
                    status: 200
                });
            }
            catch (error) {
                console.error("Error creating payment link:", error);
                return res.status(500).json({
                    message: (error === null || error === void 0 ? void 0 : error.message) || "Lỗi tạo link thanh toán",
                    status: 500
                });
            }
        });
    }
}
exports.default = new PaymentController();
