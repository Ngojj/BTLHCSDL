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
class lectureService {
    getAllLectures() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lectures = yield db_1.db.select({
                    id: schema_1.lecture.id,
                    name: schema_1.lecture.name,
                    state: schema_1.lecture.state,
                    material: schema_1.lecture.material,
                    reference: schema_1.lecture.reference,
                    sectionId: schema_1.lecture.sectionId
                });
                return {
                    data: lectures,
                    status: 200,
                    message: "Lectures fetched successfully"
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
    getLectureByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lectures = yield db_1.db.select({
                    id: schema_1.lecture.id,
                    name: schema_1.lecture.name,
                    state: schema_1.lecture.state,
                    material: schema_1.lecture.material,
                    reference: schema_1.lecture.reference,
                    sectionId: schema_1.lecture.sectionId
                })
                    .from(schema_1.lecture)
                    .where((0, drizzle_orm_1.eq)(schema_1.lecture.name, name));
                return {
                    data: lectures,
                    status: 200,
                    message: "Lecture fetched successfully"
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
    getLectureBySectionId(sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(sectionId);
                const lectures = yield db_1.db.select({
                    id: schema_1.lecture.id,
                    name: schema_1.lecture.name,
                    state: schema_1.lecture.state,
                    material: schema_1.lecture.material,
                    reference: schema_1.lecture.reference,
                    sectionId: schema_1.lecture.sectionId
                })
                    .from(schema_1.lecture)
                    .where((0, drizzle_orm_1.eq)(schema_1.lecture.sectionId, sectionId));
                return {
                    data: lectures,
                    status: 200,
                    message: "Lecture fetched successfully"
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
    createLecture(lectureDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const returnVal = yield db_1.db.insert(schema_1.lecture).values(lectureDto).returning({ lectureId: schema_1.lecture.id });
                return {
                    data: returnVal[0].lectureId,
                    message: "Lecture created successfully",
                    status: 200
                };
            }
            catch (error) {
                console.log(error);
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateLecture(lectureDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const returnVal = yield db_1.db.update(schema_1.lecture).set(lectureDto).where((0, drizzle_orm_1.eq)(schema_1.lecture.id, lectureDto.id));
                return {
                    data: returnVal,
                    message: "Lecture updated successfully",
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
    deleteLecture(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const returnVal = yield db_1.db.delete(schema_1.lecture).where((0, drizzle_orm_1.eq)(schema_1.lecture.id, id));
                return {
                    data: returnVal,
                    message: "Lecture deleted successfully",
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
exports.default = new lectureService();
