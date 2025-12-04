import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { answerRecord } from "../db/schema";
import { answerRecordDto } from "../dtos/answerRecord.dto";

class answerRecordService {
    public async getAllRecords() {
        try {
            const allRecords = await db.select({
                quizId: answerRecord.quizId,
                studentId: answerRecord.studentId,
                questionId: answerRecord.questionId,
                studentAns: answerRecord.studentAns
            }).from(answerRecord);

            return {
                message: "All records",
                data: allRecords,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRecordByStudentId(quizId: number, studentId: number) {
        try {
            const record = await db.select({
                quizId: answerRecord.quizId,
                studentId: answerRecord.studentId,
                questionId: answerRecord.questionId,
                studentAns: answerRecord.studentAns
            }).from(answerRecord).where(
                eq(answerRecord.quizId, quizId),
            );

            if (record.length === 0) {
                return {
                    message: "Record not found by StudentId",
                    status: 404
                }
            }

            return {
                message: "Successfully found record by studentId",
                data: record,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRecordByQuizIdAndStudentId(quizId: number, studentId: number) {
        try {
            const record = await db.select({
                quizId: answerRecord.quizId,
                studentId: answerRecord.studentId,
                questionId: answerRecord.questionId,
                studentAns: answerRecord.studentAns
            }).from(answerRecord).where(
                and(eq(answerRecord.quizId, quizId), eq(answerRecord.studentId, studentId))
            );

            return {
                message: "Successfully found record by quizId",
                data: record,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRecordByQuestionId(questionId: number) {
        try {
            const record = await db.select({
                quizId: answerRecord.quizId,
                studentId: answerRecord.studentId,
                questionId: answerRecord.questionId,
                studentAns: answerRecord.studentAns
            }).from(answerRecord).where(
                eq(answerRecord.questionId, questionId),
            );

            if (record.length === 0) {
                return {
                    message: "Record not found by QuestionId",
                    status: 404
                }
            }

            return {
                message: "Successfully found record by questionId",
                data: record,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRecordByQuestionIdAndStudentId(questionId: number, studentId: number) {
        try {
            const record = await db.select({
                quizId: answerRecord.quizId,
                studentId: answerRecord.studentId,
                questionId: answerRecord.questionId,
                studentAns: answerRecord.studentAns
            }).from(answerRecord).where(and(
                eq(answerRecord.questionId, questionId),
                eq(answerRecord.studentId, studentId)
            )
            );

            if (record.length === 0) {
                return {
                    message: "Record not found by QuizId and StudentId",
                    status: 200
                }
            }

            return {
                data: record,
                message: "Successfully found record by QuizId and StudentId",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRecordByQuizIdAndStudentIdAndQuestionId(quizId: number, studentId: number, questionId: number) {
        try {
            const record = await db.select({
                quizId: answerRecord.quizId,
                studentId: answerRecord.studentId,
                questionId: answerRecord.questionId,
                studentAns: answerRecord.studentAns
            }).from(answerRecord).where(and(
                eq(answerRecord.quizId, quizId),
                eq(answerRecord.studentId, studentId),
                eq(answerRecord.questionId, questionId)
            )
            );

            if (record.length === 0) {
                return {
                    message: "Record not found by QuizId, StudentId, and QuestionId",
                    status: 404
                }
            }

            return {
                message: "Successfully found record by QuizId, StudentId, and QuestionId",
                data: record,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createRecord(answerRecordDto : answerRecordDto){
        try {
            // const findRecord = await db.select({
            //     quizId: answerRecord.quizId,
            //     studentId: answerRecord.studentId,
            //     questionId: answerRecord.questionId,
            //     studentAns: answerRecord.studentAns
            // }).from(answerRecord).where(and(
            //     eq(answerRecord.quizId, answerRecordDto.quizId),
            //     eq(answerRecord.studentId, answerRecordDto.studentId),
            //     eq(answerRecord.questionId, answerRecordDto.questionId)
            // ));

            // if (findRecord.length !== 0) {
            //     return {
            //         message: "Record already exists",
            //         status: 409
            //     }
            // }
            const newRecord = await db.insert(answerRecord).values({
                quizId: answerRecordDto.quizId,
                studentId: answerRecordDto.studentId,
                questionId: answerRecordDto.questionId,
                studentAns: answerRecordDto.studentAns
            })
            return {
                message: "Successfully created record",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateRecord(answerRecordDto: answerRecordDto){
        try {
            const updatedRecord = await db.update(answerRecord).set({
                studentAns: answerRecordDto.studentAns
            }).where(and(
                eq(answerRecord.quizId, answerRecordDto.quizId),
                eq(answerRecord.studentId, answerRecordDto.studentId),
                eq(answerRecord.questionId, answerRecordDto.questionId)
            ))

            return {
                message: "Successfully updated record",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteRecord(quizId: number, studentId: number, questionId: number){
        try {
            const deletedRecord = await db.delete(answerRecord).where(and(
                eq(answerRecord.quizId, quizId),
                eq(answerRecord.studentId, studentId),
                eq(answerRecord.questionId, questionId)
            ))

            return {
                message: "Successfully deleted record",
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

export default new answerRecordService();