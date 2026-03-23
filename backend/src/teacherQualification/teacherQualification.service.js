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
class teacherQualificationService {
    getAllTeacherQualification() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherQualifications = yield db_1.db.select({
                    teacherId: schema_1.teacherQualification.teacherId,
                    qualification: schema_1.teacherQualification.qualification
                })
                    .from(schema_1.teacherQualification);
                return {
                    status: 200,
                    message: "Sucessfully",
                    data: teacherQualifications
                };
            }
            catch (e) {
                return {
                    status: 500,
                    message: "Internal link server"
                };
            }
        });
    }
    getTeacherQualificationByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherQualificationByTeacherId = yield db_1.db.select({
                    teacherId: schema_1.teacherQualification.teacherId,
                    qualification: schema_1.teacherQualification.qualification
                })
                    .from(schema_1.teacherQualification)
                    .where((0, drizzle_orm_1.eq)(schema_1.teacherQualification.teacherId, userId));
                return {
                    status: 200,
                    message: "Sucessfully",
                    data: teacherQualificationByTeacherId
                };
            }
            catch (e) {
                return {
                    status: 500,
                    message: "Internal link server"
                };
            }
        });
    }
    findTeacherQualificationByTeacherEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(email);
                // find teacher by email first
                const teacherByEmail = yield db_1.db.select({
                    email: schema_1.user.email,
                    teacherId: schema_1.teacher.userId
                })
                    .from(schema_1.user)
                    .innerJoin(schema_1.teacher, (0, drizzle_orm_1.eq)(schema_1.teacher.userId, schema_1.user.id))
                    .where((0, drizzle_orm_1.eq)(schema_1.user.email, email));
                // if teacher not found
                if (teacherByEmail.length === 0) {
                    return {
                        status: 404,
                        message: "Teacher not found"
                    };
                }
                // find teacher qualification by teacherId
                const teacherQualificationByTeacherId = yield db_1.db.select({
                    teacherId: schema_1.teacherQualification.teacherId,
                    qualification: schema_1.teacherQualification.qualification
                })
                    .from(schema_1.teacherQualification)
                    .where((0, drizzle_orm_1.eq)(schema_1.teacherQualification.teacherId, teacherByEmail[0].teacherId));
                return {
                    status: 200,
                    message: "Sucessfully",
                    data: teacherQualificationByTeacherId
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    createTeacherQualification(userId, qualification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if teacherId exist
                const teacherExist = yield db_1.db.select({
                    teacherId: schema_1.teacherQualification.teacherId
                })
                    .from(schema_1.teacherQualification)
                    .where((0, drizzle_orm_1.eq)(schema_1.teacherQualification.teacherId, userId));
                if (teacherExist.length !== 0) {
                    return {
                        status: 404,
                        message: "This qualification already exist"
                    };
                }
                const teacherQualificationData = {
                    teacherId: userId,
                    qualification: qualification
                };
                yield db_1.db.insert(schema_1.teacherQualification)
                    .values(teacherQualificationData);
                // Query lại để lấy dữ liệu đã insert
                const newQuali = yield db_1.db.select({
                    teacherId: schema_1.teacherQualification.teacherId,
                    qualification: schema_1.teacherQualification.qualification
                })
                    .from(schema_1.teacherQualification)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.teacherQualification.teacherId, userId), (0, drizzle_orm_1.eq)(schema_1.teacherQualification.qualification, qualification)))
                    .limit(1);
                return {
                    status: 200,
                    message: "Successfully",
                    data: {
                        teacherId: newQuali[0].teacherId,
                        qualification: newQuali[0].qualification
                    }
                };
            }
            catch (e) {
                return {
                    status: 500,
                    message: "Internal link server"
                };
            }
        });
    }
    updateTeacherQualification(userId, qualification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if teacherId exist
                const teacherExist = yield db_1.db.select({
                    teacherId: schema_1.teacherQualification.teacherId
                })
                    .from(schema_1.teacherQualification)
                    .where((0, drizzle_orm_1.eq)(schema_1.teacherQualification.teacherId, userId));
                if (teacherExist.length === 0) {
                    return {
                        status: 404,
                        message: "This qualification does not exist"
                    };
                }
                const teacherQualificationData = {
                    teacherId: userId,
                    qualification: qualification
                };
                yield db_1.db.update(schema_1.teacherQualification)
                    .set(teacherQualificationData)
                    .where((0, drizzle_orm_1.eq)(schema_1.teacherQualification.teacherId, userId));
                // Query lại để lấy dữ liệu đã update
                const newQuali = yield db_1.db.select({
                    teacherId: schema_1.teacherQualification.teacherId,
                    qualification: schema_1.teacherQualification.qualification
                })
                    .from(schema_1.teacherQualification)
                    .where((0, drizzle_orm_1.eq)(schema_1.teacherQualification.teacherId, userId))
                    .limit(1);
                return {
                    status: 200,
                    message: "Successfully",
                    data: {
                        teacherId: newQuali[0].teacherId,
                        qualification: newQuali[0].qualification
                    }
                };
            }
            catch (e) {
                return {
                    status: 500,
                    message: "Internal link server"
                };
            }
        });
    }
    deleteTeacherQualification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if teacherId exist
                const teacherExist = yield db_1.db.select({
                    teacherId: schema_1.teacherQualification.teacherId
                })
                    .from(schema_1.teacherQualification)
                    .where((0, drizzle_orm_1.eq)(schema_1.teacherQualification.teacherId, userId));
                if (teacherExist.length === 0) {
                    return {
                        status: 404,
                        message: "This qualification does not exist"
                    };
                }
                yield db_1.db.delete(schema_1.teacherQualification)
                    .where((0, drizzle_orm_1.eq)(schema_1.teacherQualification.teacherId, userId));
                return {
                    status: 200,
                    message: "Successfully"
                };
            }
            catch (e) {
                return {
                    status: 500,
                    message: "Internal link server"
                };
            }
        });
    }
}
exports.default = new teacherQualificationService();
