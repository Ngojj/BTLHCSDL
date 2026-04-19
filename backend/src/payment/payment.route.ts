import express from 'express';
import paymentController from './payment.controller';

const router = express.Router();

router.post('/create-link', paymentController.createPaymentLink as any);

export default router;
