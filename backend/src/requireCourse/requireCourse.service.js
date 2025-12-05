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
class requireCourseService {
    getAllRequireCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requireCourses = yield db_1.db.select({
                    courseId: schema_1.requireCourse.courseId,
                    rCourseId: schema_1.requireCourse.rCourseId
                })
                    .from(schema_1.requireCourse);
                return {
                    message: "Get all requireCourses",
                    status: 200,
                    data: requireCourses
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
    getRequireCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requireCourses = yield db_1.db.select({
                    courseId: schema_1.requireCourse.courseId,
                    rCourseId: schema_1.requireCourse.rCourseId
                })
                    .from(schema_1.requireCourse)
                    .where((0, drizzle_orm_1.eq)(schema_1.requireCourse.courseId, courseId));
                return {
                    message: "Get requireCourse by id",
                    status: 200,
                    data: requireCourses
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
    insertRequireCourse(courseId, rCourseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // first find requireCourse that has courseId and rCourseId
                const insertedRequireCourse = yield db_1.db.select({
                    courseId: schema_1.requireCourse.courseId,
                    rCourseId: schema_1.requireCourse.rCourseId
                })
                    .from(schema_1.requireCourse)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.requireCourse.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.requireCourse.rCourseId, rCourseId)));
                if (insertedRequireCourse.length > 0) {
                    return {
                        message: "RequireCourse already exists",
                        status: 400
                    };
                }
                yield db_1.db.insert(schema_1.requireCourse)
                    .values({
                    courseId: courseId,
                    rCourseId: rCourseId
                });
                return {
                    message: "Inserted requireCourse",
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
    updateRequireCourse(courseId, rCourseId, newRCourseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // first find requireCourse that has courseId and rCourseId
                const requireCourses = yield db_1.db.select({
                    courseId: schema_1.requireCourse.courseId,
                    rCourseId: schema_1.requireCourse.rCourseId
                })
                    .from(schema_1.requireCourse)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.requireCourse.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.requireCourse.rCourseId, rCourseId)));
                if (requireCourses.length == 0) {
                    return {
                        message: "RequireCourse not found",
                        status: 400
                    };
                }
                // update requireCourse that has courseId and rCourseId
                yield db_1.db.update(schema_1.requireCourse)
                    .set({
                    rCourseId: newRCourseId
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.requireCourse.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.requireCourse.rCourseId, rCourseId)));
                return {
                    message: "Updated requireCourse",
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
    deleteRequireCourse(courseId, rCourseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // first find requireCourse that has courseId and rCourseId
                const requireCourses = yield db_1.db.select({
                    courseId: schema_1.requireCourse.courseId,
                    rCourseId: schema_1.requireCourse.rCourseId
                })
                    .from(schema_1.requireCourse)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.requireCourse.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.requireCourse.rCourseId, rCourseId)));
                if (requireCourses.length == 0) {
                    return {
                        message: "RequireCourse not found",
                        status: 400
                    };
                }
                // delete requireCourse that has courseId and rCourseId
                yield db_1.db.delete(schema_1.requireCourse)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.requireCourse.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.requireCourse.rCourseId, rCourseId)));
                return {
                    message: "Deleted requireCourse",
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
    deleteRequireCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // first find requireCourse that has courseId
                const requireCourses = yield db_1.db.select({
                    courseId: schema_1.requireCourse.courseId,
                    rCourseId: schema_1.requireCourse.rCourseId
                })
                    .from(schema_1.requireCourse)
                    .where((0, drizzle_orm_1.eq)(schema_1.requireCourse.courseId, courseId));
                if (requireCourses.length == 0) {
                    return {
                        message: "RequireCourse not found",
                        status: 400
                    };
                }
                // delete requireCourse that has courseId
                yield db_1.db.delete(schema_1.requireCourse)
                    .where((0, drizzle_orm_1.eq)(schema_1.requireCourse.courseId, courseId));
                return {
                    message: "Deleted requireCourse by id",
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
    deleteAllRequireCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.db.delete(schema_1.requireCourse);
                return {
                    message: "Deleted all requireCourses",
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
exports.default = new requireCourseService();
