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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const join_service_1 = __importDefault(require("../join/join.service"));
class dOService {
    getDOByQuizId(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dOData = yield db_1.db.select({
                    quizId: schema_1.dO.quizId,
                    studentId: schema_1.dO.studentId,
                    score: schema_1.dO.score,
                    attemptOrder: schema_1.dO.attemptOrder
                })
                    .from(schema_1.dO)
                    .where((0, drizzle_orm_1.eq)(schema_1.dO.quizId, quizId));
                if (dOData.length === 0) {
                    return {
                        message: "DO not found",
                        status: 404
                    };
                }
                return {
                    data: dOData,
                    status: 200
                };
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    getDOByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dOData = yield db_1.db.select({
                    quizId: schema_1.dO.quizId,
                    studentId: schema_1.dO.studentId,
                    score: schema_1.dO.score,
                    attemptOrder: schema_1.dO.attemptOrder
                })
                    .from(schema_1.dO)
                    .where((0, drizzle_orm_1.eq)(schema_1.dO.studentId, studentId));
                if (dOData.length === 0) {
                    return {
                        message: "DO not found",
                        status: 404
                    };
                }
                return {
                    data: dOData,
                    status: 200
                };
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    getDOByQuizIdAndStudentIdAndAttemptOrder(quizId, studentId, attemptOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dOData = yield db_1.db.select({
                    quizId: schema_1.dO.quizId,
                    studentId: schema_1.dO.studentId,
                    score: schema_1.dO.score,
                    attemptOrder: schema_1.dO.attemptOrder
                })
                    .from(schema_1.dO)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dO.studentId, studentId), (0, drizzle_orm_1.eq)(schema_1.dO.quizId, quizId), (0, drizzle_orm_1.eq)(schema_1.dO.attemptOrder, attemptOrder)));
                return {
                    data: dOData,
                    status: 200
                };
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    getAllDO() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dOData = yield db_1.db.select({
                    quizId: schema_1.dO.quizId,
                    studentId: schema_1.dO.studentId,
                    score: schema_1.dO.score,
                    attemptOrder: schema_1.dO.attemptOrder
                })
                    .from(schema_1.dO);
                return {
                    data: dOData,
                    status: 200
                };
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    getDOByQuizIdAndStudentId(quizId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dOData = yield db_1.db.select({
                    quizId: schema_1.dO.quizId,
                    studentId: schema_1.dO.studentId,
                    score: schema_1.dO.score,
                    attemptOrder: schema_1.dO.attemptOrder
                })
                    .from(schema_1.dO)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dO.quizId, quizId), (0, drizzle_orm_1.eq)(schema_1.dO.studentId, studentId)));
                return {
                    data: dOData,
                    status: 200
                };
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    createDO(dODto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.db.insert(schema_1.dO).values({
                    quizId: dODto.quizId,
                    studentId: dODto.studentId,
                    score: dODto.score,
                    attemptOrder: dODto.attemptOrder
                });
                join_service_1.default.UpdateGPAAndProgress(dODto.quizId, dODto.studentId);
                return {
                    mesage: "DO created successfully",
                    status: 200
                };
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    updateDO(dODto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkDO = yield db_1.db.select({
                    quizId: schema_1.dO.quizId,
                    studentId: schema_1.dO.studentId
                })
                    .from(schema_1.dO)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dO.quizId, dODto.quizId), (0, drizzle_orm_1.eq)(schema_1.dO.studentId, dODto.studentId)));
                if (checkDO.length === 0) {
                    return {
                        message: "DO not found",
                        status: 404
                    };
                }
                yield db_1.db.update(schema_1.dO)
                    .set({
                    score: dODto.score,
                    attemptOrder: dODto.attemptOrder
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dO.quizId, dODto.quizId), (0, drizzle_orm_1.eq)(schema_1.dO.studentId, dODto.studentId)));
                return {
                    message: "DO updated successfully",
                    status: 200
                };
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    deleteDO(quizId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if the DO exists
                const checkDO = yield db_1.db.select({
                    quizId: schema_1.dO.quizId,
                    studentId: schema_1.dO.studentId
                })
                    .from(schema_1.dO)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dO.quizId, quizId), (0, drizzle_orm_1.eq)(schema_1.dO.studentId, studentId)));
                if (checkDO.length === 0) {
                    return {
                        message: "DO not found",
                        status: 404
                    };
                }
                yield db_1.db.delete(schema_1.dO)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dO.quizId, quizId), (0, drizzle_orm_1.eq)(schema_1.dO.studentId, studentId)));
                return {
                    message: "DO deleted successfully",
                    status: 200
                };
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
}
exports.default = new dOService();
