import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import userRoutes from "./user/user.route"
import authRoutes from "./auth/auth.route"
import teacherRoutes from "./teacher/teacher.route"
import studentRoutes from "./student/student.route"
import courseRoutes from "./course/course.route"

import cors from "cors";

import teacherQualificationRoutes from "./teacherQualification/teacherQualification.route";
import courseTopicRoutes from "./courseTopic/courseTopic.route";
import sectionRoutes from "./section/section.route";
import quizRoutes from "./quiz/quiz.route";
import questionRoutes from "./question/question.route";
import optionRoutes from "./option/option.route";
import roadMapRoutes from "./roadMap/roadMap.route";
import requireCourseRoutes from "./requireCourse/requireCourse.route";
import certificationRoutes from "./certification/certification.route";
import joinRoutes from "./join/join.route";
import dORoutes from "./dO/dO.route";
import answerRecordRoutes from "./answerRecord/answerRecord.route";
import lectureRoutes from "./lecture/lecture.route";
import interactRoutes from "./interact/interact.route"; 
import includeCourseRoutes from "./includeCourse/includeCourse.route";
import viewRoadMapRoutes from "./viewRoadMap/viewRoadMap.route";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors()); // Enable CORS
app.use(express.json())
app.use('/user',userRoutes)
app.use('/student', studentRoutes)
app.use('/teacher', teacherRoutes)
app.use('/auth', authRoutes)
app.use('/course', courseRoutes)
app.use('/teacherQualification', teacherQualificationRoutes)
app.use('/courseTopic', courseTopicRoutes)
app.use('/section', sectionRoutes)
app.use('/quiz', quizRoutes)
app.use('/question', questionRoutes)
app.use('/option', optionRoutes)
app.use('/roadMap', roadMapRoutes)
app.use('/requireCourse', requireCourseRoutes)
app.use('/certification', certificationRoutes)
app.use('/join', joinRoutes)
app.use('/dO', dORoutes)
app.use('/answerRecord', answerRecordRoutes)
app.use('/lecture', lectureRoutes)
app.use('/interact', interactRoutes)
app.use('/includeCourse', includeCourseRoutes)
app.use('/viewRoadMap', viewRoadMapRoutes)
const server = createServer(app)


server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});