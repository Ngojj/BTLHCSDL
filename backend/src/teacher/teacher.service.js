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
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const schema_2 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const user_service_1 = __importDefault(require("../user/user.service"));
const auth_service_1 = __importDefault(require("../auth/auth.service"));
class TeacherService {
    constructor() {
        this.generateUniqueTeacherId = (id) => __awaiter(this, void 0, void 0, function* () {
            let uniqueId = 'TC';
            const lenId = id.toString().length;
            for (let i = 0; i < 8 - lenId; i++) {
                uniqueId += '0';
            }
            uniqueId += id.toString();
            return uniqueId;
        });
        this.getAllTeachers = () => __awaiter(this, void 0, void 0, function* () {
            const teachers = yield db_1.db.select({
                id: schema_1.user.id,
                firstName: schema_1.user.firstName,
                lastName: schema_1.user.lastName,
                username: schema_1.user.username,
                role: schema_1.user.role,
                email: schema_1.user.email,
                bankName: schema_1.user.bankName,
                bankAccount: schema_1.user.bankAccount,
                teacherId: schema_2.teacher.teacherId,
            }).from(schema_1.user)
                .innerJoin(schema_2.teacher, (0, drizzle_orm_1.eq)(schema_2.teacher.userId, schema_1.user.id));
            return teachers;
        });
        this.getTeacherById = (id) => __awaiter(this, void 0, void 0, function* () {
            const teacherById = yield db_1.db.select({
                id: schema_1.user.id,
                firstName: schema_1.user.firstName,
                lastName: schema_1.user.lastName,
                username: schema_1.user.username,
                role: schema_1.user.role,
                email: schema_1.user.email,
                bankName: schema_1.user.bankName,
                bankAccount: schema_1.user.bankAccount,
                teacherId: schema_2.teacher.teacherId,
            }).from(schema_1.user)
                .innerJoin(schema_2.teacher, (0, drizzle_orm_1.eq)(schema_2.teacher.userId, schema_1.user.id))
                .where((0, drizzle_orm_1.eq)(schema_1.user.id, id));
            return schema_2.teacher;
        });
        this.getTeacherByTeacherId = (teacherId) => __awaiter(this, void 0, void 0, function* () {
            const teacherByTeacherId = yield db_1.db.select({
                id: schema_1.user.id,
                firstName: schema_1.user.firstName,
                lastName: schema_1.user.lastName,
                username: schema_1.user.username,
                role: schema_1.user.role,
                email: schema_1.user.email,
                bankName: schema_1.user.bankName,
                bankAccount: schema_1.user.bankAccount,
                teacherId: schema_2.teacher.teacherId,
            }).from(schema_1.user)
                .innerJoin(schema_2.teacher, (0, drizzle_orm_1.eq)(schema_2.teacher.userId, schema_1.user.id))
                .where((0, drizzle_orm_1.eq)(schema_2.teacher.userId, teacherId));
            return teacherByTeacherId;
        });
        this.createNewTeacher = (firstName, lastName, username, password, email, bankName, bankAccount) => __awaiter(this, void 0, void 0, function* () {
            const newUser = yield user_service_1.default.createNewUser(firstName, lastName, email, username, password, 'teacher', bankName, bankAccount);
            if (!newUser) {
                console.log('error user');
                return null;
            }
            const teacherId = yield this.generateUniqueTeacherId(newUser[0].id);
            yield db_1.db.insert(schema_2.teacher)
                .values({
                userId: newUser[0].id,
                teacherId: teacherId,
            });
            // Query lại để lấy dữ liệu đã insert
            const newTeacher = yield db_1.db.select({
                userId: schema_2.teacher.userId,
                teacherId: schema_2.teacher.teacherId
            })
                .from(schema_2.teacher)
                .where((0, drizzle_orm_1.eq)(schema_2.teacher.userId, newUser[0].id));
            if (!newTeacher || newTeacher.length === 0) {
                console.log('error teacher');
                return null;
            }
            const token = yield auth_service_1.default.getAccessToken(newUser[0]);
            return {
                token
            };
        });
        this.updateTeacher = (id, firstName, lastName, username, password, role, email, bankName, bankAccount, hashedPassword) => __awaiter(this, void 0, void 0, function* () {
            console.log(id, firstName, lastName, username, password, role, email, bankName, bankAccount, hashedPassword);
            const updateUser = yield user_service_1.default.updateUser(id, firstName, lastName, email, username, password);
            if (!updateUser || updateUser.length === 0) {
                return null;
            }
            yield db_1.db.update(schema_2.teacher)
                .set({
                userId: updateUser[0].id
            })
                .where((0, drizzle_orm_1.eq)(schema_2.teacher.userId, id));
            // Query lại để lấy dữ liệu đã update
            const updateTeacher = yield db_1.db.select({
                teacherId: schema_2.teacher.teacherId,
            })
                .from(schema_2.teacher)
                .where((0, drizzle_orm_1.eq)(schema_2.teacher.userId, id));
            if (!updateTeacher || updateTeacher.length === 0) {
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
                teacherId: updateTeacher[0].teacherId,
            };
        });
        this.deleteTeacher = (id) => __awaiter(this, void 0, void 0, function* () {
            // Lấy thông tin teacher trước khi xóa
            const teacherInfo = yield db_1.db.select({
                teacherId: schema_2.teacher.teacherId,
            })
                .from(schema_2.teacher)
                .where((0, drizzle_orm_1.eq)(schema_2.teacher.userId, id));
            if (!teacherInfo || teacherInfo.length === 0) {
                return null;
            }
            yield db_1.db.delete(schema_2.teacher)
                .where((0, drizzle_orm_1.eq)(schema_2.teacher.userId, id));
            const userToDelete = yield user_service_1.default.deleteUser(id, teacherInfo);
            if (!userToDelete) {
                return null;
            }
            return {
                userToDelete
            };
        });
    }
}
exports.default = new TeacherService();
