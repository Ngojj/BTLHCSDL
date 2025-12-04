CREATE TABLE IF NOT EXISTS "answerRecord" (
	"quizId" serial NOT NULL,
	"studentId" serial NOT NULL,
	"questionId" serial NOT NULL,
	"studentAns" text,
	CONSTRAINT "pk_answerRecord" PRIMARY KEY("questionId","studentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "certification" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"issueDate" date DEFAULT now() NOT NULL,
	"expDate" date,
	"courseId" serial NOT NULL,
	"studentId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(80) NOT NULL,
	"language" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"teacherId" serial NOT NULL,
	"creTime" date DEFAULT now() NOT NULL,
	"avgQuiz" integer DEFAULT 0 NOT NULL,
	"price" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courseTopic" (
	"courseId" serial NOT NULL,
	"topic" varchar(255) NOT NULL,
	CONSTRAINT "pk_courseTopic" PRIMARY KEY("courseId","topic")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dO" (
	"quizId" serial NOT NULL,
	"studentId" serial NOT NULL,
	"score" integer,
	"attemptOrder" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "pk_dO" PRIMARY KEY("quizId","studentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "includeCourse" (
	"rmId" serial NOT NULL,
	"courseId" serial NOT NULL,
	"order" integer NOT NULL,
	CONSTRAINT "pk_includeCourse" PRIMARY KEY("rmId","courseId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interact" (
	"lectureId" serial NOT NULL,
	"studentId" serial NOT NULL,
	CONSTRAINT "pk_interact" PRIMARY KEY("lectureId","studentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "join" (
	"courseId" serial NOT NULL,
	"studentId" serial NOT NULL,
	"dateComplete" date,
	"dateStart" date DEFAULT now() NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"GPA" double precision,
	CONSTRAINT "pk_join" PRIMARY KEY("courseId","studentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lecture" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"state" varchar(255) DEFAULT 'uncomplete' NOT NULL,
	"material" varchar(255),
	"reference" varchar(255),
	"sectionId" serial NOT NULL,
	CONSTRAINT "lecture_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "option" (
	"questionId" serial NOT NULL,
	"option" varchar(1024) NOT NULL,
	CONSTRAINT "pk_option" PRIMARY KEY("questionId","option")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"id" serial NOT NULL,
	"quizId" serial NOT NULL,
	"type" varchar(255) DEFAULT 'multiple choice' NOT NULL,
	"answer" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"creTime" date DEFAULT now() NOT NULL,
	"teacherId" serial NOT NULL,
	CONSTRAINT "pk_question" PRIMARY KEY("id","quizId"),
	CONSTRAINT "question_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quiz" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(512) NOT NULL,
	"state" varchar(255) DEFAULT 'opened' NOT NULL,
	"attempt" integer DEFAULT 1 NOT NULL,
	"duration" integer DEFAULT 10 NOT NULL,
	"teacherId" serial NOT NULL,
	"sectionId" serial NOT NULL,
	"creTime" date DEFAULT now() NOT NULL,
	CONSTRAINT "quiz_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "requireCours" (
	"courseId" serial NOT NULL,
	"rCourseId" serial NOT NULL,
	CONSTRAINT "pk_requireCourse" PRIMARY KEY("courseId","rCourseId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roadCertification" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"expDate" date,
	"issueDate" date DEFAULT now() NOT NULL,
	"courseId" serial NOT NULL,
	"studentId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roadMap" (
	"id" serial PRIMARY KEY NOT NULL,
	"instruction" text NOT NULL,
	"description" text,
	"name" varchar(255) NOT NULL,
	"teacherId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "section" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"numOfLecture" integer DEFAULT 0 NOT NULL,
	"timeTocomplete" integer DEFAULT 12 NOT NULL,
	"teacherId" serial NOT NULL,
	"courseId" serial NOT NULL,
	"creTime" date DEFAULT now() NOT NULL,
	CONSTRAINT "section_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student" (
	"userId" serial PRIMARY KEY NOT NULL,
	"studentId" varchar(10) NOT NULL,
	"enrollmentDate" date NOT NULL,
	"numberCoursesEnrolled" integer DEFAULT 0 NOT NULL,
	"numberCoursesCompleted" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "student_studentId_unique" UNIQUE("studentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teacher" (
	"userId" serial PRIMARY KEY NOT NULL,
	"teacherId" varchar(10) NOT NULL,
	CONSTRAINT "teacher_teacherId_unique" UNIQUE("teacherId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teacherQualification" (
	"teacherId" serial NOT NULL,
	"qualification" varchar(255) NOT NULL,
	CONSTRAINT "pk_teacherQualification" PRIMARY KEY("teacherId","qualification")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"firstName" varchar(10) NOT NULL,
	"lastName" varchar(30) NOT NULL,
	"username" varchar(30) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"bankName" varchar(20) NOT NULL,
	"bankAccount" varchar(255) NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_password_unique" UNIQUE("password")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "viewRoadMap" (
	"rmId" serial NOT NULL,
	"studentId" serial NOT NULL,
	"suitability" integer DEFAULT 0 NOT NULL,
	"timeSuitability" integer DEFAULT 0 NOT NULL,
	"courseSui" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answerRecord" ADD CONSTRAINT "answerRecord_quizId_quiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answerRecord" ADD CONSTRAINT "answerRecord_studentId_student_userId_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answerRecord" ADD CONSTRAINT "answerRecord_questionId_question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certification" ADD CONSTRAINT "certification_courseId_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certification" ADD CONSTRAINT "certification_studentId_student_userId_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course" ADD CONSTRAINT "course_teacherId_teacher_userId_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."teacher"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courseTopic" ADD CONSTRAINT "courseTopic_courseId_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dO" ADD CONSTRAINT "dO_quizId_quiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dO" ADD CONSTRAINT "dO_studentId_student_userId_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "includeCourse" ADD CONSTRAINT "includeCourse_rmId_roadMap_id_fk" FOREIGN KEY ("rmId") REFERENCES "public"."roadMap"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "includeCourse" ADD CONSTRAINT "includeCourse_courseId_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interact" ADD CONSTRAINT "interact_lectureId_lecture_id_fk" FOREIGN KEY ("lectureId") REFERENCES "public"."lecture"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interact" ADD CONSTRAINT "interact_studentId_student_userId_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "join" ADD CONSTRAINT "join_courseId_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "join" ADD CONSTRAINT "join_studentId_student_userId_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lecture" ADD CONSTRAINT "lecture_sectionId_section_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "option" ADD CONSTRAINT "option_questionId_question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_quizId_quiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_teacherId_teacher_userId_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."teacher"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quiz" ADD CONSTRAINT "quiz_teacherId_teacher_userId_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."teacher"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quiz" ADD CONSTRAINT "quiz_sectionId_section_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requireCours" ADD CONSTRAINT "requireCours_courseId_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requireCours" ADD CONSTRAINT "requireCours_rCourseId_course_id_fk" FOREIGN KEY ("rCourseId") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roadCertification" ADD CONSTRAINT "roadCertification_courseId_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roadCertification" ADD CONSTRAINT "roadCertification_studentId_student_userId_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roadMap" ADD CONSTRAINT "roadMap_teacherId_teacher_userId_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."teacher"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section" ADD CONSTRAINT "section_teacherId_teacher_userId_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."teacher"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section" ADD CONSTRAINT "section_courseId_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student" ADD CONSTRAINT "student_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teacher" ADD CONSTRAINT "teacher_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teacherQualification" ADD CONSTRAINT "teacherQualification_teacherId_teacher_userId_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."teacher"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "viewRoadMap" ADD CONSTRAINT "viewRoadMap_rmId_roadMap_id_fk" FOREIGN KEY ("rmId") REFERENCES "public"."roadMap"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "viewRoadMap" ADD CONSTRAINT "viewRoadMap_studentId_student_userId_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
