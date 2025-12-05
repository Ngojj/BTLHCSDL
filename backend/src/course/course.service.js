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
const schema_1 = require("../db/schema");
const db_1 = require("../db/db");
const drizzle_orm_1 = require("drizzle-orm");
const courseTopic_service_1 = __importDefault(require("../courseTopic/courseTopic.service"));
class CourseService {
    constructor() {
        this.getAllCoursesWithTeacherInfo = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const coursesWithTeachers = yield db_1.db
                    .select({
                    courseId: schema_1.course.id,
                    courseName: schema_1.course.name,
                    language: schema_1.course.language,
                    description: schema_1.course.description,
                    teacherId: schema_1.course.teacherId,
                    creationTime: schema_1.course.creTime,
                    avgQuiz: schema_1.course.avgQuiz,
                    price: schema_1.course.price,
                    teacherLastName: schema_1.user.lastName,
                    teacherFirstName: schema_1.user.firstName,
                })
                    .from(schema_1.course)
                    .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.course.teacherId, schema_1.user.id)); // Assuming foreign key relationship
                return {
                    message: "Successfully get all courses with teacher info",
                    status: 200,
                    data: coursesWithTeachers
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
        this.getAllCoursesWithTeacherInfoByTeacherId = (teacherId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const coursesWithTeachers = yield db_1.db.select({
                    courseId: schema_1.course.id,
                    courseName: schema_1.course.name,
                    language: schema_1.course.language,
                    description: schema_1.course.description,
                    teacherId: schema_1.course.teacherId,
                    creationTime: schema_1.course.creTime,
                    avgQuiz: schema_1.course.avgQuiz,
                    price: schema_1.course.price,
                    teacherLastName: schema_1.user.lastName,
                    teacherFirstName: schema_1.user.firstName,
                })
                    .from(schema_1.course)
                    .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.course.teacherId, schema_1.user.id))
                    .where((0, drizzle_orm_1.eq)(schema_1.course.teacherId, teacherId));
                return {
                    message: "Successfully get all courses with teacher info",
                    status: 200,
                    data: coursesWithTeachers
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
        this.getAllCourses = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const allCourses = yield db_1.db
                    .select({
                    courseId: schema_1.course.id,
                    courseName: schema_1.course.name,
                    language: schema_1.course.language,
                    description: schema_1.course.description,
                    teacherId: schema_1.course.teacherId,
                    creationTime: schema_1.course.creTime,
                    avgQuiz: schema_1.course.avgQuiz,
                    price: schema_1.course.price,
                })
                    .from(schema_1.course);
                return {
                    message: "Successfully get all courses",
                    status: 200,
                    data: allCourses
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
        this.getCourseById = (id) => __awaiter(this, void 0, void 0, function* () {
            const returnCourse = yield db_1.db
                .select({
                courseId: schema_1.course.id,
                courseName: schema_1.course.name,
                language: schema_1.course.language,
                description: schema_1.course.description,
                teacherId: schema_1.course.teacherId,
                creationTime: schema_1.course.creTime,
                avgQuiz: schema_1.course.avgQuiz,
                price: schema_1.course.price,
            })
                .from(schema_1.course)
                .where((0, drizzle_orm_1.eq)(schema_1.course.id, id));
            if (!returnCourse || returnCourse.length === 0) {
                return null;
            }
            return returnCourse[0];
        });
        this.getCourseByName = (name) => __awaiter(this, void 0, void 0, function* () {
            const courseByName = yield db_1.db
                .select({
                courseId: schema_1.course.id,
                courseName: schema_1.course.name,
                language: schema_1.course.language,
                description: schema_1.course.description,
                teacherId: schema_1.course.teacherId,
                creationTime: schema_1.course.creTime,
                avgQuiz: schema_1.course.avgQuiz,
                price: schema_1.course.price,
            })
                .from(schema_1.course)
                .where((0, drizzle_orm_1.eq)(schema_1.course.name, name));
            if (!courseByName || courseByName.length === 0) {
                return null;
            }
            return courseByName[0];
        });
        this.createNewCourse = (courseName, language, description, teacherId, price, topics, avgQuiz) => __awaiter(this, void 0, void 0, function* () {
            try {
                // check if course already exist
                const courseExist = yield db_1.db.select({})
                    .from(schema_1.course)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.course.name, courseName), (0, drizzle_orm_1.eq)(schema_1.course.teacherId, teacherId)));
                if (courseExist.length !== 0) {
                    return {
                        message: "Course already exist",
                        status: 400
                    };
                }
                yield db_1.db.insert(schema_1.course).values({
                    name: courseName,
                    language: language,
                    description: description,
                    teacherId: teacherId,
                    creTime: new Date(),
                    avgQuiz: avgQuiz,
                    price: price,
                });
                const createdCourse = yield this.getCourseByName(courseName);
                if (!createdCourse) {
                    return {
                        message: "Failed to create course",
                        status: 500
                    };
                }
                // insert topic into course
                for (let i = 0; i < topics.length; i++) {
                    yield courseTopic_service_1.default.createCourseTopic(createdCourse.courseId, topics[i]);
                }
                return {
                    message: "Successfully created new course",
                    status: 200,
                    data: createdCourse.courseId
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
        this.deleteCourseById = (id) => __awaiter(this, void 0, void 0, function* () {
            const courseExist = yield this.getCourseById(id);
            if (!courseExist) {
                return null;
            }
            // delete all course topic of this course first
            courseTopic_service_1.default.deleteAllCourseTopicsInThisCourse(id);
            const deletedCourse = yield db_1.db.delete(schema_1.course).where((0, drizzle_orm_1.eq)(schema_1.course.id, id));
            if (!deletedCourse) {
                return null;
            }
            return courseExist;
        });
        this.deleteCourseByName = (name) => __awaiter(this, void 0, void 0, function* () {
            const courseExist = yield this.getCourseByName(name);
            if (!courseExist) {
                return null;
            }
            // delete all course topics in this course
            courseTopic_service_1.default.deleteAllCourseTopicsInThisCourse(courseExist.courseId);
            const deletedCourse = yield db_1.db.delete(schema_1.course).where((0, drizzle_orm_1.eq)(schema_1.course.name, name));
            if (!deletedCourse) {
                return null;
            }
            return courseExist;
        });
        this.updateCourseById = (id, courseName, language, description, avgQuiz, price) => __awaiter(this, void 0, void 0, function* () {
            const courseExist = yield this.getCourseById(id);
            if (!courseExist) {
                return null;
            }
            yield db_1.db.update(schema_1.course)
                .set({
                name: courseName ? courseName : courseExist.courseName,
                language: language ? language : courseExist.language,
                description: description ? description : courseExist.description,
                price: price ? price : courseExist.price,
                avgQuiz: avgQuiz ? avgQuiz : courseExist.avgQuiz,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.course.id, id));
            const updatedCourse = yield this.getCourseById(id);
            if (!updatedCourse) {
                return null;
            }
            return {
                courseId: updatedCourse.courseId,
                courseName: updatedCourse.courseName,
                language: updatedCourse.language,
                description: updatedCourse.description,
                teacherId: updatedCourse.teacherId,
                creationTime: updatedCourse.creationTime,
                avgQuiz: updatedCourse.avgQuiz,
                price: updatedCourse.price,
            };
        });
        this.updateCourseByName = (name, newName, language, description, avgQuiz, price) => __awaiter(this, void 0, void 0, function* () {
            const courseExist = yield this.getCourseByName(name);
            if (!courseExist) {
                return null;
            }
            yield db_1.db.update(schema_1.course)
                .set({
                name: newName ? newName : courseExist.courseName,
                language: language ? language : courseExist.language,
                description: description ? description : courseExist.description,
                price: price ? price : courseExist.price,
                avgQuiz: avgQuiz ? avgQuiz : courseExist.avgQuiz
            })
                .where((0, drizzle_orm_1.eq)(schema_1.course.name, name));
            const updatedCourse = yield this.getCourseByName(newName || name);
            if (!updatedCourse) {
                return null;
            }
            return {
                courseId: updatedCourse.courseId,
                courseName: updatedCourse.courseName,
                language: updatedCourse.language,
                description: updatedCourse.description,
                teacherId: updatedCourse.teacherId,
                creationTime: updatedCourse.creationTime,
                avgQuiz: updatedCourse.avgQuiz,
                price: updatedCourse.price,
            };
        });
    }
}
exports.default = new CourseService();
