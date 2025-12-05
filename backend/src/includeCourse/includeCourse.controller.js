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
const includeCourse_service_1 = __importDefault(require("./includeCourse.service"));
class includeCourseController {
    getAllIncludeCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield includeCourse_service_1.default.getAllIncludeCourse();
                return res.status(All.status).send(All);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getIncludeCourseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield includeCourse_service_1.default.getIncludeCourseById(Number(req.params.rmId), Number(req.params.courseId));
                return res.status(All.status).send(All);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getIncludeCourseByrmId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield includeCourse_service_1.default.getIncludeCourseByrmId(Number(req.params.rmId));
                return res.status(All.status).send(All);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getGetRoadmapOfStudentByStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield includeCourse_service_1.default.getRoadmapOfStudentByStudentId(Number(req.params.studentId));
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
    createIncludeCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resonse = yield includeCourse_service_1.default.createIncludeCourse(req.body);
                return res.status(resonse.status).send(resonse);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateIncludeCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield includeCourse_service_1.default.updateIncludeCourse(req.body);
                return res.status(200).send();
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteIncludeCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield includeCourse_service_1.default.deleteIncludeCourse(Number(req.params.rmId), Number(req.params.courseId));
                return res.status(200).send();
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
exports.default = new includeCourseController();
