import { course, teacher, user } from "../db/schema"
import { db } from "../db/db"
import { and, eq } from "drizzle-orm"
import courseTopicService from "../courseTopic/courseTopic.service"
class CourseService{
    private FormatDate = (date: string) => {
        const dateObj = new Date(date)
        return `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`
    }

    public getAllCoursesWithTeacherInfo = async () => {
        try {
            const coursesWithTeachers = await db
                .select({
                    courseId: course.id,
                    courseName: course.name,
                    language: course.language,
                    description: course.description,
                    teacherId: course.teacherId,
                    creationTime: course.creTime,
                    avgQuiz: course.avgQuiz,
                    price: course.price,
                    teacherLastName: user.lastName,
                    teacherFirstName: user.firstName,
                })
                .from(course)
                .innerJoin(user, eq(course.teacherId, user.id)); // Assuming foreign key relationship
    
            return {
                message: "Successfully get all courses with teacher info",
                status: 200,
                data: coursesWithTeachers
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    };

    public getAllCoursesWithTeacherInfoByTeacherId = async (teacherId: number) => {
        try {
            const coursesWithTeachers = await db.select({
                courseId: course.id,
                courseName: course.name,
                language: course.language,
                description: course.description,
                teacherId: course.teacherId,
                creationTime: course.creTime,
                avgQuiz: course.avgQuiz,
                price: course.price,
                teacherLastName: user.lastName,
                teacherFirstName: user.firstName,
            })
            .from(course)
            .innerJoin(user, eq(course.teacherId, user.id))
            .where(eq(course.teacherId, teacherId))

            return {
                message: "Successfully get all courses with teacher info",
                status: 200,
                data: coursesWithTeachers
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
    
    public getAllCourses = async () => {
        try {
            const allCourses=  await db
            .select({
                courseId: course.id,
                courseName: course.name,
                language: course.language,
                description: course.description,
                teacherId: course.teacherId,
                creationTime: course.creTime,
                avgQuiz: course.avgQuiz,
                price: course.price,
            })
            .from(course)
            
            return {
                message: "Successfully get all courses",
                status: 200,
                data: allCourses
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
            
        }


    }
    
    public getCourseById = async (id: number) => {

        const returnCourse = await db
        .select({
            courseId: course.id,
            courseName: course.name,
            language: course.language,
            description: course.description,
            teacherId: course.teacherId,
            creationTime: course.creTime,
            avgQuiz: course.avgQuiz,
            price: course.price,
        })
        .from(course)
        .where(eq(course.id, id))

        if (!returnCourse || returnCourse.length === 0){
            return null
        }

        return returnCourse[0]
    }

    public getCourseByName = async (name: string) => {
        const courseByName = await db
        .select({
            courseId: course.id,
            courseName: course.name,
            language: course.language,
            description: course.description,
            teacherId: course.teacherId,
            creationTime: course.creTime,
            avgQuiz: course.avgQuiz,
            price: course.price,
        })
        .from(course)
        .where(eq(course.name, name))

        if (!courseByName || courseByName.length === 0){
            return null
        }

        return courseByName[0]
    }

    public createNewCourse = async (
        courseName: string,
        language: string,
        description: string,
        teacherId: number,
        price: number,
        topics: string[],
        avgQuiz: number
    ) => {
        try {
            // check if course already exist
            const courseExist = await db.select({})
                                        .from(course)
                                        .where(and(eq(course.name, courseName), 
                                                   eq(course.teacherId, teacherId)))
            
            if (courseExist.length !== 0){
                return {
                    message: "Course already exist",
                    status: 400
                }
            }
            const newCourse = await db.insert(course).values({
                name: courseName,
                language: language,
                description: description,
                teacherId: teacherId,
                creTime: new Date().toISOString(),
                avgQuiz: avgQuiz,
                price: price,
            }).returning({
                courseId: course.id
            })

            // insert topic into course
            for (let i = 0 ; i < topics.length; i++){
                const addTopic = await courseTopicService.createCourseTopic(newCourse[0].courseId, topics[i])
            }
            return {
                message: "Successfully created new course",
                status: 200,
                data: newCourse[0].courseId
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
            
        }
    }

    public deleteCourseById = async (id: number) => {
        const courseExist = await this.getCourseById(id)
        if (!courseExist){
            return null
        }

        // delete all course topic of this course first
        courseTopicService.deleteAllCourseTopicsInThisCourse(id);

        const deletedCourse = await db.delete(course).where(eq(course.id, id))
        if (!deletedCourse){
            return null
        }

        return courseExist
    }

    public deleteCourseByName = async (name: string) => {
        const courseExist = await this.getCourseByName(name)
        if (!courseExist){
            return null
        }
        // delete all course topics in this course
        courseTopicService.deleteAllCourseTopicsInThisCourse(courseExist.courseId)
        const deletedCourse = await db.delete(course).where(eq(course.name, name))
        if (!deletedCourse){
            return null
        }

        return courseExist
    }

    public updateCourseById = async (
        id: number,
        courseName: string,
        language: string,
        description: string,
        avgQuiz: number,
        price: number,
    ) => {
        const courseExist = await this.getCourseById(id)
        if (!courseExist){
            return null
        }

        const updatedCourse = await db.update(course)
        .set({
            name: courseName? courseName: courseExist.courseName,
            language: language? language: courseExist.language,
            description: description? description: courseExist.description,
            price: price? price: courseExist.price,
            avgQuiz: avgQuiz? avgQuiz: courseExist.avgQuiz,
        })
        .returning({
            teacherId: course.teacherId,
            price: course.price,
            avgQuiz: course.avgQuiz,
            language: course.language,
            name: course.name,
            description: course.description,
            creTime: course.creTime,
            id: course.id,
        })
        .where(eq(course.id, id))

        if (!updatedCourse){
            return null
        }

        return {
            courseId: updatedCourse[0].id,
            courseName: updatedCourse[0].name,
            language: updatedCourse[0].language,
            description: updatedCourse[0].description,
            teacherId: updatedCourse[0].teacherId,
            creationTime: updatedCourse[0].creTime,
            avgQuiz: updatedCourse[0].avgQuiz,
            price: updatedCourse[0].price,
        }
    }

    public updateCourseByName = async (
        name: string,
        newName: string,
        language: string,
        description: string,
        avgQuiz: number,
        price: number,

    ) => {
        const courseExist = await this.getCourseByName(name)
        if (!courseExist){
            return null
        }

        const updatedCourse = await db.update(course)
        .set({
            name: newName? newName: courseExist.courseName,
            language: language? language: courseExist.language,
            description: description? description: courseExist.description,
            price: price? price: courseExist.price,
            avgQuiz: avgQuiz? avgQuiz: courseExist.avgQuiz
        })
        .returning({
            teacherId: course.teacherId,
            price: course.price,
            avgQuiz: course.avgQuiz,
            language: course.language,
            name: course.name,
            description: course.description,
            creTime: course.creTime,
            id: course.id,
        })
        .where(eq(course.name, name))

        if (!updatedCourse){
            return null
        }

        return {
            courseId: updatedCourse[0].id,
            courseName: updatedCourse[0].name,
            language: updatedCourse[0].language,
            description: updatedCourse[0].description,
            teacherId: updatedCourse[0].teacherId,
            creationTime: updatedCourse[0].creTime,
            avgQuiz: updatedCourse[0].avgQuiz,
            price: updatedCourse[0].price,
        }


    }
}

export default new CourseService()