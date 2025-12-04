import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { interact } from "../db/schema";
import lectureService from "../lecture/lecture.service";

class interactService {
    public async getAllInteractions() {
        try {
            const All = await db.select({
                lectureId: interact.lectureId,
                studentId: interact.studentId
            })
            .from(interact)

            return {
                data: All,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getInteractionsByLectureId(lectureId: number) {
        try {
            const All = await db.select({
                lectureId: interact.lectureId,
                studentId: interact.studentId
            })
            .from(interact)
            .where(eq(interact.lectureId, lectureId))

            return {
                data: All,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getInteractionsByStudentId(studentId: number) {
        try {
            const All = await db.select({
                lectureId: interact.lectureId,
                studentId: interact.studentId
            })
            .from(interact)
            .where(eq(interact.studentId, studentId))

            return {
                data: All,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getInteractionsByLectureIdAndStudentId(lectureId: number, studentId: number) {
        try {
            const All = await db.select({
                lectureId: interact.lectureId,
                studentId: interact.studentId
            })
            .from(interact)
            .where(and(eq(interact.lectureId, lectureId), eq(interact.studentId, studentId)))

            return {
                data: All,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createInteraction(lectureId: number, studentId: number) {
        try {

            const newInteraction = await db.insert(interact)
            .values({
                lectureId: lectureId,
                studentId: studentId
            })

            return {
                message: "Interaction created",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteInteraction(lectureId: number, studentId: number) {
        try {
            const deleted = await db.delete(interact)
            .where(and(eq(interact.lectureId, lectureId), eq(interact.studentId, studentId)))

            return {
                message: "Interaction deleted",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new interactService();