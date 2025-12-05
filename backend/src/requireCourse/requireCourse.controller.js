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
const requireCourse_service_1 = __importDefault(require("./requireCourse.service"));
class requireCourseController {
    getRequireCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield requireCourse_service_1.default.getAllRequireCourses();
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRequireCourseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield requireCourse_service_1.default.getRequireCourseById(Number(req.params.courseId));
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    insertRequireCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield requireCourse_service_1.default.insertRequireCourse(req.body.courseId, req.body.rCourseId);
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateRequireCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield requireCourse_service_1.default.updateRequireCourse(req.body.courseId, req.body.rCourseId, req.body.newCourseId);
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteRequireCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield requireCourse_service_1.default.deleteRequireCourse(req.body.courseId, req.body.rCourseId);
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteAllRequireCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield requireCourse_service_1.default.deleteAllRequireCourses();
                return res.status(response.status).send(response);
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
exports.default = new requireCourseController();
