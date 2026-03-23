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
const student_service_1 = __importDefault(require("../student/student.service"));
class joinService {
    UpdateGPAAndProgress(quizId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const sectionResult = yield db_1.db
                    .select({
                    sectionId: schema_1.quiz.sectionId,
                })
                    .from(schema_1.quiz)
                    .where((0, drizzle_orm_1.eq)(schema_1.quiz.id, quizId));
                const sectionId = (_a = sectionResult[0]) === null || _a === void 0 ? void 0 : _a.sectionId;
                const courseResult = yield db_1.db
                    .select({
                    courseId: schema_1.section.courseId,
                })
                    .from(schema_1.section)
                    .where((0, drizzle_orm_1.eq)(schema_1.section.id, sectionId));
                const courseId = (_b = courseResult[0]) === null || _b === void 0 ? void 0 : _b.courseId;
                const quizListResult = yield db_1.db
                    .select({
                    quizId: schema_1.quiz.id,
                })
                    .from(schema_1.quiz)
                    .innerJoin(schema_1.section, (0, drizzle_orm_1.eq)(schema_1.quiz.sectionId, schema_1.section.id))
                    .where((0, drizzle_orm_1.eq)(schema_1.section.courseId, courseId));
                const totalQuizCount = quizListResult.length;
                const quizIds = quizListResult.map((q) => q.quizId);
                const allQuizScores = yield db_1.db
                    .select({
                    quizId: schema_1.dO.quizId,
                    score: schema_1.dO.score,
                })
                    .from(schema_1.dO)
                    .where((0, drizzle_orm_1.eq)(schema_1.dO.studentId, studentId));
                const filteredScores = allQuizScores.filter((score) => quizIds.includes(score.quizId));
                const filterDOScores = {};
                for (const d of allQuizScores) {
                    filterDOScores[d.quizId] = d.score || 0;
                }
                const userQuizScores = quizIds.map((id) => {
                    if (filterDOScores[id] !== undefined) {
                        const scoresForQuiz = filteredScores.filter((score) => score.quizId === id);
                        const totalScore = scoresForQuiz.reduce((sum, item) => { var _a; return sum + ((_a = item.score) !== null && _a !== void 0 ? _a : 0); }, 0);
                        const averageScore = scoresForQuiz.length > 0 ? totalScore / scoresForQuiz.length : 0;
                        return {
                            quizId: id,
                            averageScore,
                        };
                    }
                });
                let quizzesCompleted = 0;
                for (const sc of userQuizScores) {
                    if (sc !== undefined) {
                        quizzesCompleted++;
                    }
                }
                const totalScore = userQuizScores.reduce((sum, quiz) => { var _a; return sum + ((_a = quiz === null || quiz === void 0 ? void 0 : quiz.averageScore) !== null && _a !== void 0 ? _a : 0); }, 0);
                const GPA = quizzesCompleted > 0 ? totalScore / quizzesCompleted : 0;
                const progress = Math.round((quizzesCompleted / totalQuizCount) * 100);
                if (progress === 100) {
                    student_service_1.default.updateNumberOfCourseComplete(studentId);
                }
                yield db_1.db
                    .update(schema_1.join)
                    .set({
                    progress,
                    GPA,
                    dateComplete: quizzesCompleted === totalQuizCount ? new Date() : null,
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.join.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.join.studentId, studentId)));
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllJoin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const joins = yield db_1.db.select({
                    courseId: schema_1.join.courseId,
                    studentId: schema_1.join.studentId,
                    dateComplete: schema_1.join.dateComplete,
                    dateStart: schema_1.join.dateStart,
                    progress: schema_1.join.progress,
                    GPA: schema_1.join.GPA
                })
                    .from(schema_1.join);
                return {
                    data: joins,
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
    getJoinCompleted(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completeCourses = yield db_1.db
                    .select()
                    .from(schema_1.join)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.join.studentId, studentId), (0, drizzle_orm_1.eq)(schema_1.join.progress, 100)));
                return completeCourses.length;
            }
            catch (e) {
                console.log(e);
                return 0;
            }
        });
    }
    getJoinEnroll(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completeCourses = yield db_1.db
                    .select()
                    .from(schema_1.join)
                    .where((0, drizzle_orm_1.eq)(schema_1.join.studentId, studentId));
                return completeCourses.length;
            }
            catch (e) {
                console.log(e);
                return 0;
            }
        });
    }
    getJoinByTeacherId(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const joinData = yield db_1.db.select({
                    courseId: schema_1.join.courseId,
                    studentId: schema_1.join.studentId,
                    dateComplete: schema_1.join.dateComplete,
                    dateStart: schema_1.join.dateStart,
                    progress: schema_1.join.progress,
                    GPA: schema_1.join.GPA,
                    courseName: schema_1.course.name,
                    description: schema_1.course.description,
                    price: schema_1.course.price,
                    creationTime: schema_1.course.creTime,
                    teacherId: schema_1.course.teacherId,
                    teacherFirstName: schema_1.user.firstName,
                    teacherLastName: schema_1.user.lastName,
                })
                    .from(schema_1.join)
                    .leftJoin(schema_1.course, (0, drizzle_orm_1.eq)(schema_1.join.courseId, schema_1.course.id))
                    .where((0, drizzle_orm_1.eq)(schema_1.course.teacherId, teacherId))
                    .leftJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.course.teacherId, schema_1.user.id));
                if (joinData.length === 0) {
                    return {
                        data: "Join not found",
                        status: 404
                    };
                }
                return {
                    data: joinData,
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
    getJoinById(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const joinData = yield db_1.db.select({
                    courseId: schema_1.join.courseId,
                    studentId: schema_1.join.studentId,
                    dateComplete: schema_1.join.dateComplete,
                    dateStart: schema_1.join.dateStart,
                    progress: schema_1.join.progress,
                    GPA: schema_1.join.GPA
                })
                    .from(schema_1.join)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.join.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.join.studentId, studentId)));
                if (joinData.length === 0) {
                    return {
                        data: "Join not found",
                        status: 404
                    };
                }
                return {
                    data: joinData,
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
    getJoinByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const joinData = yield db_1.db.select({
                    courseId: schema_1.join.courseId,
                    studentId: schema_1.join.studentId,
                    dateComplete: schema_1.join.dateComplete,
                    dateStart: schema_1.join.dateStart,
                    progress: schema_1.join.progress,
                    GPA: schema_1.join.GPA
                })
                    .from(schema_1.join)
                    .where((0, drizzle_orm_1.eq)(schema_1.join.courseId, courseId));
                if (joinData.length === 0) {
                    return {
                        data: "Join not found",
                        status: 404
                    };
                }
                return {
                    data: joinData,
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
    getJoinByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const joinData = yield db_1.db.select({
                    courseId: schema_1.join.courseId,
                    studentId: schema_1.join.studentId,
                    dateComplete: schema_1.join.dateComplete,
                    dateStart: schema_1.join.dateStart,
                    progress: schema_1.join.progress,
                    GPA: schema_1.join.GPA,
                    courseName: schema_1.course.name,
                    description: schema_1.course.description,
                    price: schema_1.course.price,
                    creationTime: schema_1.course.creTime,
                    teacherId: schema_1.course.teacherId,
                    teacherFirstName: schema_1.user.firstName,
                    teacherLastName: schema_1.user.lastName,
                })
                    .from(schema_1.join)
                    .leftJoin(schema_1.course, (0, drizzle_orm_1.eq)(schema_1.join.courseId, schema_1.course.id))
                    .where((0, drizzle_orm_1.eq)(schema_1.join.studentId, studentId))
                    .leftJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.course.teacherId, schema_1.user.id));
                if (joinData.length === 0) {
                    return {
                        data: "Join not found",
                        status: 404
                    };
                }
                return {
                    data: joinData,
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
    createJoin(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if exists
                const checkJoin = yield db_1.db.select({
                    courseId: schema_1.join.courseId,
                    studentId: schema_1.join.studentId
                })
                    .from(schema_1.join)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.join.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.join.studentId, studentId)));
                if (checkJoin.length > 0) {
                    return {
                        message: "Bạn đã tham gia khóa học này rồi",
                        data: "Join already exists",
                        status: 400
                    };
                }
                // Check if course exists
                const courseExists = yield db_1.db.select({
                    id: schema_1.course.id
                })
                    .from(schema_1.course)
                    .where((0, drizzle_orm_1.eq)(schema_1.course.id, courseId))
                    .limit(1);
                if (courseExists.length === 0) {
                    return {
                        message: "Khóa học không tồn tại",
                        status: 404
                    };
                }
                // Check if student exists
                const studentExists = yield db_1.db.select({
                    userId: schema_1.student.userId
                })
                    .from(schema_1.student)
                    .where((0, drizzle_orm_1.eq)(schema_1.student.userId, studentId))
                    .limit(1);
                if (studentExists.length === 0) {
                    return {
                        message: "Sinh viên không tồn tại",
                        status: 404
                    };
                }
                yield db_1.db.insert(schema_1.join).values({
                    courseId: courseId,
                    studentId: studentId,
                    dateStart: new Date(),
                });
                student_service_1.default.updateNumberOfCourseEnroll(studentId);
                return {
                    message: "Đăng ký khóa học thành công",
                    status: 201,
                    data: {
                        courseId,
                        studentId
                    }
                };
            }
            catch (error) {
                const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || "Lỗi khi đăng ký khóa học";
                // Kiểm tra nếu là lỗi từ trigger (giới hạn 3 khóa học)
                if (errorMessage.includes('không thể đăng ký thêm') ||
                    errorMessage.includes('3 khóa đang học')) {
                    return {
                        message: errorMessage,
                        status: 400,
                        error: errorMessage
                    };
                }
                // Kiểm tra lỗi foreign key
                if (errorMessage.includes('foreign key') || errorMessage.includes('FOREIGN KEY')) {
                    return {
                        message: "Khóa học hoặc sinh viên không tồn tại",
                        status: 400,
                        error: errorMessage
                    };
                }
                // Lỗi khác
                console.error("Error creating join:", error);
                return {
                    message: errorMessage,
                    status: 500,
                    error: errorMessage
                };
            }
        });
    }
    updateJoin(joinDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if exists
                const checkJoin = yield db_1.db.select({
                    courseId: schema_1.join.courseId,
                    studentId: schema_1.join.studentId,
                    progress: schema_1.join.progress
                })
                    .from(schema_1.join)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.join.courseId, joinDto.courseId), (0, drizzle_orm_1.eq)(schema_1.join.studentId, joinDto.studentId)));
                if (checkJoin.length === 0) {
                    return {
                        message: "Không tìm thấy đăng ký khóa học",
                        status: 404
                    };
                }
                const oldProgress = checkJoin[0].progress;
                const wasCompleted = oldProgress === 100;
                const willBeCompleted = joinDto.progress === 100;
                yield db_1.db.update(schema_1.join)
                    .set({
                    dateComplete: joinDto.dateComplete ? new Date(joinDto.dateComplete) : null,
                    dateStart: new Date(joinDto.dateStart),
                    progress: joinDto.progress,
                    GPA: joinDto.GPA
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.join.courseId, joinDto.courseId), (0, drizzle_orm_1.eq)(schema_1.join.studentId, joinDto.studentId)));
                // Cập nhật số lượng khóa học hoàn thành nếu cần
                if (!wasCompleted && willBeCompleted) {
                    // Từ chưa hoàn thành -> hoàn thành
                    student_service_1.default.updateNumberOfCourseComplete(joinDto.studentId);
                }
                else if (wasCompleted && !willBeCompleted) {
                    // Từ hoàn thành -> chưa hoàn thành
                    student_service_1.default.updateNumberOfCourseComplete(joinDto.studentId);
                }
                return {
                    message: "Cập nhật thông tin khóa học thành công",
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
    deleteJoin(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if exists
                const checkJoin = yield db_1.db.select({
                    courseId: schema_1.join.courseId,
                    studentId: schema_1.join.studentId,
                    progress: schema_1.join.progress
                })
                    .from(schema_1.join)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.join.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.join.studentId, studentId)));
                if (checkJoin.length === 0) {
                    return {
                        message: "Không tìm thấy đăng ký khóa học",
                        status: 404
                    };
                }
                // Lưu progress để cập nhật số lượng khóa học
                const wasCompleted = checkJoin[0].progress === 100;
                yield db_1.db.delete(schema_1.join)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.join.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.join.studentId, studentId)));
                // Cập nhật số lượng khóa học của student
                // Nếu khóa học đã hoàn thành, giảm numberCoursesCompleted
                if (wasCompleted) {
                    student_service_1.default.decreaseNumberOfCourseComplete(studentId);
                }
                // Giảm numberCoursesEnrolled
                student_service_1.default.decreaseNumberOfCourseEnroll(studentId);
                return {
                    message: "Hủy đăng ký khóa học thành công",
                    status: 200
                };
            }
            catch (error) {
                const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || "Lỗi khi hủy đăng ký khóa học";
                return {
                    message: errorMessage,
                    error: errorMessage,
                    status: 500
                };
            }
        });
    }
}
exports.default = new joinService();
