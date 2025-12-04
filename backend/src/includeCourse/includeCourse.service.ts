import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db/db";
import { course, includeCourse, join, roadMap, user } from "../db/schema";
import { includeCourseDto } from "../dtos/includeCourse.dto";

class includeCourseService {
    public async getAllIncludeCourse(){
        try {
            const All = await db.select({
                rmId: includeCourse.rmId,
                courseId: includeCourse.courseId,
                order: includeCourse.order
            })
            .from(includeCourse)

            return {
                data: All,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getIncludeCourseById(rmId: number, courseId: number){
        try {
            const All = await db.select({
                rmId: includeCourse.rmId,
                courseId: includeCourse.courseId,
                order: includeCourse.order
            })
            .from(includeCourse)
            .where(and(eq(includeCourse.rmId, rmId), eq(includeCourse.courseId, courseId)))

            return {
                data: All,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getIncludeCourseByrmId(rmId: number){
        try {

            const courseInIncludeCourse = await db
            .select({
                courseId: course.id,
                avgQuiz: course.avgQuiz,
                courseName: course.name,
                creationTime: course.creTime,
                description: course.description,
                languege: course.language,
                price: course.price,
                teacherId: course.teacherId,
                teacherLastName: user.lastName,
                teacherFirstName: user.firstName
            })
            .from(includeCourse)
            .innerJoin(course, eq(course.id, includeCourse.courseId))
            .innerJoin(user, eq(course.teacherId, user.id))
            .where(eq(includeCourse.rmId, rmId))

            return {
                data: courseInIncludeCourse,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRoadmapOfStudentByStudentId(studentId: number) {
        try {
            const courseJoin = await db
                .select({
                    courseId: join.courseId
                })
                .from(join)
                .where(eq(join.studentId, studentId));
    
            if (courseJoin.length === 0) {
                throw new Error("Không tìm thấy danh sách khóa sinh viên tham gia!");
            }
    
            const courseIds = courseJoin.map((id) => id.courseId);
    
            const roadmaps = await db
                .select({
                    id: roadMap.id,
                    name: roadMap.name,
                    description: roadMap.description,
                    instruction: roadMap.instruction,
                    teacherId: roadMap.teacherId,
                    teacherFirstName: user.firstName,
                    teacherLastName: user.lastName
                })
                .from(roadMap)
                .innerJoin(includeCourse, eq(includeCourse.rmId, roadMap.id))
                .innerJoin(user, eq(user.id, roadMap.teacherId))
                .where(inArray(includeCourse.courseId, courseIds));
    
            const uniqueRoadmaps = Array.from(
                new Map(roadmaps.map((rm) => [rm.id, rm])).values()
            );
    
            return {
                message: "Get roadmaps by student ID successfully",
                status: 200,
                data: uniqueRoadmaps
            };
        } catch (error) {
            return {
                message: error instanceof Error ? error.message : "Unknown error",
                status: 500
            };
        }
    }
    
    

    public async createIncludeCourse(includeCourseDto: includeCourseDto){
        try {
            console.log(includeCourseDto);
            await db.insert(
                includeCourse
            )
            .values({
                rmId: includeCourseDto.rmId,
                courseId: includeCourseDto.courseId,
                order: includeCourseDto.order
            })
            .returning({
                rmId: includeCourse.rmId,
                courseId: includeCourse.courseId,
                order: includeCourse.order
            })

            return {
                message: "IncludeCourse created",
                status: 200,
                data: {
                    rmId: includeCourseDto.rmId,
                    courseId: includeCourseDto.courseId,
                    order: includeCourseDto.order
                }
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateIncludeCourse(includeCourseDto: includeCourseDto){
        try {
            await db.update(includeCourse)
            .set({
                order: includeCourseDto.order
            })
            .where(and(eq(includeCourse.rmId, includeCourseDto.rmId), eq(includeCourse.courseId, includeCourseDto.courseId)))

            return {
                message: "IncludeCourse updated",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteIncludeCourse(rmId: number, courseId: number){
        try {
            await db.delete(includeCourse)
            .where(and(eq(includeCourse.rmId, rmId), eq(includeCourse.courseId, courseId)))

            return {
                message: "IncludeCourse deleted",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

}

export default new includeCourseService();