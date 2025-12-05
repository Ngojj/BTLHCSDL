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
class answerRecordService {
    getAllRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allRecords = yield db_1.db.select({
                    quizId: schema_1.answerRecord.quizId,
                    studentId: schema_1.answerRecord.studentId,
                    questionId: schema_1.answerRecord.questionId,
                    studentAns: schema_1.answerRecord.studentAns
                }).from(schema_1.answerRecord);
                return {
                    message: "All records",
                    data: allRecords,
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRecordByStudentId(quizId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield db_1.db.select({
                    quizId: schema_1.answerRecord.quizId,
                    studentId: schema_1.answerRecord.studentId,
                    questionId: schema_1.answerRecord.questionId,
                    studentAns: schema_1.answerRecord.studentAns
                }).from(schema_1.answerRecord).where((0, drizzle_orm_1.eq)(schema_1.answerRecord.quizId, quizId));
                if (record.length === 0) {
                    return {
                        message: "Record not found by StudentId",
                        status: 404
                    };
                }
                return {
                    message: "Successfully found record by studentId",
                    data: record,
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRecordByQuizIdAndStudentId(quizId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield db_1.db.select({
                    quizId: schema_1.answerRecord.quizId,
                    studentId: schema_1.answerRecord.studentId,
                    questionId: schema_1.answerRecord.questionId,
                    studentAns: schema_1.answerRecord.studentAns
                }).from(schema_1.answerRecord).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.answerRecord.quizId, quizId), (0, drizzle_orm_1.eq)(schema_1.answerRecord.studentId, studentId)));
                return {
                    message: "Successfully found record by quizId",
                    data: record,
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRecordByQuestionId(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield db_1.db.select({
                    quizId: schema_1.answerRecord.quizId,
                    studentId: schema_1.answerRecord.studentId,
                    questionId: schema_1.answerRecord.questionId,
                    studentAns: schema_1.answerRecord.studentAns
                }).from(schema_1.answerRecord).where((0, drizzle_orm_1.eq)(schema_1.answerRecord.questionId, questionId));
                if (record.length === 0) {
                    return {
                        message: "Record not found by QuestionId",
                        status: 404
                    };
                }
                return {
                    message: "Successfully found record by questionId",
                    data: record,
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRecordByQuestionIdAndStudentId(questionId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield db_1.db.select({
                    quizId: schema_1.answerRecord.quizId,
                    studentId: schema_1.answerRecord.studentId,
                    questionId: schema_1.answerRecord.questionId,
                    studentAns: schema_1.answerRecord.studentAns
                }).from(schema_1.answerRecord).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.answerRecord.questionId, questionId), (0, drizzle_orm_1.eq)(schema_1.answerRecord.studentId, studentId)));
                if (record.length === 0) {
                    return {
                        message: "Record not found by QuizId and StudentId",
                        status: 200
                    };
                }
                return {
                    data: record,
                    message: "Successfully found record by QuizId and StudentId",
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRecordByQuizIdAndStudentIdAndQuestionId(quizId, studentId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield db_1.db.select({
                    quizId: schema_1.answerRecord.quizId,
                    studentId: schema_1.answerRecord.studentId,
                    questionId: schema_1.answerRecord.questionId,
                    studentAns: schema_1.answerRecord.studentAns
                }).from(schema_1.answerRecord).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.answerRecord.quizId, quizId), (0, drizzle_orm_1.eq)(schema_1.answerRecord.studentId, studentId), (0, drizzle_orm_1.eq)(schema_1.answerRecord.questionId, questionId)));
                if (record.length === 0) {
                    return {
                        message: "Record not found by QuizId, StudentId, and QuestionId",
                        status: 404
                    };
                }
                return {
                    message: "Successfully found record by QuizId, StudentId, and QuestionId",
                    data: record,
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    createRecord(answerRecordDto) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const newRecord = yield db_1.db.insert(schema_1.answerRecord).values({
                    quizId: answerRecordDto.quizId,
                    studentId: answerRecordDto.studentId,
                    questionId: answerRecordDto.questionId,
                    studentAns: answerRecordDto.studentAns
                });
                return {
                    message: "Successfully created record",
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateRecord(answerRecordDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedRecord = yield db_1.db.update(schema_1.answerRecord).set({
                    studentAns: answerRecordDto.studentAns
                }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.answerRecord.quizId, answerRecordDto.quizId), (0, drizzle_orm_1.eq)(schema_1.answerRecord.studentId, answerRecordDto.studentId), (0, drizzle_orm_1.eq)(schema_1.answerRecord.questionId, answerRecordDto.questionId)));
                return {
                    message: "Successfully updated record",
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteRecord(quizId, studentId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedRecord = yield db_1.db.delete(schema_1.answerRecord).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.answerRecord.quizId, quizId), (0, drizzle_orm_1.eq)(schema_1.answerRecord.studentId, studentId), (0, drizzle_orm_1.eq)(schema_1.answerRecord.questionId, questionId)));
                return {
                    message: "Successfully deleted record",
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
}
exports.default = new answerRecordService();
