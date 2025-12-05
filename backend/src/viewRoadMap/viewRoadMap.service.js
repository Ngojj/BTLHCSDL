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
class viewRoadMapService {
    getAllRoadMap() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const all = db_1.db.select({
                    rmId: schema_1.viewRoadMap.rmId,
                    studentId: schema_1.viewRoadMap.studentId,
                    suitability: schema_1.viewRoadMap.suitability,
                    timeSuitabilty: schema_1.viewRoadMap.timeSuitabilty,
                    courseSui: schema_1.viewRoadMap.courseSui
                })
                    .from(schema_1.viewRoadMap);
                return {
                    data: all,
                    status: 200,
                    message: "All RoadMap found"
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
    getRoadMapById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = db_1.db.select({
                    rmId: schema_1.viewRoadMap.rmId,
                    studentId: schema_1.viewRoadMap.studentId,
                    suitability: schema_1.viewRoadMap.suitability,
                    timeSuitabilty: schema_1.viewRoadMap.timeSuitabilty,
                    courseSui: schema_1.viewRoadMap.courseSui
                })
                    .from(schema_1.viewRoadMap)
                    .where((0, drizzle_orm_1.eq)(schema_1.viewRoadMap.rmId, id));
                return {
                    data: roadMap,
                    status: 200,
                    message: "RoadMap found"
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
    getRoadMapByStudentId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = db_1.db.select({
                    rmId: schema_1.viewRoadMap.rmId,
                    studentId: schema_1.viewRoadMap.studentId,
                    suitability: schema_1.viewRoadMap.suitability,
                    timeSuitabilty: schema_1.viewRoadMap.timeSuitabilty,
                    courseSui: schema_1.viewRoadMap.courseSui
                })
                    .from(schema_1.viewRoadMap)
                    .where((0, drizzle_orm_1.eq)(schema_1.viewRoadMap.studentId, id));
                return {
                    data: roadMap,
                    status: 200,
                    message: "RoadMap found"
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
    getRoadMapByStudentIdAndRoadMapId(studentId, roadMapId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = db_1.db.select({
                    rmId: schema_1.viewRoadMap.rmId,
                    studentId: schema_1.viewRoadMap.studentId,
                    suitability: schema_1.viewRoadMap.suitability,
                    timeSuitabilty: schema_1.viewRoadMap.timeSuitabilty,
                    courseSui: schema_1.viewRoadMap.courseSui
                })
                    .from(schema_1.viewRoadMap)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.viewRoadMap.studentId, studentId), (0, drizzle_orm_1.eq)(schema_1.viewRoadMap.rmId, roadMapId)));
                return {
                    data: roadMap,
                    status: 200,
                    message: "RoadMap found"
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
    createRoadMap(viewRoadMapDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = db_1.db.insert(schema_1.viewRoadMap)
                    .values(viewRoadMapDto);
                return {
                    message: "RoadMap created successfully",
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
    updateRoadMap(viewRoadMapDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = db_1.db.update(schema_1.viewRoadMap)
                    .set({
                    suitability: viewRoadMapDto.suitability,
                    timeSuitabilty: viewRoadMapDto.suitability,
                    courseSui: viewRoadMapDto.courseSui
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.viewRoadMap.rmId, viewRoadMapDto.rmId), (0, drizzle_orm_1.eq)(schema_1.viewRoadMap.studentId, viewRoadMapDto.studentId)));
                return {
                    message: "RoadMap updated successfully",
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
    deleteRoadMap(rmId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = db_1.db.delete(schema_1.viewRoadMap)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.viewRoadMap.rmId, rmId), (0, drizzle_orm_1.eq)(schema_1.viewRoadMap.studentId, studentId)));
                return {
                    message: "RoadMap deleted successfully",
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
exports.default = new viewRoadMapService();
