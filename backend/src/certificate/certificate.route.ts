import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { env } from "../config/env";
import { asyncHandler, notFound } from "../lib/errors";
import { asStudent, asTeacher } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { renderCertificatePdf } from "./certificate.pdf";
import {
  CODE_PATTERN,
  getOwnedCertificate,
  listIssuedByTeacher,
  listStudentCertificates,
  verifyCertificate,
} from "./certificate.service";

const router = Router();

// the verification endpoint is public, so keep anyone from walking the code space
const verifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: () => env.isTest,
  message: { message: "Too many verification requests, please slow down" },
});

const codeParams = z.object({ code: z.string().trim().toUpperCase().regex(CODE_PATTERN, "Invalid certificate code") });

router.get(
  "/mine",
  asStudent,
  asyncHandler(async (req, res) => {
    res.json({ data: await listStudentCertificates(req.user!.sub) });
  })
);

router.get(
  "/issued",
  asTeacher,
  asyncHandler(async (req, res) => {
    res.json({ data: await listIssuedByTeacher(req.user!.sub) });
  })
);

// Public: anyone holding a code (printed on the PDF, or behind its QR) can check it is genuine.
router.get(
  "/verify/:code",
  verifyLimiter,
  validate({ params: codeParams }),
  asyncHandler(async (req, res) => {
    const certificate = await verifyCertificate(req.params.code);
    if (!certificate) throw notFound("Certificate not found");
    res.json({ valid: true, certificate });
  })
);

router.get(
  "/:code/pdf",
  asStudent,
  validate({ params: codeParams }),
  asyncHandler(async (req, res) => {
    const certificate = await getOwnedCertificate(req.params.code, req.user!.sub);
    if (!certificate) throw notFound("Certificate not found");
    const pdf = await renderCertificatePdf(certificate, `${env.frontendUrl}/verify/${certificate.code}`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="chung-chi-${certificate.code}.pdf"`);
    res.send(pdf);
  })
);

export default router;
