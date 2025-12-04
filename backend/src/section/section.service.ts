import { time } from "console";
import { db } from "../db/db";
import { course, section, teacher } from "../db/schema";
import { eq, asc } from "drizzle-orm";
import quizService from "../quiz/quiz.service";

class sectionService{
    public async getSectionById(id : number){
        try {
            const sectionById = await db.select({
                id: section.id,
                name: section.name, 
                numOfLecture: section.numOfLecture,
                timeToComplete: section.timeToComplete,
                teacherId: section.teacherId,
                courseId: section.courseId,
                creTime: section.creTime
            })
            .from(section)
            .where(eq(section.id, id))

            if (sectionById.length === 0){
                return {
                    message: "Section not found",
                    status: 404
                }
            }
            return {
                message: "Section fetched successfully",
                data: sectionById,
                status: 200
            }
        } catch (error) {
            console.log(error)
            return{
                message: error,
                status: 500
            }
        }
    }

    public async getSections(){
        try {
            const sections = await db.select({
                id: section.id,
                name: section.name, 
                numOfLecture: section.numOfLecture,
                timeToComplete: section.timeToComplete,
                teacherId: section.teacherId,
                courseId: section.courseId,
                creTime: section.creTime
            })
            .from(section)

            return {
                message: "Sections fetched successfully",
                data: sections,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getSectionsInCourse(courseId: number){
        try {
            const sections = await db.select({
                id: section.id,
                name: section.name, 
                numOfLecture: section.numOfLecture,
                timeToComplete: section.timeToComplete,
                teacherId: section.teacherId,
                courseId: section.courseId,
                creTime: section.creTime
            })
            .from(section)
            .where(eq(section.courseId, courseId))
            .orderBy(asc(section.id))
            return {
                message: "Sections fetched successfully1",
                data: sections,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
    public async createSection(name: string, numOfLecture: number, timeToComplete: number, teacherId: number, courseId: number){
        try {
            
            console.log({
                name: name,
                numOfLecture: numOfLecture,
                timeToComplete: timeToComplete,
                teacherId: teacherId,
                courseId: courseId  
            })

            const newSection = await db.insert(section)
                                        .values({
                                            name: name,
                                            numOfLecture: numOfLecture,
                                            timeToComplete: timeToComplete,
                                            teacherId: teacherId,
                                            courseId: courseId
                                        })
            
            return {
                message: "Section created successfully",
                status: 200
            }
        } catch (error) {
            console.log(error)
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateSection(id: number, name: string, numOfLecture: number, timeToComplete: number, teacherId: number, courseId: number){
        try {
            const sectionExists = await db.select({
                id: section.id,
                numOfLecture: section.numOfLecture,
                timeToComplete: section.timeToComplete,
                teacherId: section.teacherId,
                courseId: section.courseId,
            })
            .from(section)
            .where(eq(section.id, id))

            if (sectionExists.length === 0){
                return {
                    message: "Section not found",
                    status: 404
                }
            }
            const updatedSection = await db.update(section)
                                        .set({
                                            name: name,
                                            numOfLecture: numOfLecture,
                                            timeToComplete: timeToComplete,
                                            teacherId: teacherId,
                                            courseId: courseId
                                        })
                                        .where(eq(section.id, id))

            if (updatedSection === null){
                return {
                    message: "Section not found",
                    status: 404
                }
            }
            return {
                message: "Section updated successfully",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public deleteSection = async (id: number) => {
        try {
            const sectionExists = await db.select({
                id: section.id
            })
            .from(section)
            .where(eq(section.id, id))

            if (sectionExists.length === 0){
                return {
                    message: "Section not found",
                    status: 404
                }
            }
            // delete all quizzes in this section first
            quizService.deleteAllQuizInSection(id)
            const deletedSection = await db.delete(section)
                                        .where(eq(section.id, id))

            return {
                message: "Section deleted successfully",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteSectionsInCourse(courseId: number){
        try {
            const sections = await db.select({
                id: section.id
            })
            .from(section)
            .where(eq(section.courseId, courseId))

            if (sections.length === 0){
                return {
                    message: "No sections found",
                    status: 404
                }
            }
            // delete all quizzes in these sections first
            sections.forEach(async (section) => {
                await quizService.deleteAllQuizInSection(section.id)
            })
            const deletedSections = await db.delete(section)
                                        .where(eq(section.courseId, courseId))
            return {
                message: "Sections deleted successfully",
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

export default new sectionService();