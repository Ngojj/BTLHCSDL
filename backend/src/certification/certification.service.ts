import { db } from "../db/db";
import { certification } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { certificationDto } from "../dtos/certification.dto";

class certificationService {
    public async getAllCertifications() {
        // Get all certifications
        try {
            const allCertifications = await db.select({
                id: certification.id,
                name: certification.name,
                issueDate: certification.issueDate,
                expDate: certification.expDate,
                courseId: certification.courseId,
                studentId: certification.studentId
            })
            .from(certification)

            return {
                data: allCertifications,
                status: 200,
                message: "Successfully retrieved all certifications"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getCertificationById(id: number) {
        // Get a certification by id
        try {
            const certificationById = await db.select({
                id: certification.id,
                name: certification.name,
                issueDate: certification.issueDate,
                expDate: certification.expDate,
                courseId: certification.courseId,
                studentId: certification.studentId
            })
            .from(certification)
            .where(eq(certification.id, id))

            if (certificationById.length === 0) {
                return {
                    message: "Certification not found",
                    status: 404
                }
            }
            return {
                data: certificationById,
                status: 200,
                message: "Successfully retrieved certification"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getCertificationByCourseId(courseId: number) {
        // Get a certification by courseId
        try {
            const certificationByCourseId = await db.select({
                id: certification.id,
                name: certification.name,
                issueDate: certification.issueDate,
                expDate: certification.expDate,
                courseId: certification.courseId,
                studentId: certification.studentId
            })
            .from(certification)
            .where(eq(certification.courseId, courseId))

            if (certificationByCourseId.length === 0) {
                return {
                    message: "Certification not found",
                    status: 404
                }
            }
            return {
                data: certificationByCourseId,
                status: 200,
                message: "Successfully retrieved certification"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getCertificationByStudentId(studentId: number) {
        // Get a certification by studentId
        try {
            const certificationByStudentId = await db.select({
                id: certification.id,
                name: certification.name,
                issueDate: certification.issueDate,
                expDate: certification.expDate,
                courseId: certification.courseId,
                studentId: certification.studentId
            })
            .from(certification)
            .where(eq(certification.studentId, studentId))

            if (certificationByStudentId.length === 0) {
                return {
                    message: "Certification not found",
                    status: 404
                }
            }
            return {
                data: certificationByStudentId,
                status: 200,
                message: "Successfully retrieved certification"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createCertification(data: certificationDto){
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
            const newCert = await db.insert(
                certification
            )
            .values({
                name: data.name,
                issueDate: data.issueDate,
                expDate: data.expDate,
                courseId: data.courseId,
                studentId: data.studentId
            })

            return {
                status: 200,
                message: "Successfully created certification"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateCertification(data: certificationDto){
        // Update a certification
        try {
            // check if this certification exists
            const id = data.id;
            const certificationExists = await db.select({
                id: certification.id
            })
            .from(certification)
            .where(eq(certification.id, id))

            if (certificationExists.length === 0) {
                return {
                    message: "Certification not found",
                    status: 404
                }
            }

            const updatedCert = await db.update(certification)
            .set({
                name: data.name,
                // issueDate: data.issueDate,
                expDate: data.expDate,
                courseId: data.courseId,
                studentId: data.studentId
            })
            .where(eq(certification.id, id))

            return {
                status: 200,
                message: "Successfully updated certification"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteCertification(id: number){
        // Delete a certification
        try {
            // check if this certification exists
            const certificationExists = await db.select({
                id: certification.id
            })
            .from(certification)
            .where(eq(certification.id, id))

            if (certificationExists.length === 0) {
                return {
                    message: "Certification not found",
                    status: 404
                }
            }

            const deletedCert = await db.delete(certification)
            .where(eq(certification.id, id))

            return {
                status: 200,
                message: "Successfully deleted certification"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteCertificationByCourseId(courseId: number){
        // Delete a certification by courseId
        try {
            // check if this certification exists
            const certificationExists = await db.select({
                id: certification.id
            })
            .from(certification)
            .where(eq(certification.courseId, courseId))

            if (certificationExists.length === 0) {
                return {
                    message: "Certification not found",
                    status: 404
                }
            }

            const deletedCert = await db.delete(certification)
            .where(eq(certification.courseId, courseId))

            return {
                status: 200,
                message: "Successfully deleted certification"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteCertificationByStudentId(studentId: number){
        // Delete a certification by studentId
        try {
            // check if this certification exists
            const certificationExists = await db.select({
                id: certification.id
            })
            .from(certification)
            .where(eq(certification.studentId, studentId))

            if (certificationExists.length === 0) {
                return {
                    message: "Certification not found",
                    status: 404
                }
            }

            const deletedCert = await db.delete(certification)
            .where(eq(certification.studentId, studentId))

            return {
                status: 200,
                message: "Successfully deleted certification"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new certificationService();