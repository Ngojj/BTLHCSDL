
import { Request, Response } from 'express'
import courseService from './course.service'
import { stat } from 'fs'
class CourseController {
    public async getAllCourses(req: Request, res: Response) {
        try {
            const courses = await courseService.getAllCourses()

            return res.status(courses.status).send(courses)
        } catch (error) {
            res.status(500).json({
                message: error
            })            
        }
    }

    public async getAllCourseWithTeacherInfo(req: Request, res: Response){
        try {
            const courses = await courseService.getAllCoursesWithTeacherInfo();

            return res.status(courses.status).send(courses);
        } catch (error) {
            return {
                message: "Invalid: " + error,
                status: 500
            }
        }
    }

    public async getAllCourseByTeacherId(req: Request, res: Response){
        try {
            const { teacherId } = req.params;
            const courses = await courseService.getAllCoursesWithTeacherInfoByTeacherId(Number(teacherId));

            return res.status(courses.status).send(courses);
        } catch (error) {
            return {
                message: "Invalid: " + error,
                status: 500
            }
        }
    }
    public async getCourseById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const course = await courseService.getCourseById(Number(id))

            if (!course) {
                return res.status(404).json({
                    message: 'Course does not exist'
                })
            }

            return res.status(200).json({
                message: 'success',
                data: course
            })
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    }

    public async getCourseByName(req: Request, res: Response) {
        try {
            const { name } = req.params
            console.log(name);
            const course = await courseService.getCourseByName(name)

            if (!course) {
                return res.status(404).json({
                    message: 'Course does not exist'
                })
            }

            return res.status(200).json({
                message: 'success',
                data: course
            })
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    }

    public async createNewCourse(req: Request, res: Response) {
        try {
            const {courseName, language, description, teacherId, price, topics, avgQuiz } = req.body
            console.log(req.body)
            const newCourse : any = await courseService.createNewCourse(courseName, language, description, teacherId, price, topics, avgQuiz)

            return res.status(newCourse.status).send(newCourse)
        } catch (error) {
            res.status(500).json({
                message: error,
                status: 500
            })
        }
    }
    

    public async deleteCourseById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const course = await courseService.deleteCourseById(Number(id))

            if (!course) {
                return res.status(404).json({
                    message: 'Course does not exist'
                })
            }

            return res.status(200).json({
                message: 'success',
                data: course
            })
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    }

    public async deleteCourseByName(req: Request, res: Response) {
        try {
            const { name } = req.params
            const course = courseService.deleteCourseByName(name)

            if (!course) {
                return res.status(404).json({
                    message: 'Course does not exist'
                })
            }

            return res.status(200).json({
                message: 'success',
                data: course
            })
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    }

    public async updateCourseById(req: Request, res: Response) {
        try {
            const { id } = req.params   
            const {courseName, language, description, avgQuiz, price } = req.body
            console.log(req.body)
            const course = await courseService.updateCourseById(Number(id), courseName, language, description,avgQuiz, price)

            if (!course) {
                return res.status(404).json({
                    message: 'Course does not exist'
                })
            }

            return res.status(200).json({
                message: 'success',
                data: course
            })
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    }

    public async updateCourseByName(req: Request, res: Response) {
        try {
            const { name } = req.params
            const {courseName, language, description, avgQuiz, price } = req.body
            const course = await courseService.updateCourseByName(name, courseName, language, description, avgQuiz, price)

            if (!course) {
                return res.status(404).json({
                    message: 'Course does not exist'
                })
            }

            return res.status(200).json({
                message: 'success',
                data: course
            })
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    }
}

export default new CourseController()