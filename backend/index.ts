import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import userRoutes from "./src/user/user.route"
import authRoutes from "./src/auth/auth.route"
import teacherRoutes from "./src/teacher/teacher.route"
import studentRoutes from "./src/student/student.route"
import courseRoutes from "./src/course/course.route"

import cors from "cors";

import teacherQualificationRoutes from "./src/teacherQualification/teacherQualification.route";
import courseTopicRoutes from "./src/courseTopic/courseTopic.route";
import sectionRoutes from "./src/section/section.route";
import quizRoutes from "./src/quiz/quiz.route";
import questionRoutes from "./src/question/question.route";
import optionRoutes from "./src/option/option.route";
import roadMapRoutes from "./src/roadMap/roadMap.route";
import requireCourseRoutes from "./src/requireCourse/requireCourse.route";
import certificationRoutes from "./src/certification/certification.route";
import joinRoutes from "./src/join/join.route";
import dORoutes from "./src/dO/dO.route";
import answerRecordRoutes from "./src/answerRecord/answerRecord.route";
import lectureRoutes from "./src/lecture/lecture.route";
import interactRoutes from "./src/interact/interact.route"; 
import includeCourseRoutes from "./src/includeCourse/includeCourse.route";
import viewRoadMapRoutes from "./src/viewRoadMap/viewRoadMap.route";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

if (!process.env.TOKEN_SECRET) {
  throw new Error("Missing TOKEN_SECRET in backend .env");
}

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