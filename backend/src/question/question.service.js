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
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
class questionService {
    getAllQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield db_1.db.select({
                    id: schema_1.question.id,
                    quizId: schema_1.question.quizId,
                    type: schema_1.question.type,
                    answer: schema_1.question.answer,
                    content: schema_1.question.content,
                    creTime: schema_1.question.creTime,
                    teacherId: schema_1.question.teacherId
                })
                    .from(schema_1.question);
                return {
                    status: 200,
                    message: "Questions fetched successfully",
                    data: questions
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    getQuestionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const find = yield db_1.db.select({
                    id: schema_1.question.id,
                    quizId: schema_1.question.quizId,
                    type: schema_1.question.type,
                    answer: schema_1.question.answer,
                    content: schema_1.question.content,
                    creTime: schema_1.question.creTime,
                    teacherId: schema_1.question.teacherId
                })
                    .from(schema_1.question)
                    .where((0, drizzle_orm_1.eq)(schema_1.question.id, id));
                if (find.length === 0) {
                    return {
                        status: 404,
                        message: "Question not found"
                    };
                }
                return {
                    status: 200,
                    message: "Question fetched successfully",
                    data: find
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    getQuestionByQuizId(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const find = yield db_1.db.select({
                    id: schema_1.question.id,
                    quizId: schema_1.question.quizId,
                    type: schema_1.question.type,
                    answer: schema_1.question.answer,
                    content: schema_1.question.content,
                    creTime: schema_1.question.creTime,
                    teacherId: schema_1.question.teacherId
                })
                    .from(schema_1.question)
                    .where((0, drizzle_orm_1.eq)(schema_1.question.quizId, quizId));
                return {
                    status: 200,
                    message: "Question fetched successfully",
                    data: find
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    getQuestionAndOptionsByQuizId(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionList = yield db_1.db.select({
                    id: schema_1.question.id,
                    quizId: schema_1.question.quizId,
                    type: schema_1.question.type,
                    answer: schema_1.question.answer,
                    content: schema_1.question.content,
                    creTime: schema_1.question.creTime,
                    teacherId: schema_1.question.teacherId,
                    option: schema_1.option.option
                })
                    .from(schema_1.question)
                    .where((0, drizzle_orm_1.eq)(schema_1.question.quizId, quizId))
                    .leftJoin(schema_1.option, (0, drizzle_orm_1.eq)(schema_1.option.questionId, schema_1.question.id))
                    .orderBy(schema_1.question.id);
                return {
                    status: 200,
                    message: "Question fetched successfully",
                    data: questionList
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    createQuestion(quizId, type, answer, content, teacherId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const create = yield db_1.db.insert(schema_1.question)
                    .values({
                    quizId: quizId,
                    type: type,
                    answer: answer,
                    content: content,
                    teacherId: teacherId
                })
                    .returning({
                    questionId: schema_1.question.id
                });
                // if type is "multiple choice" then create options
                if (type === "multiple choice") {
                    for (let i = 0; i < options.length; i++) {
                        yield db_1.db.insert(schema_1.option)
                            .values({
                            questionId: create[0].questionId,
                            option: options[i]
                        });
                    }
                }
                return {
                    status: 200,
                    message: "Question created successfully",
                    data: create[0].questionId
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    updateQuestion(id, quizId, type, answer, content, teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield db_1.db.update(schema_1.question)
                    .set({
                    quizId: quizId,
                    type: type,
                    answer: answer,
                    content: content,
                    teacherId: teacherId
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.question.id, id));
                return {
                    status: 200,
                    message: "Question updated successfully"
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    deleteQuestionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const del = yield db_1.db.delete(schema_1.question)
                    .where((0, drizzle_orm_1.eq)(schema_1.question.id, id));
                return {
                    status: 200,
                    message: "Question deleted successfully"
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    deleteAllQuestionsInQuiz(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const del = yield db_1.db.delete(schema_1.question)
                    .where((0, drizzle_orm_1.eq)(schema_1.question.quizId, quizId));
                return {
                    status: 200,
                    message: "Questions deleted successfully"
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
}
exports.default = new questionService();
