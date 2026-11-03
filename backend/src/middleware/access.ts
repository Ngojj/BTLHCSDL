import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import { course, join, lecture, question, quiz, roadMap, section } from "../db/schema";
import { asyncHandler, badRequest, forbidden, notFound, unauthorized } from "../lib/errors";

export type ResourceKind = "course" | "section" | "lecture" | "quiz" | "question" | "roadMap";

type Context = { ownerId: number; courseId: number | null };

/** Resolves who owns a resource (the teacher of its course) and which course it belongs to. */
export async function resolveContext(kind: ResourceKind, id: number): Promise<Context | null> {
  switch (kind) {
    case "course": {
      const [row] = await db.select({ ownerId: course.teacherId, courseId: course.id }).from(course).where(eq(course.id, id)).limit(1);
      return row ?? null;
    }
    case "section": {
      const [row] = await db
        .select({ ownerId: course.teacherId, courseId: course.id })
        .from(section)
        .innerJoin(course, eq(section.courseId, course.id))
        .where(eq(section.id, id))
        .limit(1);
      return row ?? null;
    }
    case "lecture": {
      const [row] = await db
        .select({ ownerId: course.teacherId, courseId: course.id })
        .from(lecture)
        .innerJoin(section, eq(lecture.sectionId, section.id))
        .innerJoin(course, eq(section.courseId, course.id))
        .where(eq(lecture.id, id))
        .limit(1);
      return row ?? null;
    }
    case "quiz": {
      const [row] = await db
        .select({ ownerId: course.teacherId, courseId: course.id })
        .from(quiz)
        .innerJoin(section, eq(quiz.sectionId, section.id))
        .innerJoin(course, eq(section.courseId, course.id))
        .where(eq(quiz.id, id))
        .limit(1);
      return row ?? null;
    }
    case "question": {
      const [row] = await db
        .select({ ownerId: course.teacherId, courseId: course.id })
        .from(question)
        .innerJoin(quiz, eq(question.quizId, quiz.id))
        .innerJoin(section, eq(quiz.sectionId, section.id))
        .innerJoin(course, eq(section.courseId, course.id))
        .where(eq(question.id, id))
        .limit(1);
      return row ?? null;
    }
    case "roadMap": {
      const [row] = await db.select({ ownerId: roadMap.teacherId }).from(roadMap).where(eq(roadMap.id, id)).limit(1);
      return row ? { ownerId: row.ownerId, courseId: null } : null;
    }
  }
}

/** "params.id" | "body.courseId" | "query.quizId" -> numeric id from the request */
const readId = (req: Parameters<RequestHandler>[0], path: string): number => {
  const [source, field] = path.split(".");
  const value = Number((req as any)[source]?.[field]);
  if (!Number.isInteger(value) || value <= 0) throw badRequest(`${path} must be a positive integer`);
  return value;
};

/** The authenticated teacher must own the referenced resource. */
export const owns = (kind: ResourceKind, path: string): RequestHandler =>
  asyncHandler(async (req, _res, next) => {
    if (!req.user) throw unauthorized();
    const ctx = await resolveContext(kind, readId(req, path));
    if (!ctx) throw notFound(`${kind} not found`);
    if (ctx.ownerId !== req.user.sub) throw forbidden(`You do not own this ${kind}`);
    next();
  });

export async function isEnrolled(studentId: number, courseId: number) {
  const [row] = await db
    .select({ courseId: join.courseId })
    .from(join)
    .where(and(eq(join.courseId, courseId), eq(join.studentId, studentId)))
    .limit(1);
  return Boolean(row);
}

/**
 * Course content (lectures, quizzes, questions) is visible to the owning teacher and to
 * students enrolled in the course — nobody else, which is what makes paying for a course mean something.
 */
export const canViewContent = (kind: Exclude<ResourceKind, "roadMap">, path: string): RequestHandler =>
  asyncHandler(async (req, _res, next) => {
    if (!req.user) throw unauthorized();
    const ctx = await resolveContext(kind, readId(req, path));
    if (!ctx) throw notFound(`${kind} not found`);
    if (req.user.role === "teacher") {
      if (ctx.ownerId !== req.user.sub) throw forbidden(`You do not own this ${kind}`);
      return next();
    }
    if (ctx.courseId === null || !(await isEnrolled(req.user.sub, ctx.courseId))) {
      throw forbidden("Enroll in this course to access its content");
    }
    next();
  });
