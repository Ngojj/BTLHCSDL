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
class certificationService {
    getAllCertifications() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all certifications
            try {
                const allCertifications = yield db_1.db.select({
                    id: schema_1.certification.id,
                    name: schema_1.certification.name,
                    issueDate: schema_1.certification.issueDate,
                    expDate: schema_1.certification.expDate,
                    courseId: schema_1.certification.courseId,
                    studentId: schema_1.certification.studentId
                })
                    .from(schema_1.certification);
                return {
                    data: allCertifications,
                    status: 200,
                    message: "Successfully retrieved all certifications"
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getCertificationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get a certification by id
            try {
                const certificationById = yield db_1.db.select({
                    id: schema_1.certification.id,
                    name: schema_1.certification.name,
                    issueDate: schema_1.certification.issueDate,
                    expDate: schema_1.certification.expDate,
                    courseId: schema_1.certification.courseId,
                    studentId: schema_1.certification.studentId
                })
                    .from(schema_1.certification)
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.id, id));
                if (certificationById.length === 0) {
                    return {
                        message: "Certification not found",
                        status: 404
                    };
                }
                return {
                    data: certificationById,
                    status: 200,
                    message: "Successfully retrieved certification"
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getCertificationByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get a certification by courseId
            try {
                const certificationByCourseId = yield db_1.db.select({
                    id: schema_1.certification.id,
                    name: schema_1.certification.name,
                    issueDate: schema_1.certification.issueDate,
                    expDate: schema_1.certification.expDate,
                    courseId: schema_1.certification.courseId,
                    studentId: schema_1.certification.studentId
                })
                    .from(schema_1.certification)
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.courseId, courseId));
                if (certificationByCourseId.length === 0) {
                    return {
                        message: "Certification not found",
                        status: 404
                    };
                }
                return {
                    data: certificationByCourseId,
                    status: 200,
                    message: "Successfully retrieved certification"
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getCertificationByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get a certification by studentId
            try {
                const certificationByStudentId = yield db_1.db.select({
                    id: schema_1.certification.id,
                    name: schema_1.certification.name,
                    issueDate: schema_1.certification.issueDate,
                    expDate: schema_1.certification.expDate,
                    courseId: schema_1.certification.courseId,
                    studentId: schema_1.certification.studentId
                })
                    .from(schema_1.certification)
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.studentId, studentId));
                if (certificationByStudentId.length === 0) {
                    return {
                        message: "Certification not found",
                        status: 404
                    };
                }
                return {
                    data: certificationByStudentId,
                    status: 200,
                    message: "Successfully retrieved certification"
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    createCertification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a new certification
            try {
                // check if this certification already exists
                // const certificationExists = await db.select({
                //     id: certification.id
                // })
                // .from(certification)
                // .where(and(eq(certification.courseId, data.courseId), eq(certification.studentId, data.studentId)))
                // if (certificationExists.length !== 0) {
                //     return {
                //         message: "Certification already exists",
                //         status: 409
                //     }
                // }
                const newCert = yield db_1.db.insert(schema_1.certification)
                    .values({
                    name: data.name,
                    issueDate: new Date(data.issueDate),
                    expDate: data.expDate ? new Date(data.expDate) : null,
                    courseId: data.courseId,
                    studentId: data.studentId
                });
                return {
                    status: 200,
                    message: "Successfully created certification"
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateCertification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update a certification
            try {
                // check if this certification exists
                const id = data.id;
                const certificationExists = yield db_1.db.select({
                    id: schema_1.certification.id
                })
                    .from(schema_1.certification)
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.id, id));
                if (certificationExists.length === 0) {
                    return {
                        message: "Certification not found",
                        status: 404
                    };
                }
                const updatedCert = yield db_1.db.update(schema_1.certification)
                    .set({
                    name: data.name,
                    // issueDate: data.issueDate,
                    expDate: data.expDate ? new Date(data.expDate) : null,
                    courseId: data.courseId,
                    studentId: data.studentId
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.id, id));
                return {
                    status: 200,
                    message: "Successfully updated certification"
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteCertification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete a certification
            try {
                // check if this certification exists
                const certificationExists = yield db_1.db.select({
                    id: schema_1.certification.id
                })
                    .from(schema_1.certification)
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.id, id));
                if (certificationExists.length === 0) {
                    return {
                        message: "Certification not found",
                        status: 404
                    };
                }
                const deletedCert = yield db_1.db.delete(schema_1.certification)
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.id, id));
                return {
                    status: 200,
                    message: "Successfully deleted certification"
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteCertificationByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete a certification by courseId
            try {
                // check if this certification exists
                const certificationExists = yield db_1.db.select({
                    id: schema_1.certification.id
                })
                    .from(schema_1.certification)
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.courseId, courseId));
                if (certificationExists.length === 0) {
                    return {
                        message: "Certification not found",
                        status: 404
                    };
                }
                const deletedCert = yield db_1.db.delete(schema_1.certification)
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.courseId, courseId));
                return {
                    status: 200,
                    message: "Successfully deleted certification"
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteCertificationByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete a certification by studentId
            try {
                // check if this certification exists
                const certificationExists = yield db_1.db.select({
                    id: schema_1.certification.id
                })
                    .from(schema_1.certification)
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.studentId, studentId));
                if (certificationExists.length === 0) {
                    return {
                        message: "Certification not found",
                        status: 404
                    };
                }
                const deletedCert = yield db_1.db.delete(schema_1.certification)
                    .where((0, drizzle_orm_1.eq)(schema_1.certification.studentId, studentId));
                return {
                    status: 200,
                    message: "Successfully deleted certification"
                };
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
exports.default = new certificationService();
