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
class roadCertificationService {
    getRoadCertificationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Your code here
            try {
                const returnVal = yield db_1.db.select({
                    id: schema_1.roadCertification.id,
                    name: schema_1.roadCertification.name,
                    expDate: schema_1.roadCertification.expDate,
                    issueDate: schema_1.roadCertification.issueDate,
                    courseId: schema_1.roadCertification.courseId,
                    studentId: schema_1.roadCertification.studentId
                })
                    .from(schema_1.roadCertification)
                    .where((0, drizzle_orm_1.eq)(schema_1.roadCertification.id, id));
                return {
                    message: returnVal,
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
    getALLRoadCertification() {
        return __awaiter(this, void 0, void 0, function* () {
            // Your code here
            try {
                const returnVal = yield db_1.db.select({
                    id: schema_1.roadCertification.id,
                    name: schema_1.roadCertification.name,
                    expDate: schema_1.roadCertification.expDate,
                    issueDate: schema_1.roadCertification.issueDate,
                    courseId: schema_1.roadCertification.courseId,
                    studentId: schema_1.roadCertification.studentId
                })
                    .from(schema_1.roadCertification);
                return {
                    message: returnVal,
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
    createRoadCertification(roadCertificationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Your code here
            try {
                const returnVal = yield db_1.db.insert(schema_1.roadCertification).values({
                    name: roadCertificationDto.name,
                    expDate: roadCertificationDto.expDate,
                    issueDate: roadCertificationDto.issueDate,
                    courseId: roadCertificationDto.courseId,
                    studentId: roadCertificationDto.studentId
                });
                return {
                    message: returnVal,
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
    updateRoadCertification(roadCertificationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Your code here
            try {
                const returnVal = yield db_1.db.update(schema_1.roadCertification).set({
                    name: roadCertificationDto.name,
                    expDate: roadCertificationDto.expDate,
                    issueDate: roadCertificationDto.issueDate,
                    courseId: roadCertificationDto.courseId,
                    studentId: roadCertificationDto.studentId
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.roadCertification.id, roadCertificationDto.id));
                return {
                    message: returnVal,
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
    deleteRoadCertification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Your code here
            try {
                const returnVal = yield db_1.db.delete(schema_1.roadCertification).where((0, drizzle_orm_1.eq)(schema_1.roadCertification.id, id));
                return {
                    message: returnVal,
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
exports.default = new roadCertificationService();
