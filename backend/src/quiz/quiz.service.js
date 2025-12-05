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
class quizService {
    getAllQuiz() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizzes = yield db_1.db.select({
                    id: schema_1.quiz.id,
                    name: schema_1.quiz.name,
                    state: schema_1.quiz.state,
                    attempt: schema_1.quiz.attempt,
                    duration: schema_1.quiz.duration,
                    teacherId: schema_1.quiz.teacherId,
                    sectionId: schema_1.quiz.sectionId,
                    creTime: schema_1.quiz.creTime,
                }).from(schema_1.quiz);
                return {
                    status: 200,
                    data: quizzes
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
    getQuizById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizById = yield db_1.db.select({
                    id: schema_1.quiz.id,
                    name: schema_1.quiz.name,
                    state: schema_1.quiz.state,
                    attempt: schema_1.quiz.attempt,
                    duration: schema_1.quiz.duration,
                    teacherId: schema_1.quiz.teacherId,
                    sectionId: schema_1.quiz.sectionId,
                    creTime: schema_1.quiz.creTime,
                }).from(schema_1.quiz).where((0, drizzle_orm_1.eq)(schema_1.quiz.id, id));
                return {
                    status: 200,
                    data: quizById
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
    getQuizByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizByName = yield db_1.db.select({
                    id: schema_1.quiz.id,
                    name: schema_1.quiz.name,
                    state: schema_1.quiz.state,
                    attempt: schema_1.quiz.attempt,
                    duration: schema_1.quiz.duration,
                    teacherId: schema_1.quiz.teacherId,
                    sectionId: schema_1.quiz.sectionId,
                    creTime: schema_1.quiz.creTime,
                }).from(schema_1.quiz).where((0, drizzle_orm_1.eq)(schema_1.quiz.name, name));
                if (quizByName.length === 0) {
                    return {
                        status: 404,
                        message: "Quiz not found"
                    };
                }
                return {
                    status: 200,
                    data: quizByName
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
    getQuizBySection(sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(sectionId);
                const quizBySection = yield db_1.db.select({
                    id: schema_1.quiz.id,
                    name: schema_1.quiz.name,
                    state: schema_1.quiz.state,
                    attempt: schema_1.quiz.attempt,
                    duration: schema_1.quiz.duration,
                    teacherId: schema_1.quiz.teacherId,
                    sectionId: schema_1.quiz.sectionId,
                    creTime: schema_1.quiz.creTime,
                }).from(schema_1.quiz).where((0, drizzle_orm_1.eq)(schema_1.quiz.sectionId, sectionId));
                return {
                    status: 200,
                    data: quizBySection
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
    createQuiz(name, state, attempt, duration, teacherId, sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newQuiz = yield db_1.db.insert(schema_1.quiz).values({
                    name: name,
                    state: state,
                    attempt: attempt,
                    duration: duration,
                    teacherId: teacherId,
                    sectionId: sectionId
                });
                return {
                    status: 200,
                    message: "Successfully created quiz"
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
    updateQuiz(id, name, state, attempt, duration, teacherId, sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizExists = yield db_1.db.select({ id: schema_1.quiz.id }).from(schema_1.quiz).where((0, drizzle_orm_1.eq)(schema_1.quiz.id, id));
                if (quizExists.length === 0) {
                    return {
                        status: 404,
                        message: "Quiz not found"
                    };
                }
                const updatedQuiz = yield db_1.db.update(schema_1.quiz).set({
                    name: name,
                    state: state,
                    attempt: attempt,
                    duration: duration,
                    teacherId: teacherId,
                    sectionId: sectionId
                }).where((0, drizzle_orm_1.eq)(schema_1.quiz.id, id));
                return {
                    status: 200,
                    message: "Successfully updated quiz"
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
    deleteQuizById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizExists = yield db_1.db.select({ id: schema_1.quiz.id }).from(schema_1.quiz).where((0, drizzle_orm_1.eq)(schema_1.quiz.id, id));
                if (quizExists.length === 0) {
                    return {
                        status: 404,
                        message: "Quiz not found"
                    };
                }
                // delete all questions of this quiz first
                // questionService.deleteAllQuestionsInQuiz(id);
                const deletedQuiz = yield db_1.db.delete(schema_1.quiz).where((0, drizzle_orm_1.eq)(schema_1.quiz.id, id));
                return {
                    status: 200,
                    message: "Successfully deleted quiz"
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
    deleteQuizByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizExists = yield db_1.db.select({ id: schema_1.quiz.id }).from(schema_1.quiz).where((0, drizzle_orm_1.eq)(schema_1.quiz.name, name));
                if (quizExists.length === 0) {
                    return {
                        status: 404,
                        message: "Quiz not found"
                    };
                }
                // delete all questions in this quiz first
                // questionService.deleteAllQuestionsInQuiz(quizExists[0].id);
                const deletedQuiz = yield db_1.db.delete(schema_1.quiz).where((0, drizzle_orm_1.eq)(schema_1.quiz.name, name));
                return {
                    status: 200,
                    message: "Successfully deleted quiz"
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
    deleteAllQuizInSection(sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizExists = yield db_1.db.select({ id: schema_1.quiz.id }).from(schema_1.quiz).where((0, drizzle_orm_1.eq)(schema_1.quiz.sectionId, sectionId));
                if (quizExists.length === 0) {
                    return {
                        status: 404,
                        message: "Quiz not found"
                    };
                }
                // for (let i = 0; i < quizExists.length; i++) {
                // delete all questions in this quiz first
                //     questionService.deleteAllQuestionsInQuiz(quizExists[i].id);
                // }
                const deletedQuiz = yield db_1.db.delete(schema_1.quiz).where((0, drizzle_orm_1.eq)(schema_1.quiz.sectionId, sectionId));
                return {
                    status: 200,
                    message: "Successfully deleted quiz"
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
exports.default = new quizService();
