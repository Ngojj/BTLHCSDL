"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewRoadMap = exports.includeCourse = exports.interact = exports.lecture = exports.answerRecord = exports.dO = exports.join = exports.certification = exports.requireCourse = exports.roadCertification = exports.roadMap = exports.option = exports.question = exports.quiz = exports.section = exports.courseTopic = exports.course = exports.teacherQualification = exports.teacher = exports.student = exports.user = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
/* ============= USER ============= */
exports.user = (0, mysql_core_1.mysqlTable)("user", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    firstName: (0, mysql_core_1.varchar)("firstName", { length: 64 }).notNull(),
    lastName: (0, mysql_core_1.varchar)("lastName", { length: 64 }).notNull(),
    username: (0, mysql_core_1.varchar)("username", { length: 64 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)("password", { length: 255 }).notNull().unique(),
    role: (0, mysql_core_1.varchar)("role", { length: 255 }).notNull(),
    bankName: (0, mysql_core_1.varchar)("bankName", { length: 255 }).notNull(),
    bankAccount: (0, mysql_core_1.varchar)("bankAccount", { length: 255 }).notNull(),
});
/* ============= STUDENT ============= */
exports.student = (0, mysql_core_1.mysqlTable)("student", {
    userId: (0, mysql_core_1.int)("userId").notNull().references(() => exports.user.id).primaryKey(),
    studentId: (0, mysql_core_1.varchar)("studentId", { length: 10 }).notNull().unique(),
    enrollmentDate: (0, mysql_core_1.date)("enrollmentDate").notNull(),
    numberCoursesEnrolled: (0, mysql_core_1.int)("numberCoursesEnrolled").notNull().default(0),
    numberCoursesCompleted: (0, mysql_core_1.int)("numberCoursesCompleted").notNull().default(0),
});
/* ============= TEACHER ============= */
exports.teacher = (0, mysql_core_1.mysqlTable)("teacher", {
    userId: (0, mysql_core_1.int)("userId").notNull().references(() => exports.user.id).primaryKey(),
    teacherId: (0, mysql_core_1.varchar)("teacherId", { length: 10 }).notNull().unique(),
});
/* ============= TEACHER QUALIFICATION ============= */
exports.teacherQualification = (0, mysql_core_1.mysqlTable)("teacherQualification", {
    teacherId: (0, mysql_core_1.int)("teacherId").notNull().references(() => exports.teacher.userId),
    qualification: (0, mysql_core_1.varchar)("qualification", { length: 255 }).notNull(),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({
        columns: [table.teacherId, table.qualification],
        name: "pk_teacherQualification",
    }),
}));
/* ============= COURSE ============= */
exports.course = (0, mysql_core_1.mysqlTable)("course", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 80 }).notNull(),
    language: (0, mysql_core_1.varchar)("language", { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)("description").notNull(),
    teacherId: (0, mysql_core_1.int)("teacherId").notNull().references(() => exports.teacher.userId),
    creTime: (0, mysql_core_1.date)("creTime").notNull().default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    avgQuiz: (0, mysql_core_1.int)("avgQuiz").notNull().default(0),
    price: (0, mysql_core_1.int)("price").notNull().default(0),
});
/* ============= COURSE TOPIC ============= */
exports.courseTopic = (0, mysql_core_1.mysqlTable)("courseTopic", {
    courseId: (0, mysql_core_1.int)("courseId").notNull().references(() => exports.course.id),
    topic: (0, mysql_core_1.varchar)("topic", { length: 255 }).notNull(),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({
        columns: [table.courseId, table.topic],
        name: "pk_courseTopic",
    }),
}));
/* ============= SECTION ============= */
exports.section = (0, mysql_core_1.mysqlTable)("section", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    numOfLecture: (0, mysql_core_1.int)("numOfLecture").notNull().default(0),
    timeToComplete: (0, mysql_core_1.int)("timeTocomplete").notNull().default(12),
    teacherId: (0, mysql_core_1.int)("teacherId").notNull().references(() => exports.teacher.userId),
    courseId: (0, mysql_core_1.int)("courseId").notNull().references(() => exports.course.id),
    creTime: (0, mysql_core_1.date)("creTime").notNull().default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
/* ============= QUIZ ============= */
exports.quiz = (0, mysql_core_1.mysqlTable)("quiz", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 512 }).notNull().unique(),
    state: (0, mysql_core_1.varchar)("state", { length: 255 }).notNull().default("opened"),
    attempt: (0, mysql_core_1.int)("attempt").notNull().default(1),
    duration: (0, mysql_core_1.int)("duration").notNull().default(10),
    teacherId: (0, mysql_core_1.int)("teacherId").notNull().references(() => exports.teacher.userId),
    sectionId: (0, mysql_core_1.int)("sectionId").notNull().references(() => exports.section.id),
    creTime: (0, mysql_core_1.date)("creTime").notNull().default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
/* ============= QUESTION ============= */
exports.question = (0, mysql_core_1.mysqlTable)("question", {
    id: (0, mysql_core_1.int)("id").autoincrement(),
    quizId: (0, mysql_core_1.int)("quizId").notNull().references(() => exports.quiz.id),
    type: (0, mysql_core_1.varchar)("type", { length: 255 }).notNull().default("multiple choice"),
    answer: (0, mysql_core_1.varchar)("answer", { length: 255 }).notNull(),
    content: (0, mysql_core_1.text)("content").notNull(),
    creTime: (0, mysql_core_1.date)("creTime").notNull().default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    teacherId: (0, mysql_core_1.int)("teacherId").notNull().references(() => exports.teacher.userId),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({
        columns: [table.id, table.quizId],
        name: "pk_question",
    }),
}));
/* ============= OPTION ============= */
exports.option = (0, mysql_core_1.mysqlTable)("option", {
    questionId: (0, mysql_core_1.int)("questionId").notNull().references(() => exports.question.id),
    option: (0, mysql_core_1.varchar)("option", { length: 1024 }).notNull(),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({
        columns: [table.questionId, table.option],
        name: "pk_option",
    }),
}));
/* ============= ROADMAP ============= */
exports.roadMap = (0, mysql_core_1.mysqlTable)("roadMap", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    instruction: (0, mysql_core_1.text)("instruction").notNull(),
    description: (0, mysql_core_1.text)("description"),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    teacherId: (0, mysql_core_1.int)("teacherId").notNull().references(() => exports.teacher.userId),
});
/* ============= ROAD CERTIFICATION ============= */
exports.roadCertification = (0, mysql_core_1.mysqlTable)("roadCertification", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 50 }).notNull(),
    expDate: (0, mysql_core_1.date)("expDate"),
    issueDate: (0, mysql_core_1.date)("issueDate").notNull().default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    courseId: (0, mysql_core_1.int)("courseId").notNull().references(() => exports.course.id),
    studentId: (0, mysql_core_1.int)("studentId").notNull().references(() => exports.student.userId),
});
/* ============= REQUIRE COURSE ============= */
exports.requireCourse = (0, mysql_core_1.mysqlTable)("requireCourse", {
    courseId: (0, mysql_core_1.int)("courseId").notNull().references(() => exports.course.id),
    rCourseId: (0, mysql_core_1.int)("rCourseId").notNull().references(() => exports.course.id),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({
        columns: [table.courseId, table.rCourseId],
        name: "pk_requireCourse",
    }),
}));
/* ============= CERTIFICATION ============= */
exports.certification = (0, mysql_core_1.mysqlTable)("certification", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 50 }).notNull(),
    issueDate: (0, mysql_core_1.date)("issueDate").notNull().default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    expDate: (0, mysql_core_1.date)("expDate"),
    courseId: (0, mysql_core_1.int)("courseId").notNull().references(() => exports.course.id),
    studentId: (0, mysql_core_1.int)("studentId").notNull().references(() => exports.student.userId),
});
/* ============= JOIN ============= */
exports.join = (0, mysql_core_1.mysqlTable)("join", {
    courseId: (0, mysql_core_1.int)("courseId").notNull().references(() => exports.course.id),
    studentId: (0, mysql_core_1.int)("studentId").notNull().references(() => exports.student.userId),
    dateComplete: (0, mysql_core_1.date)("dateComplete"),
    dateStart: (0, mysql_core_1.date)("dateStart").notNull().default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    progress: (0, mysql_core_1.int)("progress").notNull().default(0),
    GPA: (0, mysql_core_1.double)("GPA"),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({
        columns: [table.courseId, table.studentId],
        name: "pk_join",
    }),
    checkGPA: (0, drizzle_orm_1.sql) `CHECK (${table.GPA} >= 0 AND ${table.GPA} <= 10)`,
}));
/* ============= DO TABLE ============= */
exports.dO = (0, mysql_core_1.mysqlTable)("dO", {
    quizId: (0, mysql_core_1.int)("quizId").notNull().references(() => exports.quiz.id),
    studentId: (0, mysql_core_1.int)("studentId").notNull().references(() => exports.student.userId),
    score: (0, mysql_core_1.double)("score"),
    attemptOrder: (0, mysql_core_1.int)("attemptOrder").notNull(),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({
        columns: [table.quizId, table.studentId, table.attemptOrder],
        name: "pk_dO",
    }),
}));
/* ============= ANSWER RECORD ============= */
exports.answerRecord = (0, mysql_core_1.mysqlTable)("answerRecord", {
    quizId: (0, mysql_core_1.int)("quizId").notNull().references(() => exports.quiz.id),
    studentId: (0, mysql_core_1.int)("studentId").notNull().references(() => exports.student.userId),
    questionId: (0, mysql_core_1.int)("questionId").notNull().references(() => exports.question.id),
    studentAns: (0, mysql_core_1.text)("studentAns"),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({
        columns: [table.questionId, table.studentId],
        name: "pk_answerRecord",
    }),
}));
/* ============= LECTURE ============= */
exports.lecture = (0, mysql_core_1.mysqlTable)("lecture", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    state: (0, mysql_core_1.varchar)("state", { length: 255 }).notNull().default("uncomplete"),
    material: (0, mysql_core_1.varchar)("material", { length: 255 }),
    reference: (0, mysql_core_1.varchar)("reference", { length: 255 }),
    sectionId: (0, mysql_core_1.int)("sectionId").notNull().references(() => exports.section.id),
});
/* ============= INTERACT ============= */
exports.interact = (0, mysql_core_1.mysqlTable)("interact", {
    lectureId: (0, mysql_core_1.int)("lectureId").notNull().references(() => exports.lecture.id),
    studentId: (0, mysql_core_1.int)("studentId").notNull().references(() => exports.student.userId),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({
        columns: [table.lectureId, table.studentId],
        name: "pk_interact",
    }),
}));
/* ============= INCLUDE COURSE ============= */
exports.includeCourse = (0, mysql_core_1.mysqlTable)("includeCourse", {
    rmId: (0, mysql_core_1.int)("rmId").notNull().references(() => exports.roadMap.id),
    courseId: (0, mysql_core_1.int)("courseId").notNull().references(() => exports.course.id),
    order: (0, mysql_core_1.int)("order").notNull(),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({
        columns: [table.rmId, table.courseId],
        name: "pk_includeCourse",
    }),
}));
/* ============= VIEW ROADMAP ============= */
exports.viewRoadMap = (0, mysql_core_1.mysqlTable)("viewRoadMap", {
    rmId: (0, mysql_core_1.int)("rmId").notNull().references(() => exports.roadMap.id),
    studentId: (0, mysql_core_1.int)("studentId").notNull().references(() => exports.student.userId),
    suitability: (0, mysql_core_1.int)("suitability").notNull().default(0),
    timeSuitabilty: (0, mysql_core_1.int)("timeSuitability").notNull().default(0),
    courseSui: (0, mysql_core_1.int)("courseSui").notNull().default(0),
});
