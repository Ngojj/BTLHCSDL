import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/errors";
import { asStudent } from "../middleware/auth";
import { validate } from "../middleware/validate";
import * as payments from "./payment.service";

const router = Router();

// Start a checkout. Price comes from the database; the student comes from the token.
router.post(
  "/create-link",
  asStudent,
  validate({ body: z.object({ courseId: z.coerce.number().int().positive() }) }),
  asyncHandler(async (req, res) => {
    const { orderCode, checkoutUrl } = await payments.createCheckout(req.user!.sub, req.body.courseId);
    res.status(200).json({ checkoutUrl, orderCode, status: 200 });
  })
);

// PayOS calls this when money arrives. Public, but the signature is verified before anything happens.
router.post(
  "/webhook",
  asyncHandler(async (req, res) => {
    res.status(200).json(await payments.handleWebhook(req.body));
  })
);

router.get(
  "/order/:orderCode",
  asStudent,
  validate({ params: z.object({ orderCode: z.coerce.number().int().positive() }) }),
  asyncHandler(async (req, res) => {
    res.json(await payments.getOrder(Number(req.params.orderCode), req.user!.sub));
  })
);

router.get(
  "/history",
  asStudent,
  asyncHandler(async (req, res) => {
    res.json({ data: await payments.listPayments(req.user!.sub) });
  })
);

export default router;
