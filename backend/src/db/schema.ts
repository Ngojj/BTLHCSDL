import { sql } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  text,
  date,
  double,
  primaryKey,
} from "drizzle-orm/mysql-core";

/* ============= USER ============= */

export const user = mysqlTable("user", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("firstName", { length: 64 }).notNull(),
  lastName: varchar("lastName", { length: 64 }).notNull(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 255 }).notNull(),
  bankName: varchar("bankName", { length: 255 }).notNull(),
  bankAccount: varchar("bankAccount", { length: 255 }).notNull(),
});

/* ============= STUDENT ============= */

export const student = mysqlTable("student", {
  userId: int("userId").notNull().references(() => user.id).primaryKey(),
  studentId: varchar("studentId", { length: 10 }).notNull().unique(),
  enrollmentDate: date("enrollmentDate").notNull(),
  numberCoursesEnrolled: int("numberCoursesEnrolled").notNull().default(0),
  numberCoursesCompleted: int("numberCoursesCompleted").notNull().default(0),
});

/* ============= TEACHER ============= */

export const teacher = mysqlTable("teacher", {
  userId: int("userId").notNull().references(() => user.id).primaryKey(),
  teacherId: varchar("teacherId", { length: 10 }).notNull().unique(),
});

/* ============= TEACHER QUALIFICATION ============= */

export const teacherQualification = mysqlTable(
  "teacherQualification",
  {
    teacherId: int("teacherId").notNull().references(() => teacher.userId),
    qualification: varchar("qualification", { length: 255 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.teacherId, table.qualification],
      name: "pk_teacherQualification",
    }),
  })
);

/* ============= COURSE ============= */

export const course = mysqlTable("course", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  language: varchar("language", { length: 255 }).notNull(),
  description: text("description").notNull(),
  teacherId: int("teacherId").notNull().references(() => teacher.userId),
  creTime: date("creTime").notNull().default(sql`CURRENT_TIMESTAMP`),
  avgQuiz: int("avgQuiz").notNull().default(0),
  price: int("price").notNull().default(0),
});

/* ============= COURSE TOPIC ============= */

export const courseTopic = mysqlTable(
  "courseTopic",
  {
    courseId: int("courseId").notNull().references(() => course.id),
    topic: varchar("topic", { length: 255 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.courseId, table.topic],
      name: "pk_courseTopic",
    }),
  })
);

/* ============= SECTION ============= */

export const section = mysqlTable("section", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  numOfLecture: int("numOfLecture").notNull().default(0),
  timeToComplete: int("timeTocomplete").notNull().default(12),
  teacherId: int("teacherId").notNull().references(() => teacher.userId),
  courseId: int("courseId").notNull().references(() => course.id),
  creTime: date("creTime").notNull().default(sql`CURRENT_TIMESTAMP`),
});

/* ============= QUIZ ============= */

export const quiz = mysqlTable("quiz", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 512 }).notNull().unique(),
  state: varchar("state", { length: 255 }).notNull().default("opened"),
  attempt: int("attempt").notNull().default(1),
  duration: int("duration").notNull().default(10),
  teacherId: int("teacherId").notNull().references(() => teacher.userId),
  sectionId: int("sectionId").notNull().references(() => section.id),
  creTime: date("creTime").notNull().default(sql`CURRENT_TIMESTAMP`),
});

/* ============= QUESTION ============= */

export const question = mysqlTable(
  "question",
  {
    id: int("id").autoincrement(),
    quizId: int("quizId").notNull().references(() => quiz.id),
    type: varchar("type", { length: 255 }).notNull().default("multiple choice"),
    answer: varchar("answer", { length: 255 }).notNull(),
    content: text("content").notNull(),
    creTime: date("creTime").notNull().default(sql`CURRENT_TIMESTAMP`),
    teacherId: int("teacherId").notNull().references(() => teacher.userId),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.id, table.quizId],
      name: "pk_question",
    }),
  })
);

/* ============= OPTION ============= */

export const option = mysqlTable(
  "option",
  {
    questionId: int("questionId").notNull().references(() => question.id),
    option: varchar("option", { length: 1024 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.questionId, table.option],
      name: "pk_option",
    }),
  })
);

/* ============= ROADMAP ============= */

export const roadMap = mysqlTable("roadMap", {
  id: int("id").autoincrement().primaryKey(),
  instruction: text("instruction").notNull(),
  description: text("description"),
  name: varchar("name", { length: 255 }).notNull(),
  teacherId: int("teacherId").notNull().references(() => teacher.userId),
});

/* ============= ROAD CERTIFICATION ============= */

export const roadCertification = mysqlTable("roadCertification", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  expDate: date("expDate"),
  issueDate: date("issueDate").notNull().default(sql`CURRENT_TIMESTAMP`),
  courseId: int("courseId").notNull().references(() => course.id),
  studentId: int("studentId").notNull().references(() => student.userId),
});

/* ============= REQUIRE COURSE ============= */

export const requireCourse = mysqlTable(
  "requireCourse",
  {
    courseId: int("courseId").notNull().references(() => course.id),
    rCourseId: int("rCourseId").notNull().references(() => course.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.courseId, table.rCourseId],
      name: "pk_requireCourse",
    }),
  })
);

/* ============= CERTIFICATION ============= */

export const certification = mysqlTable("certification", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  issueDate: date("issueDate").notNull().default(sql`CURRENT_TIMESTAMP`),
  expDate: date("expDate"),
  courseId: int("courseId").notNull().references(() => course.id),
  studentId: int("studentId").notNull().references(() => student.userId),
});

/* ============= JOIN ============= */

export const join = mysqlTable(
  "join",
  {
    courseId: int("courseId").notNull().references(() => course.id),
    studentId: int("studentId").notNull().references(() => student.userId),
    dateComplete: date("dateComplete"),
    dateStart: date("dateStart").notNull().default(sql`CURRENT_TIMESTAMP`),
    progress: int("progress").notNull().default(0),
    GPA: double("GPA"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.courseId, table.studentId],
      name: "pk_join",
    }),
    checkGPA: sql`CHECK (${table.GPA} >= 0 AND ${table.GPA} <= 10)`,
  })
);

/* ============= DO TABLE ============= */

export const dO = mysqlTable(
  "dO",
  {
    quizId: int("quizId").notNull().references(() => quiz.id),
    studentId: int("studentId").notNull().references(() => student.userId),
    score: double("score"),
    attemptOrder: int("attemptOrder").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.quizId, table.studentId, table.attemptOrder],
      name: "pk_dO",
    }),
  })
);

/* ============= ANSWER RECORD ============= */

export const answerRecord = mysqlTable(
  "answerRecord",
  {
    quizId: int("quizId").notNull().references(() => quiz.id),
    studentId: int("studentId").notNull().references(() => student.userId),
    questionId: int("questionId").notNull().references(() => question.id),
    studentAns: text("studentAns"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.questionId, table.studentId],
      name: "pk_answerRecord",
    }),
  })
);

/* ============= LECTURE ============= */

export const lecture = mysqlTable("lecture", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull().default("uncomplete"),
  material: varchar("material", { length: 255 }),
  reference: varchar("reference", { length: 255 }),
  sectionId: int("sectionId").notNull().references(() => section.id),
});

/* ============= INTERACT ============= */

export const interact = mysqlTable(
  "interact",
  {
    lectureId: int("lectureId").notNull().references(() => lecture.id),
    studentId: int("studentId").notNull().references(() => student.userId),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.lectureId, table.studentId],
      name: "pk_interact",
    }),
  })
);

/* ============= INCLUDE COURSE ============= */

export const includeCourse = mysqlTable(
  "includeCourse",
  {
    rmId: int("rmId").notNull().references(() => roadMap.id),
    courseId: int("courseId").notNull().references(() => course.id),
    order: int("order").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.rmId, table.courseId],
      name: "pk_includeCourse",
    }),
  })
);

/* ============= VIEW ROADMAP ============= */

export const viewRoadMap = mysqlTable("viewRoadMap", {
  rmId: int("rmId").notNull().references(() => roadMap.id),
  studentId: int("studentId").notNull().references(() => student.userId),
  suitability: int("suitability").notNull().default(0),
  timeSuitabilty: int("timeSuitability").notNull().default(0),
  courseSui: int("courseSui").notNull().default(0),
});
