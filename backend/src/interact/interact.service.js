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
class interactService {
    getAllInteractions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield db_1.db.select({
                    lectureId: schema_1.interact.lectureId,
                    studentId: schema_1.interact.studentId
                })
                    .from(schema_1.interact);
                return {
                    data: All,
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
    getInteractionsByLectureId(lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield db_1.db.select({
                    lectureId: schema_1.interact.lectureId,
                    studentId: schema_1.interact.studentId
                })
                    .from(schema_1.interact)
                    .where((0, drizzle_orm_1.eq)(schema_1.interact.lectureId, lectureId));
                return {
                    data: All,
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
    getInteractionsByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield db_1.db.select({
                    lectureId: schema_1.interact.lectureId,
                    studentId: schema_1.interact.studentId
                })
                    .from(schema_1.interact)
                    .where((0, drizzle_orm_1.eq)(schema_1.interact.studentId, studentId));
                return {
                    data: All,
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
    getInteractionsByLectureIdAndStudentId(lectureId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield db_1.db.select({
                    lectureId: schema_1.interact.lectureId,
                    studentId: schema_1.interact.studentId
                })
                    .from(schema_1.interact)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.interact.lectureId, lectureId), (0, drizzle_orm_1.eq)(schema_1.interact.studentId, studentId)));
                return {
                    data: All,
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
    createInteraction(lectureId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newInteraction = yield db_1.db.insert(schema_1.interact)
                    .values({
                    lectureId: lectureId,
                    studentId: studentId
                });
                return {
                    message: "Interaction created",
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
    deleteInteraction(lectureId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield db_1.db.delete(schema_1.interact)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.interact.lectureId, lectureId), (0, drizzle_orm_1.eq)(schema_1.interact.studentId, studentId)));
                return {
                    message: "Interaction deleted",
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
exports.default = new interactService();
