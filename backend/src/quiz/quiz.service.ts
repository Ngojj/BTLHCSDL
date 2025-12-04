import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { quiz, section, teacher } from "../db/schema";
import questionService from "../question/question.service";
class quizService {
    public async getAllQuiz() {
        try {
            const quizzes = await db.select(
                {
                    id: quiz.id,
                    name: quiz.name,
                    state: quiz.state,
                    attempt: quiz.attempt,
                    duration: quiz.duration,
                    teacherId: quiz.teacherId,
                    sectionId: quiz.sectionId,
                    creTime: quiz.creTime,
                }
            ).from(quiz);

            return {
                status: 200,
                data: quizzes
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async getQuizById(id: number) {
        try {
            const quizById = await db.select(
                {
                    id: quiz.id,
                    name: quiz.name,
                    state: quiz.state,
                    attempt: quiz.attempt,
                    duration: quiz.duration,
                    teacherId: quiz.teacherId,
                    sectionId: quiz.sectionId,
                    creTime: quiz.creTime,
                }
            ).from(quiz).where(eq(quiz.id, id));
            
            return {
                status: 200,
                data: quizById
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async getQuizByName(name: string) {
        try {
            const quizByName = await db.select(
                {
                    id: quiz.id,
                    name: quiz.name,
                    state: quiz.state,
                    attempt: quiz.attempt,
                    duration: quiz.duration,
                    teacherId: quiz.teacherId,
                    sectionId: quiz.sectionId,
                    creTime: quiz.creTime,
                }
            ).from(quiz).where(eq(quiz.name, name));
            
            if (quizByName.length === 0) {
                return {
                    status: 404,
                    message: "Quiz not found"
                }
            }
            return {
                status: 200,
                data: quizByName
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async getQuizBySection(sectionId: number) {
        try {
            console.log(sectionId)
            const quizBySection = await db.select(
                {
                    id: quiz.id,
                    name: quiz.name,
                    state: quiz.state,
                    attempt: quiz.attempt,
                    duration: quiz.duration,
                    teacherId: quiz.teacherId,
                    sectionId: quiz.sectionId,
                    creTime: quiz.creTime,
                }
            ).from(quiz).where(eq(quiz.sectionId, sectionId));
            
            return {
                status: 200,
                data: quizBySection
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }


    public async createQuiz(name: string, state: string, attempt: number, duration: number, teacherId: number, sectionId: number) {
        try {
            const newQuiz = await db.insert(
                                        quiz
                                    ).values({
                                        name: name,
                                        state: state,
                                        attempt: attempt,
                                        duration: duration,
                                        teacherId: teacherId,
                                        sectionId: sectionId
                                    })
            

            return {
                status: 200,
                message: "Successfully created quiz"
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async updateQuiz(id: number, name: string, state: string, attempt: number, duration: number, teacherId: number, sectionId: number) {
        try {
            const quizExists = await db.select({ id: quiz.id }).from(quiz).where(eq(quiz.id, id));
            if (quizExists.length === 0) {
                return {
                    status: 404,
                    message: "Quiz not found"
                }
            }
            const updatedQuiz = await db.update(quiz).set({
                name: name,
                state: state,
                attempt: attempt,
                duration: duration,
                teacherId: teacherId,
                sectionId: sectionId
            }).where(eq(quiz.id, id));
            return {
                status: 200,
                message: "Successfully updated quiz"
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async deleteQuizById(id: number){
        try {
            const quizExists = await db.select({ id: quiz.id }).from(quiz).where(eq(quiz.id, id));
            if (quizExists.length === 0) {
                return {
                    status: 404,
                    message: "Quiz not found"
                }
            }
            // delete all questions of this quiz first
            // questionService.deleteAllQuestionsInQuiz(id);

            const deletedQuiz = await db.delete(quiz).where(eq(quiz.id, id));
            return {
                status: 200,
                message: "Successfully deleted quiz"
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async deleteQuizByName(name: string){
        try {
            const quizExists = await db.select({ id: quiz.id }).from(quiz).where(eq(quiz.name, name));
            if (quizExists.length === 0) {
                return {
                    status: 404,
                    message: "Quiz not found"
                }
            }
            // delete all questions in this quiz first
            // questionService.deleteAllQuestionsInQuiz(quizExists[0].id);
            const deletedQuiz = await db.delete(quiz).where(eq(quiz.name, name));
            return {
                status: 200,
                message: "Successfully deleted quiz"
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async deleteAllQuizInSection(sectionId: number){
        try {
            const quizExists = await db.select({ id: quiz.id }).from(quiz).where(eq(quiz.sectionId, sectionId));
            if (quizExists.length === 0) {
                return {
                    status: 404,
                    message: "Quiz not found"
                }
            }
            // for (let i = 0; i < quizExists.length; i++) {
                // delete all questions in this quiz first
            //     questionService.deleteAllQuestionsInQuiz(quizExists[i].id);
            // }
            const deletedQuiz = await db.delete(quiz).where(eq(quiz.sectionId, sectionId));
            return {
                status: 200,
                message: "Successfully deleted quiz"
            }
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }
}

export default new quizService();