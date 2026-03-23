import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import { course, dO, join, lecture, quiz, section, student, user } from "../db/schema";
import { joinDto } from "../dtos/join.dto";
import studentService from "../student/student.service";

class joinService {

    public async UpdateGPAAndProgress(quizId: number, studentId: number) {
        try {
            const sectionResult = await db
                .select({
                    sectionId: quiz.sectionId,
                })
                .from(quiz)
                .where(eq(quiz.id, quizId));
    
            const sectionId = sectionResult[0]?.sectionId;
    
            const courseResult = await db
                .select({
                    courseId: section.courseId,
                })
                .from(section)
                .where(eq(section.id, sectionId));
    
            const courseId = courseResult[0]?.courseId;
    
            const quizListResult = await db
                .select({
                    quizId: quiz.id,
                })
                .from(quiz)
                .innerJoin(section, eq(quiz.sectionId, section.id))
                .where(eq(section.courseId, courseId));
    
            const totalQuizCount = quizListResult.length;
            const quizIds = quizListResult.map((q) => q.quizId);
    
            const allQuizScores = await db
                .select({
                    quizId: dO.quizId,
                    score: dO.score,
                })
                .from(dO)
                .where(eq(dO.studentId, studentId));
    
            const filteredScores = allQuizScores.filter((score) => quizIds.includes(score.quizId));
            const filterDOScores : { [key: number ] : number} = {}

            for(const d of allQuizScores){
                filterDOScores[d.quizId] = d.score || 0
            }

            const userQuizScores = quizIds.map((id) => {
                if(filterDOScores[id] !== undefined){
                    const scoresForQuiz = filteredScores.filter((score) => score.quizId === id);
                    const totalScore = scoresForQuiz.reduce((sum, item) => sum + (item.score ?? 0), 0);
                    const averageScore = scoresForQuiz.length > 0 ? totalScore / scoresForQuiz.length : 0;
                    return {
                        quizId: id,
                        averageScore,
                    };
                }
            });
            
            let quizzesCompleted = 0;
            for(const sc of userQuizScores){
                if(sc !== undefined){
                    quizzesCompleted ++
                }
            }
            const totalScore = userQuizScores.reduce((sum, quiz) => sum + (quiz?.averageScore ?? 0), 0);
            const GPA = quizzesCompleted > 0 ? totalScore / quizzesCompleted : 0;
            
            const progress = Math.round((quizzesCompleted / totalQuizCount) * 100);
    
            if (progress === 100) {
                studentService.updateNumberOfCourseComplete(studentId);
            }
    
            await db
                .update(join)
                .set({
                    progress,
                    GPA,
                    dateComplete: quizzesCompleted === totalQuizCount ? new Date() : null,
                })
                .where(and(eq(join.courseId, courseId), eq(join.studentId, studentId)));
        } catch (error) {
            console.error(error);
        }
    }
    
    
    
    public async getAllJoin(){
        try {
            const joins = await db.select({
                courseId: join.courseId,
                studentId: join.studentId,
                dateComplete: join.dateComplete,
                dateStart: join.dateStart,
                progress: join.progress,
                GPA: join.GPA
            })
            .from(join)

            return {
                data: joins,
                status: 200
            }
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async getJoinCompleted(studentId: number){
        try{
            const completeCourses = await db
            .select()
            .from(join)
            .where(and(eq(join.studentId, studentId), eq(join.progress, 100)))

            return completeCourses.length
        }catch(e){
            console.log(e)
            return 0
        }
    }

    public async getJoinEnroll(studentId: number){
        try{
            const completeCourses = await db
            .select()
            .from(join)
            .where(eq(join.studentId, studentId))

            return completeCourses.length
        }catch(e){
            console.log(e)
            return 0
        }
    }

    public async getJoinByTeacherId(teacherId: number){
        try {
            const joinData = await db.select({
                courseId: join.courseId,
                studentId: join.studentId,
                dateComplete: join.dateComplete,
                dateStart: join.dateStart,
                progress: join.progress,
                GPA: join.GPA,
                courseName: course.name,
                description: course.description,
                price: course.price,
                creationTime: course.creTime,
                teacherId: course.teacherId,
                teacherFirstName: user.firstName,
                teacherLastName: user.lastName,
            })
            .from(join)
            .leftJoin(course, eq(join.courseId, course.id))
            .where(eq(course.teacherId, teacherId))
            .leftJoin(user, eq(course.teacherId, user.id))
            if (joinData.length === 0) {
                return {
                    data: "Join not found",
                    status: 404
                }
            }
            return {
                data: joinData,
                status: 200
            }
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }
    public async getJoinById(courseId: number, studentId: number){
        try {
            const joinData = await db.select({
                courseId: join.courseId,
                studentId: join.studentId,
                dateComplete: join.dateComplete,
                dateStart: join.dateStart,
                progress: join.progress,
                GPA: join.GPA
            })
            .from(join)
            .where(and(eq(join.courseId, courseId), eq(join.studentId, studentId)))

            if (joinData.length === 0) {
                return {
                    data: "Join not found",
                    status: 404
                }
            }
            return {
                data: joinData,
                status: 200
            }
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async getJoinByCourseId(courseId: number){
        try {
            const joinData = await db.select({
                courseId: join.courseId,
                studentId: join.studentId,
                dateComplete: join.dateComplete,
                dateStart: join.dateStart,
                progress: join.progress,
                GPA: join.GPA
            })
            .from(join)
            .where(eq(join.courseId, courseId))

            if (joinData.length === 0) {
                return {
                    data: "Join not found",
                    status: 404
                }
            }
            return {
                data: joinData,
                status: 200
            }
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async getJoinByStudentId(studentId: number){
        try {
            const joinData = await db.select({
                courseId: join.courseId,
                studentId: join.studentId,
                dateComplete: join.dateComplete,
                dateStart: join.dateStart,
                progress: join.progress,
                GPA: join.GPA,
                courseName: course.name,
                description: course.description,
                price: course.price,
                creationTime: course.creTime,
                teacherId: course.teacherId,
                teacherFirstName: user.firstName,
                teacherLastName: user.lastName,
            })
            .from(join)
            .leftJoin(course, eq(join.courseId, course.id))
            .where(eq(join.studentId, studentId))
            .leftJoin(user, eq(course.teacherId, user.id))
            if (joinData.length === 0) {
                return {
                    data: "Join not found",
                    status: 404
                }
            }
            return {
                data: joinData,
                status: 200
            }
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async createJoin(courseId: number, studentId: number){
        try {
            // check if exists
            const checkJoin = await db.select({
                courseId: join.courseId,
                studentId: join.studentId
            })
            .from(join)
            .where(and(eq(join.courseId, courseId), eq(join.studentId, studentId)))

            if (checkJoin.length > 0) {
                return {
                    message: "Bạn đã tham gia khóa học này rồi",
                    data: "Join already exists",
                    status: 400
                }
            }

            // Check if course exists
            const courseExists = await db.select({
                id: course.id
            })
            .from(course)
            .where(eq(course.id, courseId))
            .limit(1)

            if (courseExists.length === 0) {
                return {
                    message: "Khóa học không tồn tại",
                    status: 404
                }
            }

            // Check if student exists
            const studentExists = await db.select({
                userId: student.userId
            })
            .from(student)
            .where(eq(student.userId, studentId))
            .limit(1)

            if (studentExists.length === 0) {
                return {
                    message: "Sinh viên không tồn tại",
                    status: 404
                }
            }

            await db.insert(join).values({
                courseId: courseId,
                studentId: studentId,
                dateStart: new Date(),
            })

            studentService.updateNumberOfCourseEnroll(studentId)
            return {
                message: "Đăng ký khóa học thành công",
                status: 201,
                data: {
                    courseId,
                    studentId
                }
            }
        } catch (error: any) {
            const errorMessage = error?.message || "Lỗi khi đăng ký khóa học";
            
            // Kiểm tra nếu là lỗi từ trigger (giới hạn 3 khóa học)
            if (errorMessage.includes('không thể đăng ký thêm') || 
                errorMessage.includes('3 khóa đang học')) {
                return {
                    message: errorMessage,
                    status: 400,
                    error: errorMessage
                }
            }
            
            // Kiểm tra lỗi foreign key
            if (errorMessage.includes('foreign key') || errorMessage.includes('FOREIGN KEY')) {
                return {
                    message: "Khóa học hoặc sinh viên không tồn tại",
                    status: 400,
                    error: errorMessage
                }
            }
            
            // Lỗi khác
            console.error("Error creating join:", error);
            return {
                message: errorMessage,
                status: 500,
                error: errorMessage
            }
        }
    }

    public async updateJoin(joinDto: joinDto){
        try {
            // check if exists
            const checkJoin = await db.select({
                courseId: join.courseId,
                studentId: join.studentId,
                progress: join.progress
            })
            .from(join)
            .where(and(eq(join.courseId, joinDto.courseId), eq(join.studentId, joinDto.studentId)))

            if (checkJoin.length === 0) {
                return {
                    message: "Không tìm thấy đăng ký khóa học",
                    status: 404
                }
            }

            const oldProgress = checkJoin[0].progress;
            const wasCompleted = oldProgress === 100;
            const willBeCompleted = joinDto.progress === 100;

            await db.update(join)
            .set({
                dateComplete: joinDto.dateComplete ? new Date(joinDto.dateComplete) : null,
                dateStart: new Date(joinDto.dateStart),
                progress: joinDto.progress,
                GPA: joinDto.GPA
            })
            .where(and(eq(join.courseId, joinDto.courseId), eq(join.studentId, joinDto.studentId)))

            // Cập nhật số lượng khóa học hoàn thành nếu cần
            if (!wasCompleted && willBeCompleted) {
                // Từ chưa hoàn thành -> hoàn thành
                studentService.updateNumberOfCourseComplete(joinDto.studentId);
            } else if (wasCompleted && !willBeCompleted) {
                // Từ hoàn thành -> chưa hoàn thành
                studentService.updateNumberOfCourseComplete(joinDto.studentId);
            }

            return {
                message: "Cập nhật thông tin khóa học thành công",
                status: 200
            }
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async deleteJoin(courseId: number, studentId: number){
        try {
            // check if exists
            const checkJoin = await db.select({
                courseId: join.courseId,
                studentId: join.studentId,
                progress: join.progress
            })
            .from(join)
            .where(and(eq(join.courseId, courseId), eq(join.studentId, studentId)))

            if (checkJoin.length === 0) {
                return {
                    message: "Không tìm thấy đăng ký khóa học",
                    status: 404
                }
            }

            // Lưu progress để cập nhật số lượng khóa học
            const wasCompleted = checkJoin[0].progress === 100;

            await db.delete(join)
            .where(and(eq(join.courseId, courseId), eq(join.studentId, studentId)))

            // Cập nhật số lượng khóa học của student
            // Nếu khóa học đã hoàn thành, giảm numberCoursesCompleted
            if (wasCompleted) {
                studentService.decreaseNumberOfCourseComplete(studentId);
            }
            // Giảm numberCoursesEnrolled
            studentService.decreaseNumberOfCourseEnroll(studentId);

            return {
                message: "Hủy đăng ký khóa học thành công",
                status: 200
            }
        } catch (error: any) {
            const errorMessage = error?.message || "Lỗi khi hủy đăng ký khóa học";
            return {
                message: errorMessage,
                error: errorMessage,
                status: 500
            }
        }
    }
}

export default new joinService();
