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
const teacherQualification_service_1 = __importDefault(require("./teacherQualification.service"));
class teacherQualificationController {
    constructor() {
        this.getAllTeacherQualification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = teacherQualification_service_1.default.getAllTeacherQualification();
            if ((yield result).status === 200) {
                return res.status(200).json({
                    status: 200,
                    message: 'success',
                    data: (yield result).data
                });
            }
            else {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        });
    }
    getTeacherQualificationByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const result = teacherQualification_service_1.default.getTeacherQualificationByUserId(Number(userId));
            if ((yield result).status === 200) {
                return res.status(200).json({
                    status: 200,
                    message: 'success',
                    data: (yield result).data
                });
            }
            else {
                return res.status(500).json({
                    message: (yield result).message,
                    status: (yield result).status
                });
            }
        });
    }
    findTeacherQualificationByTeacherEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.params.email;
            const result = teacherQualification_service_1.default.findTeacherQualificationByTeacherEmail(email);
            if ((yield result).status === 200) {
                return res.status(200).json({
                    status: 200,
                    message: 'success',
                    data: (yield result).data
                });
            }
            else {
                return res.status(500).json({
                    message: (yield result).message,
                    status: (yield result).status
                });
            }
        });
    }
    createTeacherQualification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacherId = req.body.userId;
            const qualification = req.body.qualification;
            const result = yield teacherQualification_service_1.default.createTeacherQualification(teacherId, qualification);
            if (result.status === 200) {
                return res.status(200).json({
                    status: 200,
                    message: 'Successfully',
                    data: result.data
                });
            }
            else {
                return res.status(500).json({
                    message: result.message,
                    status: result.status
                });
            }
        });
    }
    updateTeacherQualification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacherId = req.body.userId;
            const qualification = req.body.qualification;
            const result = yield teacherQualification_service_1.default.updateTeacherQualification(teacherId, qualification);
            if (result.status === 200) {
                return res.status(200).json({
                    status: 200,
                    message: 'Successfully',
                    data: result.data
                });
            }
            else {
                return res.status(500).json({
                    message: result.message,
                    status: result.status
                });
            }
        });
    }
    deleteTeacherQualification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.body.userId;
            const result = yield teacherQualification_service_1.default.deleteTeacherQualification(userId);
            if (result.status === 200) {
                return res.status(200).json({
                    status: 200,
                    message: 'Successfully'
                });
            }
            else {
                return res.status(500).json({
                    message: result.message,
                    status: result.status
                });
            }
        });
    }
}
exports.default = new teacherQualificationController();
