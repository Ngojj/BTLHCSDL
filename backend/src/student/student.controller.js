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
const student_service_1 = __importDefault(require("./student.service"));
const user_service_1 = __importDefault(require("../user/user.service"));
class StudentController {
    constructor() {
        this.getAllStudents = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield student_service_1.default.getAllStudents();
                if (students.length === 0) {
                    return res.status(404).json({
                        message: 'There is no student existed'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: students
                });
            }
            catch (e) {
                const message = e instanceof Error ? e.message : String(e);
                const status = message.includes("Username") || message.includes("Email") ? 400 : 500;
                res.status(status).json({
                    message
                });
            }
        });
        this.getStudentById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const student = yield student_service_1.default.getStudentById(Number(id));
                if (student.length === 0) {
                    return res.status(404).json({
                        message: 'Student does not exist'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: student[0]
                });
            }
            catch (e) {
                res.status(500).json({
                    message: e
                });
            }
        });
        this.createNewStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, username, password, email, bankName, bankAccount } = req.body;
                const newStudent = yield student_service_1.default.createStudent(firstName, lastName, username, password, email, bankName, bankAccount);
                if (!newStudent) {
                    return res.status(500).json({
                        message: 'Create student fail'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    token: newStudent.token,
                    user: newStudent.user,
                });
            }
            catch (e) {
                console.log(e);
                const message = e instanceof Error ? e.message : String(e);
                const status = message.includes("Username") || message.includes("Email") || message.includes("Tên đăng nhập đã tồn tại") || message.includes("Email đã được sử dụng") ? 400 : 500;
                res.status(status).json({
                    message
                });
            }
        });
        this.updateStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, firstName, lastName, username, password, role } = req.body;
                const existUser = yield user_service_1.default.getUserByIdWithPassword(id);
                if (!existUser || existUser.length === 0) {
                    return res.status(404).json({
                        message: 'Student ID does not exist'
                    });
                }
                const updateStudent = yield student_service_1.default.updateStudent(id, firstName, lastName, username, password, role);
                if (!updateStudent) {
                    return res.status(500).json({
                        message: 'Update student fail'
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: updateStudent
                });
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    message: e
                });
            }
        });
        this.deleteStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const existStudent = yield student_service_1.default.getStudentById(Number(id));
                if (!existStudent || existStudent.length === 0) {
                    return res.status(404).json({
                        message: 'Student ID does not exist'
                    });
                }
                const deleteStudent = yield student_service_1.default.deleteStudent(Number(id));
                if (!deleteStudent) {
                    return res.status(500).json({
                        message: 'Delete student fail',
                    });
                }
                return res.status(200).json({
                    message: 'success',
                    data: deleteStudent
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
exports.default = new StudentController();
