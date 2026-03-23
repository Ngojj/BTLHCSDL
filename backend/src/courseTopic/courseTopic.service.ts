import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { course, courseTopic } from "../db/schema";



class courseTopicService {
    public async getAllCourseTopic() {
        try {
            const allCourseTopic = await db.select(
                {
                    courseId: courseTopic.courseId,
                    topic: courseTopic.topic
                }
            ).from(courseTopic);

            return allCourseTopic;
        }catch(err) {
            console.log(err);
        }
    }

    public async getCourseTopicById(courseId: number) {
        try {
            // find course topic by courseId
            const courseTopicByCourseId = await db.select(
                {
                    courseId: courseTopic.courseId,
                    topic: courseTopic.topic
                }
            ).from(courseTopic)
            .where(eq(courseTopic.courseId, courseId));

            return courseTopicByCourseId;
        }
        catch(err) {
            return err;
        }
    }

    public async createCourseTopic(courseId: number, topic: string) {
        try {
            // find course by courseId
            // const courseByCourseId = await db.select(
            //     {
            //         id: course.id,
            //     }
            // ).from(course)
            // .where(eq(course.id, courseId));

            // if (courseByCourseId.length === 0) {
            //     return {
            //         status: 404,
            //         message: "Course not found"
            //     }
            // }

            // check if this course topic already exist
            // const courseTopicExist = await db.select(
            //     {
            //         courseId: courseTopic.courseId,
            //         topic: courseTopic.topic
            //     }
            // ).from(courseTopic)
            // .where(eq(courseTopic.courseId, courseId))

            // if (courseTopicExist.length !== 0) {
            //     return {
            //         status: 404,
            //         message: "This course topic already exist"
            //     }
            // }


            // create course topic
            await db.insert(courseTopic)
                    .values({
                        courseId: courseId,
                        topic: topic
                    });

            return {
                message: "Successfully created course topic",
                data: {
                    courseId,
                    topic
                },
                status: 200
            }
        }catch(err) {
            return err;
        }   
    }

    public async updateCourseTopic(courseId: number, topic: string) {
        try{
            // find courseTopic by courseId
            const courseTopicByCourseId = await db.select(
                {
                    courseId: courseTopic.courseId,
                    topic: courseTopic.topic
                }
            ).from(courseTopic)
            .where(eq(courseTopic.courseId, courseId))

            if (courseTopicByCourseId.length === 0) {
                return {
                    status: 404,
                    message: "Course topic not found"
                }
            }

            // update course topic
            await db.update(courseTopic)
                    .set({
                        topic: topic
                    })
                    .where(eq(courseTopic.courseId, courseId));

            return {
                message: "Successfully updated course topic",
                data: {
                    courseId,
                    topic
                },
                status: 200
            }
        }catch(err) {   
            return {
                status: 505,
                message: err
            }
        }
    }

    public async deleteCourseTopic(courseId: number) {
        try {
            // find course topic by courseId
            const courseTopicByCourseId = await db.select(
                {
                    courseId: courseTopic.courseId,
                    topic: courseTopic.topic
                }
            ).from(courseTopic)
            .where(eq(courseTopic.courseId, courseId));

            if (courseTopicByCourseId.length === 0) {
                return {
                    status: 404,
                    message: "Course topic not found"
                }
            }

            // delete course topic
            await db.delete(courseTopic)
                    .where(eq(courseTopic.courseId, courseId));

            return {
                message: "Successfully deleted course topic",
                status: 200
            }
        }catch(err) {
            return {
                status: 500,
                message: err
            }
        }
    }

    public async deleteAllCourseTopicsInThisCourse(courseId: number) {
        try {
            // find course topic by courseId
            const courseTopicByCourseId = await db.select(
                {
                    courseId: courseTopic.courseId,
                    topic: courseTopic.topic
                }
            ).from(courseTopic)
            .where(eq(courseTopic.courseId, courseId));

            if (courseTopicByCourseId.length === 0) {
                return {
                    status: 404,
                    message: "Course topic not found"
                }
            }

            // delete all course topics in this course
            await db.delete(courseTopic)
                    .where(eq(courseTopic.courseId, courseId));

            return {
                message: "Successfully deleted all course topics in this course",
                status: 200
            }
        }catch(err) {
            return {
                status: 500,
                message: err
            }
        }
    }
}


export default new courseTopicService();   
