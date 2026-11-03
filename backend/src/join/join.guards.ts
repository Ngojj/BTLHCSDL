import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { course } from "../db/schema";
import { asyncHandler, notFound, paymentRequired } from "../lib/errors";

/**
 * Direct enrollment is only allowed for free courses. Paid courses are enrolled by the
 * payment module once the gateway confirms the money arrived.
 */
export const freeCourseOnly = asyncHandler(async (req, _res, next) => {
  const courseId = Number(req.body?.courseId);
  const [row] = await db.select({ price: course.price }).from(course).where(eq(course.id, courseId)).limit(1);
  if (!row) throw notFound("Course not found");
  if (row.price > 0) throw paymentRequired("This course is paid; complete the payment to enroll");
  next();
});
