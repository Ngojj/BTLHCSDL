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
const course_service_1 = __importDefault(require("./course.service"));
class CourseController {
    getAllCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield course_service_1.default.getAllCourses();
                return res.status(courses.status).send(courses);
            }
            catch (error) {
                res.status(500).json({
                    message: error
                });
            }
        });
    }
    getAllCourseWithTeacherInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield course_service_1.default.getAllCoursesWithTeacherInfo();
                return res.status(courses.status).send(courses);
            }
            catch (error) {
                return {
                    message: "Invalid: " + error,
                    status: 500
                };
            }
        });
    }
    getAllCourseByTeacherId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { teacherId } = req.params;
                const courses = yield course_service_1.default.getAllCoursesWithTeacherInfoByTeacherId(Number(teacherId));
                return res.status(courses.status).send(courses);
            }
            catch (error) {
                return {
                    message: "Invalid: " + error,
                    status: 500
                };
            }
        });
    }
    getCourseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const course = yield course_service_1.default.getCourseById(Number(id));
                if (!course) {
                    return res.status(404).json({
                        message: 'Course does not exist'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: course
                });
            }
            catch (error) {
                res.status(500).json({
                    message: error
                });
            }
        });
    }
    getCourseByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                console.log(name);
                const course = yield course_service_1.default.getCourseByName(name);
                if (!course) {
                    return res.status(404).json({
                        message: 'Course does not exist'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: course
                });
            }
            catch (error) {
                res.status(500).json({
                    message: error
                });
            }
        });
    }
    createNewCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseName, language, description, teacherId, price, topics, avgQuiz } = req.body;
                console.log(req.body);
                const newCourse = yield course_service_1.default.createNewCourse(courseName, language, description, teacherId, price, topics, avgQuiz);
                return res.status(newCourse.status).send(newCourse);
            }
            catch (error) {
                res.status(500).json({
                    message: error,
                    status: 500
                });
            }
        });
    }
    deleteCourseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const course = yield course_service_1.default.deleteCourseById(Number(id));
                if (!course) {
                    return res.status(404).json({
                        message: 'Course does not exist'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: course
                });
            }
            catch (error) {
                res.status(500).json({
                    message: error
                });
            }
        });
    }
    deleteCourseByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                const course = course_service_1.default.deleteCourseByName(name);
                if (!course) {
                    return res.status(404).json({
                        message: 'Course does not exist'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: course
                });
            }
            catch (error) {
                res.status(500).json({
                    message: error
                });
            }
        });
    }
    updateCourseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { courseName, language, description, avgQuiz, price } = req.body;
                console.log(req.body);
                const course = yield course_service_1.default.updateCourseById(Number(id), courseName, language, description, avgQuiz, price);
                if (!course) {
                    return res.status(404).json({
                        message: 'Course does not exist'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: course
                });
            }
            catch (error) {
                res.status(500).json({
                    message: error
                });
            }
        });
    }
    updateCourseByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                const { courseName, language, description, avgQuiz, price } = req.body;
                const course = yield course_service_1.default.updateCourseByName(name, courseName, language, description, avgQuiz, price);
                if (!course) {
                    return res.status(404).json({
                        message: 'Course does not exist'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: course
                });
            }
            catch (error) {
                res.status(500).json({
                    message: error
                });
            }
        });
    }
}
exports.default = new CourseController();
