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
class courseTopicService {
    getAllCourseTopic() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allCourseTopic = yield db_1.db.select({
                    courseId: schema_1.courseTopic.courseId,
                    topic: schema_1.courseTopic.topic
                }).from(schema_1.courseTopic);
                return allCourseTopic;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getCourseTopicById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find course topic by courseId
                const courseTopicByCourseId = yield db_1.db.select({
                    courseId: schema_1.courseTopic.courseId,
                    topic: schema_1.courseTopic.topic
                }).from(schema_1.courseTopic)
                    .where((0, drizzle_orm_1.eq)(schema_1.courseTopic.courseId, courseId));
                return courseTopicByCourseId;
            }
            catch (err) {
                return err;
            }
        });
    }
    createCourseTopic(courseId, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find course by courseId
                // const courseByCourseId = await db.select(
                //     {
                //         id: course.id,
                //     }
                // ).from(course)
                // .where(eq(course.id, courseId));
                // if (courseByCourseId.length === 0) {
                //     return {
                //         status: 404,
                //         message: "Course not found"
                //     }
                // }
                // check if this course topic already exist
                // const courseTopicExist = await db.select(
                //     {
                //         courseId: courseTopic.courseId,
                //         topic: courseTopic.topic
                //     }
                // ).from(courseTopic)
                // .where(eq(courseTopic.courseId, courseId))
                // if (courseTopicExist.length !== 0) {
                //     return {
                //         status: 404,
                //         message: "This course topic already exist"
                //     }
                // }
                // create course topic
                const newCourseTopic = yield db_1.db.insert(schema_1.courseTopic)
                    .values({
                    courseId: courseId,
                    topic: topic
                })
                    .returning({
                    courseId: schema_1.courseTopic.courseId,
                    topic: schema_1.courseTopic.topic
                });
                return {
                    message: "Successfully created course topic",
                    data: {
                        courseId: newCourseTopic[0].courseId,
                        topic: newCourseTopic[0].topic
                    },
                    status: 200
                };
            }
            catch (err) {
                return err;
            }
        });
    }
    updateCourseTopic(courseId, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find courseTopic by courseId
                const courseTopicByCourseId = yield db_1.db.select({
                    courseId: schema_1.courseTopic.courseId,
                    topic: schema_1.courseTopic.topic
                }).from(schema_1.courseTopic)
                    .where((0, drizzle_orm_1.eq)(schema_1.courseTopic.courseId, courseId));
                if (courseTopicByCourseId.length === 0) {
                    return {
                        status: 404,
                        message: "Course topic not found"
                    };
                }
                // update course topic
                const updateCourseTopic = yield db_1.db.update(schema_1.courseTopic)
                    .set({
                    topic: topic
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.courseTopic.courseId, courseId))
                    .returning({
                    courseId: schema_1.courseTopic.courseId,
                    topic: schema_1.courseTopic.topic
                });
                return {
                    message: "Successfully updated course topic",
                    data: {
                        courseId: updateCourseTopic[0].courseId,
                        topic: updateCourseTopic[0].topic
                    },
                    status: 200
                };
            }
            catch (err) {
                return {
                    status: 505,
                    message: err
                };
            }
        });
    }
    deleteCourseTopic(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find course topic by courseId
                const courseTopicByCourseId = yield db_1.db.select({
                    courseId: schema_1.courseTopic.courseId,
                    topic: schema_1.courseTopic.topic
                }).from(schema_1.courseTopic)
                    .where((0, drizzle_orm_1.eq)(schema_1.courseTopic.courseId, courseId));
                if (courseTopicByCourseId.length === 0) {
                    return {
                        status: 404,
                        message: "Course topic not found"
                    };
                }
                // delete course topic
                yield db_1.db.delete(schema_1.courseTopic)
                    .where((0, drizzle_orm_1.eq)(schema_1.courseTopic.courseId, courseId));
                return {
                    message: "Successfully deleted course topic",
                    status: 200
                };
            }
            catch (err) {
                return {
                    status: 500,
                    message: err
                };
            }
        });
    }
    deleteAllCourseTopicsInThisCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find course topic by courseId
                const courseTopicByCourseId = yield db_1.db.select({
                    courseId: schema_1.courseTopic.courseId,
                    topic: schema_1.courseTopic.topic
                }).from(schema_1.courseTopic)
                    .where((0, drizzle_orm_1.eq)(schema_1.courseTopic.courseId, courseId));
                if (courseTopicByCourseId.length === 0) {
                    return {
                        status: 404,
                        message: "Course topic not found"
                    };
                }
                // delete all course topics in this course
                yield db_1.db.delete(schema_1.courseTopic)
                    .where((0, drizzle_orm_1.eq)(schema_1.courseTopic.courseId, courseId));
                return {
                    message: "Successfully deleted all course topics in this course",
                    status: 200
                };
            }
            catch (err) {
                return {
                    status: 500,
                    message: err
                };
            }
        });
    }
}
exports.default = new courseTopicService();
