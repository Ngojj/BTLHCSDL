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
class includeCourseService {
    getAllIncludeCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield db_1.db.select({
                    rmId: schema_1.includeCourse.rmId,
                    courseId: schema_1.includeCourse.courseId,
                    order: schema_1.includeCourse.order
                })
                    .from(schema_1.includeCourse);
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
    getIncludeCourseById(rmId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield db_1.db.select({
                    rmId: schema_1.includeCourse.rmId,
                    courseId: schema_1.includeCourse.courseId,
                    order: schema_1.includeCourse.order
                })
                    .from(schema_1.includeCourse)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.includeCourse.rmId, rmId), (0, drizzle_orm_1.eq)(schema_1.includeCourse.courseId, courseId)));
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
    getIncludeCourseByrmId(rmId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseInIncludeCourse = yield db_1.db
                    .select({
                    courseId: schema_1.course.id,
                    avgQuiz: schema_1.course.avgQuiz,
                    courseName: schema_1.course.name,
                    creationTime: schema_1.course.creTime,
                    description: schema_1.course.description,
                    languege: schema_1.course.language,
                    price: schema_1.course.price,
                    teacherId: schema_1.course.teacherId,
                    teacherLastName: schema_1.user.lastName,
                    teacherFirstName: schema_1.user.firstName
                })
                    .from(schema_1.includeCourse)
                    .innerJoin(schema_1.course, (0, drizzle_orm_1.eq)(schema_1.course.id, schema_1.includeCourse.courseId))
                    .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.course.teacherId, schema_1.user.id))
                    .where((0, drizzle_orm_1.eq)(schema_1.includeCourse.rmId, rmId));
                return {
                    data: courseInIncludeCourse,
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
    getRoadmapOfStudentByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseJoin = yield db_1.db
                    .select({
                    courseId: schema_1.join.courseId
                })
                    .from(schema_1.join)
                    .where((0, drizzle_orm_1.eq)(schema_1.join.studentId, studentId));
                if (courseJoin.length === 0) {
                    throw new Error("Không tìm thấy danh sách khóa sinh viên tham gia!");
                }
                const courseIds = courseJoin.map((id) => id.courseId);
                const roadmaps = yield db_1.db
                    .select({
                    id: schema_1.roadMap.id,
                    name: schema_1.roadMap.name,
                    description: schema_1.roadMap.description,
                    instruction: schema_1.roadMap.instruction,
                    teacherId: schema_1.roadMap.teacherId,
                    teacherFirstName: schema_1.user.firstName,
                    teacherLastName: schema_1.user.lastName
                })
                    .from(schema_1.roadMap)
                    .innerJoin(schema_1.includeCourse, (0, drizzle_orm_1.eq)(schema_1.includeCourse.rmId, schema_1.roadMap.id))
                    .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.user.id, schema_1.roadMap.teacherId))
                    .where((0, drizzle_orm_1.inArray)(schema_1.includeCourse.courseId, courseIds));
                const uniqueRoadmaps = Array.from(new Map(roadmaps.map((rm) => [rm.id, rm])).values());
                return {
                    message: "Get roadmaps by student ID successfully",
                    status: 200,
                    data: uniqueRoadmaps
                };
            }
            catch (error) {
                return {
                    message: error instanceof Error ? error.message : "Unknown error",
                    status: 500
                };
            }
        });
    }
    createIncludeCourse(includeCourseDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(includeCourseDto);
                yield db_1.db.insert(schema_1.includeCourse)
                    .values({
                    rmId: includeCourseDto.rmId,
                    courseId: includeCourseDto.courseId,
                    order: includeCourseDto.order
                })
                    .returning({
                    rmId: schema_1.includeCourse.rmId,
                    courseId: schema_1.includeCourse.courseId,
                    order: schema_1.includeCourse.order
                });
                return {
                    message: "IncludeCourse created",
                    status: 200,
                    data: {
                        rmId: includeCourseDto.rmId,
                        courseId: includeCourseDto.courseId,
                        order: includeCourseDto.order
                    }
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
    updateIncludeCourse(includeCourseDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.db.update(schema_1.includeCourse)
                    .set({
                    order: includeCourseDto.order
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.includeCourse.rmId, includeCourseDto.rmId), (0, drizzle_orm_1.eq)(schema_1.includeCourse.courseId, includeCourseDto.courseId)));
                return {
                    message: "IncludeCourse updated",
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
    deleteIncludeCourse(rmId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.db.delete(schema_1.includeCourse)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.includeCourse.rmId, rmId), (0, drizzle_orm_1.eq)(schema_1.includeCourse.courseId, courseId)));
                return {
                    message: "IncludeCourse deleted",
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
exports.default = new includeCourseService();
