import { sql } from "drizzle-orm";
import { pgTable, serial, date, integer, varchar, text, unique, primaryKey, doublePrecision, check,  } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255}).notNull().unique(),
    firstName: varchar("firstName", { length: 64}).notNull(),
    lastName: varchar("lastName", { length: 64}).notNull(),
    username: varchar("username", { length: 64}).notNull().unique(),
    password: varchar("password", { length: 255}).notNull().unique(),
    role: varchar("role", { length: 255}).notNull(),
    bankName: varchar("bankName", { length: 255}).notNull(),
    bankAccount: varchar("bankAccount", { length: 255}).notNull()
});

export const student = pgTable("student", {
    userId: serial("userId").notNull().references(() => user.id, { onDelete:'cascade' }).primaryKey(),
    studentId: varchar("studentId", { length: 10 }).notNull().unique(),
    enrollmentDate: date("enrollmentDate").notNull(),
    numberCoursesEnrolled: integer("numberCoursesEnrolled").notNull().default(0),
    numberCoursesCompleted: integer("numberCoursesCompleted").notNull().default(0),
})

export const teacher = pgTable("teacher", {
    userId: serial('userId').notNull().references(() => user.id, { onDelete:'cascade' }).primaryKey(),
    teacherId: varchar('teacherId', { length: 10  }).notNull().unique(),
})

export const teacherQualification = pgTable('teacherQualification', {
    teacherId: serial('teacherId').notNull().references(() => teacher.userId, { onDelete:'cascade' }),
    qualification: varchar('qualification', { length: 255 }).notNull()
}, (table) => {
    return{
        pk: primaryKey({ columns: [table.teacherId, table.qualification], name: "pk_teacherQualification"})
    }
})

export const course = pgTable('course',{
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 80 }).notNull(),
    language: varchar('language', { length: 255}).notNull(),
    description: text('description').notNull(),
    teacherId: serial('teacherId').notNull().references(() => teacher.userId, { onDelete:'cascade' }),
    creTime: date('creTime').notNull().defaultNow(),
    avgQuiz: integer('avgQuiz').notNull().default(0),
    price: integer('price').notNull().default(0)
})

export const courseTopic = pgTable('courseTopic', {
    courseId: serial('courseId').references(() => course.id, { onDelete:'cascade' }).notNull(),
    topic: varchar('topic', { length: 255 }).notNull(),
}, (table) => {
    return{
        pk: primaryKey({ columns: [table.courseId, table.topic], name: "pk_courseTopic"})
    }
})

export const section = pgTable('section',{
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    numOfLecture: integer('numOfLecture').notNull().default(0),
    timeToComplete: integer('timeTocomplete').notNull().default(12),
    teacherId: serial('teacherId').notNull().references(() => teacher.userId, { onDelete:'cascade' }),
    courseId: serial('courseId').notNull().references(() => course.id, { onDelete:'cascade' }),
    creTime: date('creTime').notNull().defaultNow()
})

export const quiz  = pgTable('quiz', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 512 }).notNull().unique(),
    state: varchar('state', { length: 255}).notNull().default('opened'),
    attempt: integer('attempt').notNull().default(1),
    duration: integer('duration').notNull().default(10),
    teacherId: serial('teacherId').notNull().references(() => teacher.userId, { onDelete:'cascade' }),
    sectionId: serial('sectionId').notNull().references(() => section.id, { onDelete:'cascade' }),
    creTime: date('creTime').notNull().defaultNow()
})

export const question = pgTable('question', {
    id: serial('id').unique(),
    quizId: serial('quizId').notNull().references(() => quiz.id, { onDelete:'cascade' }),
    type: varchar('type', { length: 255 }).notNull().default('multiple choice'),
    answer: varchar('answer',{ length: 255 }).notNull(),
    content: text('content').notNull(),
    creTime: date('creTime').notNull().defaultNow(),
    teacherId: serial('teacherId').notNull().references(() => teacher.userId, { onDelete:'cascade' })
},(table) => {
    return{
        pk: primaryKey({ columns: [table.id, table.quizId], name: "pk_question"})
    }
})

export const option = pgTable('option', {
    questionId: serial('questionId').notNull().references(() => question.id, { onDelete:'cascade' }),
    option: varchar('option', { length: 1024 }).notNull()
},(table) => {
    return{
        pk: primaryKey({ columns: [table.questionId, table.option], name: "pk_option"})
    }
})

export const roadMap = pgTable('roadMap',{
    id: serial('id').primaryKey(),
    instruction: text('instruction').notNull(),
    description: text('description'),
    name: varchar('name',{ length: 255 }).notNull(),
    teacherId: serial('teacherId').notNull().references(() => teacher.userId, { onDelete:'cascade' })
})

export const roadCertification = pgTable('roadCertification',{
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50}).notNull(),
    expDate: date('expDate'),
    issueDate: date('issueDate').notNull().defaultNow(),
    courseId: serial('courseId').notNull().references(() => course.id, { onDelete:'cascade' }),
    studentId: serial('studentId').notNull().references(() => student.userId, { onDelete:'cascade' })
})

export const requireCourse = pgTable('requireCours', {
    courseId: serial('courseId').notNull().references(() => course.id, { onDelete:'cascade' }),
    rCourseId: serial('rCourseId').notNull().references(() => course.id, { onDelete:'cascade' }),
},(table) => {
    return{
        pk: primaryKey({ columns: [table.courseId, table.rCourseId], name: "pk_requireCourse"})
    }
})

export const certification = pgTable('certification',{
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50}).notNull(),
    issueDate: date('issueDate').notNull().defaultNow(),
    expDate: date('expDate'),
    courseId: serial('courseId').notNull().references(() => course.id, { onDelete:'cascade' }),
    studentId: serial('studentId').notNull().references(() => student.userId, { onDelete:'cascade' })
})

export const join = pgTable('join', {
    courseId: serial('courseId').notNull().references(() => course.id, { onDelete:'cascade' }),
    studentId: serial('studentId').notNull().references(() => student.userId, { onDelete:'cascade' }),
    dateComplete: date('dateComplete'),
    dateStart: date('dateStart').notNull().defaultNow(),
    progress: integer('progress').notNull().default(0),
    GPA: doublePrecision('GPA')
}, (table) => {
    return{
        pk: primaryKey({ columns: [table.courseId, table.studentId], name: "pk_join"}),
        checkGPA: check("checkGpaConstraint", sql`${table.GPA } >= 0 AND ${table.GPA} <= 10`)
    }
})

export const dO = pgTable('dO', {
    quizId: serial('quizId').notNull().references(() => quiz.id, { onDelete:'cascade' }),
    studentId: serial('studentId').notNull().references(() => student.userId, { onDelete:'cascade' }),
    score: doublePrecision('score'),
    attemptOrder: integer('attemptOrder').notNull()
}, (table) => {
    return{
        pk: primaryKey({ columns: [table.quizId, table.studentId, table.attemptOrder], name: "pk_dO"})
    }
})

export const answerRecord = pgTable("answerRecord", {
    quizId: serial("quizId").notNull().references(() => quiz.id, { onDelete: 'cascade' }),
    studentId: serial("studentId").notNull().references(() => student.userId, { onDelete: 'cascade' }),
    questionId: serial("questionId").notNull().references(() => question.id, { onDelete:'cascade' }),
    studentAns: text("studentAns"),
  }, (table) => {
    return {
      pk: primaryKey({ columns: [table.questionId, table.studentId], name: "pk_answerRecord" }),
    }})

export const lecture = pgTable('lecture', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255}).notNull(),
    state: varchar('state', { length: 255}).notNull().default('uncomplete'),
    material: varchar('material', { length: 255}),
    reference: varchar('reference', { length: 255 }),
    sectionId: serial('sectionId').notNull().references(() => section.id, { onDelete:'cascade' })
})

export const interact = pgTable('interact', {
    lectureId: serial('lectureId').notNull().references(() => lecture.id, { onDelete:'cascade' }),
    studentId: serial('studentId').notNull().references(() => student.userId, { onDelete:'cascade' })
}, (table) => {
    return{
        pk: primaryKey({ columns: [table.lectureId, table.studentId], name: "pk_interact"})
    }
})

export const includeCourse = pgTable('includeCourse', {
    rmId: serial('rmId').notNull().references(() => roadMap.id,{ onDelete:'cascade' }),
    courseId: serial('courseId').notNull().references(() => course.id, { onDelete:'cascade' }),
    order: integer('order').notNull()
},(table) => {
    return{
        pk: primaryKey({ columns: [table.rmId, table.courseId], name: "pk_includeCourse"})
    }
})

export const viewRoadMap = pgTable('viewRoadMap',{
    rmId: serial('rmId').notNull().references(() => roadMap.id, { onDelete:'cascade' }),
    studentId: serial('studentId').notNull().references(() => student.userId, { onDelete:'cascade' }),
    suitability: integer('suitability').notNull().default(0),
    timeSuitabilty: integer('timeSuitability').notNull().default(0),
    courseSui: integer('courseSui').notNull().default(0)
})