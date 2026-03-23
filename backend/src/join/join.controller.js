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
const join_service_1 = __importDefault(require("./join.service"));
class joinController {
    getJoins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield join_service_1.default.getAllJoin();
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
    getJoinById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield join_service_1.default.getJoinById(Number(req.params.courseId), Number(req.params.studentId));
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
    getJoinByCourseId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield join_service_1.default.getJoinByCourseId(Number(req.params.courseId));
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
    getJoinByTeacherId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield join_service_1.default.getJoinByTeacherId(Number(req.params.teacherId));
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
    getJoinByStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield join_service_1.default.getJoinByStudentId(Number(req.params.studentId));
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
    createJoin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId, studentId } = req.body;
            try {
                const response = yield join_service_1.default.createJoin(courseId, studentId);
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
    updateJoin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId, studentId, progress, GPA, dateComplete, dateStart } = req.body;
            if (!courseId || !studentId || progress === undefined) {
                return res.status(400).json({
                    message: "Thiếu thông tin bắt buộc: courseId, studentId, progress",
                    status: 400
                });
            }
            // Validate progress
            if (progress < 0 || progress > 100) {
                return res.status(400).json({
                    message: "Tiến độ phải từ 0 đến 100",
                    status: 400
                });
            }
            // Validate GPA
            if (GPA !== null && GPA !== undefined && (GPA < 0 || GPA > 10)) {
                return res.status(400).json({
                    message: "GPA phải từ 0 đến 10",
                    status: 400
                });
            }
            try {
                const response = yield join_service_1.default.updateJoin({
                    courseId: Number(courseId),
                    studentId: Number(studentId),
                    progress: Number(progress),
                    GPA: GPA !== null && GPA !== undefined ? Number(GPA) : null,
                    dateComplete: dateComplete || null,
                    dateStart: dateStart || new Date().toISOString().split('T')[0]
                });
                return res.status(response.status).json(response);
            }
            catch (error) {
                return res.status(500).json({
                    message: (error === null || error === void 0 ? void 0 : error.message) || "Lỗi server khi cập nhật",
                    status: 500
                });
            }
        });
    }
    deleteJoin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId, studentId } = req.params;
            if (!courseId || !studentId) {
                return res.status(400).json({
                    message: "Thiếu courseId hoặc studentId",
                    status: 400
                });
            }
            try {
                const response = yield join_service_1.default.deleteJoin(Number(courseId), Number(studentId));
                return res.status(response.status).json(response);
            }
            catch (error) {
                return res.status(500).json({
                    message: (error === null || error === void 0 ? void 0 : error.message) || "Lỗi server khi xóa",
                    status: 500
                });
            }
        });
    }
}
exports.default = new joinController();
