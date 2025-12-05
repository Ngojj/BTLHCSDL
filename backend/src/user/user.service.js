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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt = require('bcrypt');
const saltRounds = 10;
class UserService {
    constructor() {
        this.getAllUsers = () => __awaiter(this, void 0, void 0, function* () {
            const all = yield db_1.db
                .select({
                id: schema_1.user.id,
                firstName: schema_1.user.firstName,
                lastName: schema_1.user.lastName,
                username: schema_1.user.username,
                role: schema_1.user.role,
                email: schema_1.user.email,
                bankName: schema_1.user.bankName,
                bankAccount: schema_1.user.bankAccount,
            })
                .from(schema_1.user);
            return all;
        });
        this.getUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield db_1.db
                .select({
                id: schema_1.user.id,
                firstName: schema_1.user.firstName,
                lastName: schema_1.user.lastName,
                username: schema_1.user.username,
                role: schema_1.user.role,
                email: schema_1.user.email,
                bankName: schema_1.user.bankName,
                bankAccount: schema_1.user.bankAccount,
            })
                .from(schema_1.user)
                .where((0, drizzle_orm_1.eq)(schema_1.user.id, id));
            return data;
        });
        this.getUserByIdWithPassword = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield db_1.db
                .select()
                .from(schema_1.user)
                .where((0, drizzle_orm_1.eq)(schema_1.user.id, id));
            return data;
        });
        this.createNewUser = (firstName, lastName, email, username, password, role, bankName, bankAccount) => __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt.hash(password, saltRounds);
            yield db_1.db
                .insert(schema_1.user)
                .values({ firstName,
                lastName,
                email,
                username,
                password: hashedPassword,
                role,
                bankAccount,
                bankName });
            const createdUser = yield this.getUserByUsername(username);
            return createdUser ? [createdUser] : [];
        });
        this.updateUser = (id, firstName, lastName, email, bankName, bankAccount) => __awaiter(this, void 0, void 0, function* () {
            yield db_1.db
                .update(schema_1.user)
                .set({
                firstName,
                lastName,
                email,
                bankAccount,
                bankName
            })
                .where((0, drizzle_orm_1.eq)(schema_1.user.id, id));
            return yield this.getUserById(id);
        });
        this.deleteUser = (id, deleteStudentOrteacher) => __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.getUserById(id);
            if (!existingUser || existingUser.length === 0) {
                return null;
            }
            yield db_1.db
                .delete(schema_1.user)
                .where((0, drizzle_orm_1.eq)(schema_1.user.id, id));
            return {
                id: existingUser[0].id,
                firstName: existingUser[0].firstName,
                lastName: existingUser[0].lastName,
                username: existingUser[0].username,
                role: existingUser[0].role,
                email: existingUser[0].email,
                bankName: existingUser[0].bankName,
                bankAccount: existingUser[0].bankAccount,
                studentId: deleteStudentOrteacher[0].studentId,
                enrollmentDate: deleteStudentOrteacher[0].enrollmentDate,
                numberCoursesEnrolled: deleteStudentOrteacher[0].numberCoursesEnrolled,
                numberCoursesCompleted: deleteStudentOrteacher[0].numberCoursesCompleted,
            };
        });
        this.getUserByUsername = (username) => __awaiter(this, void 0, void 0, function* () {
            const data = yield db_1.db
                .select()
                .from(schema_1.user)
                .where((0, drizzle_orm_1.eq)(schema_1.user.username, username))
                .limit(1);
            return data[0];
        });
    }
}
exports.default = new UserService();
