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
const teacher_service_1 = __importDefault(require("./teacher.service"));
const user_service_1 = __importDefault(require("../user/user.service"));
class TeacherController {
    constructor() {
        this.getAllTeachers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teachers = yield teacher_service_1.default.getAllTeachers();
                if (teachers.length === 0) {
                    return res.status(404).json({
                        message: 'There is no teacher existed'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: teachers
                });
            }
            catch (e) {
                res.status(500).json({
                    message: e
                });
            }
        });
        this.getTeacherById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const teacher = yield teacher_service_1.default.getTeacherById(Number(id));
                if (!teacher) {
                    return res.status(404).json({
                        message: 'Teacher does not exist'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: teacher
                });
            }
            catch (e) {
                res.status(500).json({
                    message: e
                });
            }
        });
        this.createNewTeacher = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, username, password, email, bankName, bankAccount } = req.body;
                const newTeacher = yield teacher_service_1.default.createNewTeacher(firstName, lastName, username, password, email, bankName, bankAccount);
                if (!newTeacher) {
                    return res.status(400).json({
                        message: 'Failed to create new teacher'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    token: newTeacher.token,
                    user: newTeacher.user,
                });
            }
            catch (e) {
                console.log(e);
                const message = e instanceof Error ? e.message : String(e);
                const status = message.includes("Username") || message.includes("Email") ? 400 : 500;
                res.status(status).json({
                    message
                });
            }
        });
        this.updateTeacher = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, firstName, lastName, username, password, role, email, bankName, bankAccount, } = req.body;
                const existUser = yield user_service_1.default.getUserByIdWithPassword(id);
                const updateTeacher = yield teacher_service_1.default.updateTeacher(id, firstName, lastName, username, password, role, email, bankName, bankAccount, existUser[0].password);
                if (!updateTeacher) {
                    return res.status(400).json({
                        message: 'Failed to update teacher'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: updateTeacher
                });
            }
            catch (e) {
                res.status(500).json({
                    message: e.message
                });
            }
        });
        this.deleteTeacher = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const teacher = yield teacher_service_1.default.deleteTeacher(Number(id));
                if (!teacher) {
                    return res.status(404).json({
                        message: 'Teacher does not exist'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: teacher
                });
            }
            catch (e) {
                res.status(500).json({
                    message: e
                });
            }
        });
    }
}
exports.default = new TeacherController();
