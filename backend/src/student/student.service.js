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
const user_service_1 = __importDefault(require("../user/user.service"));
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const join_service_1 = __importDefault(require("../join/join.service"));
class StudentService {
    constructor() {
        this.generateUniqueStudentId = (id) => __awaiter(this, void 0, void 0, function* () {
            let uniqueId = 'ST';
            const lenId = id.toString().length;
            for (let i = 0; i < 8 - lenId; i++) {
                uniqueId += '0';
            }
            uniqueId += id.toString();
            return uniqueId;
        });
        this.getAllStudents = () => __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db
                .select({
                id: schema_1.user.id,
                firstName: schema_1.user.firstName,
                lastName: schema_1.user.lastName,
                username: schema_1.user.username,
                role: schema_1.user.role,
                email: schema_1.user.email,
                bankName: schema_1.user.bankName,
                bankAccount: schema_1.user.bankAccount,
                studentId: schema_1.student.studentId,
                enrollmentDate: schema_1.student.enrollmentDate,
                numberCourseEnrolled: schema_1.student.numberCoursesEnrolled,
                numberCourseCompleted: schema_1.student.numberCoursesCompleted
            })
                .from(schema_1.user)
                .innerJoin(schema_1.student, (0, drizzle_orm_1.eq)(schema_1.student.userId, schema_1.user.id));
        });
        this.getStudentById = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db
                .select({
                id: schema_1.user.id,
                firstName: schema_1.user.firstName,
                lastName: schema_1.user.lastName,
                username: schema_1.user.username,
                role: schema_1.user.role,
                email: schema_1.user.email,
                bankName: schema_1.user.bankName,
                bankAccount: schema_1.user.bankAccount,
                studentId: schema_1.student.studentId,
                enrollmentDate: schema_1.student.enrollmentDate,
                numberCourseEnrolled: schema_1.student.numberCoursesEnrolled,
                numberCourseCompleted: schema_1.student.numberCoursesCompleted
            })
                .from(schema_1.user)
                .innerJoin(schema_1.student, (0, drizzle_orm_1.eq)(schema_1.student.userId, schema_1.user.id))
                .where((0, drizzle_orm_1.eq)(schema_1.user.id, id));
        });
        this.createStudent = (firstName, lastName, username, password, email, bankName, bankAccount) => __awaiter(this, void 0, void 0, function* () {
            const newUser = yield user_service_1.default.createNewUser(firstName, lastName, email, username, password, 'student', bankName, bankAccount);
            if (!newUser || newUser.length === 0) {
                return null;
            }
            const studentId = yield this.generateUniqueStudentId(newUser[0].id);
            yield db_1.db
                .insert(schema_1.student)
                .values({
                userId: newUser[0].id,
                studentId: studentId,
                enrollmentDate: new Date(),
                numberCoursesEnrolled: 0,
                numberCoursesCompleted: 0,
            });
            const token = yield auth_service_1.default.getAccessToken(newUser[0]);
            return {
                token
            };
        });
        this.updateNumberOfCourseComplete = (studentId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const CourseComplete = yield join_service_1.default.getJoinCompleted(studentId);
                yield db_1.db
                    .update(schema_1.student)
                    .set({
                    numberCoursesCompleted: CourseComplete
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.student.userId, studentId));
            }
            catch (e) {
                console.log(e);
            }
        });
        this.updateNumberOfCourseEnroll = (studentId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const CourseEnroll = yield join_service_1.default.getJoinEnroll(studentId);
                yield db_1.db
                    .update(schema_1.student)
                    .set({
                    numberCoursesEnrolled: CourseEnroll
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.student.userId, studentId));
            }
            catch (e) {
                console.log(e);
            }
        });
        this.decreaseNumberOfCourseEnroll = (studentId) => __awaiter(this, void 0, void 0, function* () {
            // Gọi lại update để đếm lại từ database
            yield this.updateNumberOfCourseEnroll(studentId);
        });
        this.decreaseNumberOfCourseComplete = (studentId) => __awaiter(this, void 0, void 0, function* () {
            // Gọi lại update để đếm lại từ database
            yield this.updateNumberOfCourseComplete(studentId);
        });
        this.updateStudent = (id, firstName, lastName, email, bankName, bankAccount) => __awaiter(this, void 0, void 0, function* () {
            const updateUser = yield user_service_1.default.updateUser(id, firstName, lastName, email, bankName, bankAccount);
            if (!updateUser || updateUser.length === 0) {
                return null;
            }
            return {
                id: updateUser[0].id,
                firstName: updateUser[0].firstName,
                lastName: updateUser[0].lastName,
                username: updateUser[0].username,
                role: updateUser[0].role,
                email: updateUser[0].email,
                bankName: updateUser[0].bankName,
                bankAccount: updateUser[0].bankAccount,
            };
        });
        this.deleteStudent = (id) => __awaiter(this, void 0, void 0, function* () {
            const existingStudent = yield this.getStudentById(id);
            if (!existingStudent || existingStudent.length === 0) {
                return null;
            }
            yield db_1.db
                .delete(schema_1.student)
                .where((0, drizzle_orm_1.eq)(schema_1.student.userId, id));
            return yield user_service_1.default.deleteUser(id, existingStudent);
        });
    }
}
exports.default = new StudentService();
