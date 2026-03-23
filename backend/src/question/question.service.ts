import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { option, question } from "../db/schema";

class questionService {
    public async getAllQuestions() {
        try {
            const questions = await db.select({
                id: question.id,
                quizId: question.quizId,
                type: question.type,
                answer: question.answer,
                content: question.content,
                creTime: question.creTime,
                teacherId: question.teacherId
            })
            .from(question)


            return {
                status: 200,
                message: "Questions fetched successfully",
                data: questions
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async getQuestionById(id: number) {
        try {
            const find = await db.select({
                id: question.id,
                quizId: question.quizId,
                type: question.type,
                answer: question.answer,
                content: question.content,
                creTime: question.creTime,
                teacherId: question.teacherId
            })
            .from(question)
            .where(eq(question.id, id))

            if (find.length === 0) {
                return {
                    status: 404,
                    message: "Question not found"
                }
            }
            return {
                status: 200,
                message: "Question fetched successfully",
                data: find
            }
        } catch (error) {
            return{
                status: 500,
                message: error
            }
        }
    }

    public async getQuestionByQuizId(quizId: number) {
        try {
            const find = await db.select({
                id: question.id,
                quizId: question.quizId,
                type: question.type,
                answer: question.answer,
                content: question.content,
                creTime: question.creTime,
                teacherId: question.teacherId
            })
            .from(question)
            .where(eq(question.quizId, quizId))

            return {
                status: 200,
                message: "Question fetched successfully",
                data: find
            }
        } catch (error) {
            return{
                status: 500,
                message: error
            }
        }
    }

    public async getQuestionAndOptionsByQuizId(quizId: number) {
        try {
            const questionList = await db.select({
                id: question.id,
                quizId: question.quizId,
                type: question.type,
                answer: question.answer,
                content: question.content,
                creTime: question.creTime,
                teacherId: question.teacherId,
                option: option.option
            })
            .from(question)
            .where(eq(question.quizId, quizId))
            .leftJoin(option, eq(option.questionId, question. id))
            .orderBy(question.id)


            return {
                status: 200,
                message: "Question fetched successfully",
                data: questionList
            }
        } catch (error) {
            return{
                status: 500,
                message: error
            }
        }
    }
    public async createQuestion(quizId: number, type: string, answer: string, content: string, teacherId: number, options: string[]) {
        try {
            const lastQuestion = await db.select({
                id: question.id
            })
            .from(question)
            .orderBy(desc(question.id))
            .limit(1)

            const nextQuestionId = lastQuestion.length === 0 ? 1 : Number(lastQuestion[0].id) + 1

            await db.insert(question)
                    .values({
                        id: nextQuestionId,
                        quizId: quizId,
                        type: type,
                        answer: answer,
                        content: content,
                        teacherId: teacherId
                    })

            // Query lại để lấy questionId (dùng quizId, content, teacherId để tìm)
            const createdQuestion = await db.select({
                questionId: question.id
            })
            .from(question)
            .where(and(
                eq(question.id, nextQuestionId),
                eq(question.quizId, quizId),
                eq(question.content, content),
                eq(question.teacherId, teacherId)
            ))
            .limit(1)

            if (!createdQuestion || createdQuestion.length === 0) {
                return {
                    status: 500,
                    message: "Failed to create question"
                }
            }

            // if type is "multiple choice" then create options
            if (type === "multiple choice") {
                for (let i = 0; i < options.length; i++) {
                    await db.insert(option)
                            .values({
                                questionId: createdQuestion[0].questionId,
                                option: options[i]
                            })
                }
            }
            return {
                status: 200,
                message: "Question created successfully",
                data: createdQuestion[0].questionId
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async updateQuestion(id: number, quizId: number, type: string, answer: string, content: string, teacherId: number) {
        try {
            const update = await db.update(question)
                                    .set({
                                        quizId: quizId,
                                        type: type,
                                        answer: answer,
                                        content: content,
                                        teacherId: teacherId
                                    })
                                    .where(eq(question.id, id))
            return {
                status: 200,
                message: "Question updated successfully"
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async deleteQuestionById(id: number) {
        try {
            const del = await db.delete(question)
                            .where(eq(question.id, id))
            return {
                status: 200,
                message: "Question deleted successfully"
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async deleteAllQuestionsInQuiz(quizId: number) {
        try {
            const del = await db.delete(question)
                            .where(eq(question.quizId, quizId))
            return {
                status: 200,
                message: "Questions deleted successfully"
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }
}

export default new questionService();
