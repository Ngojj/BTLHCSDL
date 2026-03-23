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
class roadMapService {
    getAllRoadMaps() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all roadmaps
            try {
                const roadMaps = yield db_1.db.select({
                    id: schema_1.roadMap.id,
                    instruction: schema_1.roadMap.instruction,
                    description: schema_1.roadMap.description,
                    name: schema_1.roadMap.name,
                    teacherId: schema_1.roadMap.teacherId
                }).
                    from(schema_1.roadMap);
                return {
                    data: roadMaps,
                    status: 200,
                    message: "Roadmaps fetched successfully"
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
            // Get roadmap by id
            try {
                const roadMapById = yield db_1.db.select({
                    id: schema_1.roadMap.id,
                    instruction: schema_1.roadMap.instruction,
                    description: schema_1.roadMap.description,
                    name: schema_1.roadMap.name,
                    teacherId: schema_1.roadMap.teacherId
                }).
                    from(schema_1.roadMap).
                    where((0, drizzle_orm_1.eq)(schema_1.roadMap.id, id));
                return {
                    data: roadMapById,
                    status: 200,
                    message: "Roadmap fetched successfully"
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
    createRoadMap(roadMapData, includeCourseDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create roadmap
            try {
                // print out the roadMapData and includeCourseDto
                console.log(roadMapData);
                console.log(includeCourseDto);
                const newRoadMap = yield db_1.db.insert(schema_1.roadMap).
                    values({
                    instruction: roadMapData.instruction,
                    description: roadMapData.description,
                    name: roadMapData.name,
                    teacherId: roadMapData.teacherId
                })
                    .$returningId();
                // Add courses to roadmap
                let order = 1;
                yield Promise.all(includeCourseDto.map((course) => __awaiter(this, void 0, void 0, function* () {
                    yield db_1.db.insert(schema_1.includeCourse)
                        .values({
                        rmId: newRoadMap[0].id,
                        courseId: course.courseId,
                        order: order++
                    });
                })));
                return {
                    status: 200,
                    message: "Roadmap created successfully"
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
    updateRoadMap(roadMapData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update roadmap
            try {
                yield db_1.db.update(schema_1.roadMap).
                    set({
                    instruction: roadMapData.instruction,
                    description: roadMapData.description,
                    name: roadMapData.name,
                    teacherId: roadMapData.teacherId
                }).
                    where((0, drizzle_orm_1.eq)(schema_1.roadMap.id, roadMapData.id));
                return {
                    status: 200,
                    message: "Roadmap updated successfully"
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
    deleteRoadMap(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete roadmap
            try {
                yield db_1.db.delete(schema_1.roadMap).
                    where((0, drizzle_orm_1.eq)(schema_1.roadMap.id, id));
                return {
                    status: 200,
                    message: "Roadmap deleted successfully"
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
exports.default = new roadMapService();
