CREATE TABLE `answerRecord` (
	`quizId` int NOT NULL,
	`studentId` int NOT NULL,
	`questionId` int NOT NULL,
	`studentAns` text,
	CONSTRAINT `pk_answerRecord` PRIMARY KEY(`questionId`,`studentId`)
);
--> statement-breakpoint
CREATE TABLE `certification` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`issueDate` date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`expDate` date,
	`courseId` int NOT NULL,
	`studentId` int NOT NULL,
	CONSTRAINT `certification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(80) NOT NULL,
	`language` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`teacherId` int NOT NULL,
	`creTime` date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`avgQuiz` int NOT NULL DEFAULT 0,
	`price` int NOT NULL DEFAULT 0,
	CONSTRAINT `course_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courseTopic` (
	`courseId` int NOT NULL,
	`topic` varchar(255) NOT NULL,
	CONSTRAINT `pk_courseTopic` PRIMARY KEY(`courseId`,`topic`)
);
--> statement-breakpoint
CREATE TABLE `dO` (
	`quizId` int NOT NULL,
	`studentId` int NOT NULL,
	`score` double,
	`attemptOrder` int NOT NULL,
	CONSTRAINT `pk_dO` PRIMARY KEY(`quizId`,`studentId`,`attemptOrder`)
);
--> statement-breakpoint
CREATE TABLE `includeCourse` (
	`rmId` int NOT NULL,
	`courseId` int NOT NULL,
	`order` int NOT NULL,
	CONSTRAINT `pk_includeCourse` PRIMARY KEY(`rmId`,`courseId`)
);
--> statement-breakpoint
CREATE TABLE `interact` (
	`lectureId` int NOT NULL,
	`studentId` int NOT NULL,
	CONSTRAINT `pk_interact` PRIMARY KEY(`lectureId`,`studentId`)
);
--> statement-breakpoint
CREATE TABLE `join` (
	`courseId` int NOT NULL,
	`studentId` int NOT NULL,
	`dateComplete` date,
	`dateStart` date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`progress` int NOT NULL DEFAULT 0,
	`GPA` double,
	CONSTRAINT `pk_join` PRIMARY KEY(`courseId`,`studentId`)
);
--> statement-breakpoint
CREATE TABLE `lecture` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`state` varchar(255) NOT NULL DEFAULT 'uncomplete',
	`material` varchar(255),
	`reference` varchar(255),
	`sectionId` int NOT NULL,
	CONSTRAINT `lecture_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `option` (
	`questionId` int NOT NULL,
	`option` varchar(1024) NOT NULL,
	CONSTRAINT `pk_option` PRIMARY KEY(`questionId`,`option`)
);
--> statement-breakpoint
CREATE TABLE `question` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`type` varchar(255) NOT NULL DEFAULT 'multiple choice',
	`answer` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`creTime` date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`teacherId` int NOT NULL,
	CONSTRAINT `pk_question` PRIMARY KEY(`id`,`quizId`)
);
--> statement-breakpoint
CREATE TABLE `quiz` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(512) NOT NULL,
	`state` varchar(255) NOT NULL DEFAULT 'opened',
	`attempt` int NOT NULL DEFAULT 1,
	`duration` int NOT NULL DEFAULT 10,
	`teacherId` int NOT NULL,
	`sectionId` int NOT NULL,
	`creTime` date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_id` PRIMARY KEY(`id`),
	CONSTRAINT `quiz_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `requireCourse` (
	`courseId` int NOT NULL,
	`rCourseId` int NOT NULL,
	CONSTRAINT `pk_requireCourse` PRIMARY KEY(`courseId`,`rCourseId`)
);
--> statement-breakpoint
CREATE TABLE `roadCertification` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`expDate` date,
	`issueDate` date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`courseId` int NOT NULL,
	`studentId` int NOT NULL,
	CONSTRAINT `roadCertification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roadMap` (
	`id` int AUTO_INCREMENT NOT NULL,
	`instruction` text NOT NULL,
	`description` text,
	`name` varchar(255) NOT NULL,
	`teacherId` int NOT NULL,
	CONSTRAINT `roadMap_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `section` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`numOfLecture` int NOT NULL DEFAULT 0,
	`timeTocomplete` int NOT NULL DEFAULT 12,
	`teacherId` int NOT NULL,
	`courseId` int NOT NULL,
	`creTime` date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `section_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student` (
	`userId` int NOT NULL,
	`studentId` varchar(10) NOT NULL,
	`enrollmentDate` date NOT NULL,
	`numberCoursesEnrolled` int NOT NULL DEFAULT 0,
	`numberCoursesCompleted` int NOT NULL DEFAULT 0,
	CONSTRAINT `student_userId` PRIMARY KEY(`userId`),
	CONSTRAINT `student_studentId_unique` UNIQUE(`studentId`)
);
--> statement-breakpoint
CREATE TABLE `teacher` (
	`userId` int NOT NULL,
	`teacherId` varchar(10) NOT NULL,
	CONSTRAINT `teacher_userId` PRIMARY KEY(`userId`),
	CONSTRAINT `teacher_teacherId_unique` UNIQUE(`teacherId`)
);
--> statement-breakpoint
CREATE TABLE `teacherQualification` (
	`teacherId` int NOT NULL,
	`qualification` varchar(255) NOT NULL,
	CONSTRAINT `pk_teacherQualification` PRIMARY KEY(`teacherId`,`qualification`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`firstName` varchar(64) NOT NULL,
	`lastName` varchar(64) NOT NULL,
	`username` varchar(64) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL,
	`bankName` varchar(255) NOT NULL,
	`bankAccount` varchar(255) NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`),
	CONSTRAINT `user_password_unique` UNIQUE(`password`)
);
--> statement-breakpoint
CREATE TABLE `viewRoadMap` (
	`rmId` int NOT NULL,
	`studentId` int NOT NULL,
	`suitability` int NOT NULL DEFAULT 0,
	`timeSuitability` int NOT NULL DEFAULT 0,
	`courseSui` int NOT NULL DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE `answerRecord` ADD CONSTRAINT `answerRecord_quizId_quiz_id_fk` FOREIGN KEY (`quizId`) REFERENCES `quiz`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `answerRecord` ADD CONSTRAINT `answerRecord_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `answerRecord` ADD CONSTRAINT `answerRecord_questionId_question_id_fk` FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certification` ADD CONSTRAINT `certification_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certification` ADD CONSTRAINT `certification_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course` ADD CONSTRAINT `course_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseTopic` ADD CONSTRAINT `courseTopic_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dO` ADD CONSTRAINT `dO_quizId_quiz_id_fk` FOREIGN KEY (`quizId`) REFERENCES `quiz`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dO` ADD CONSTRAINT `dO_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `includeCourse` ADD CONSTRAINT `includeCourse_rmId_roadMap_id_fk` FOREIGN KEY (`rmId`) REFERENCES `roadMap`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `includeCourse` ADD CONSTRAINT `includeCourse_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `interact` ADD CONSTRAINT `interact_lectureId_lecture_id_fk` FOREIGN KEY (`lectureId`) REFERENCES `lecture`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `interact` ADD CONSTRAINT `interact_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `join` ADD CONSTRAINT `join_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `join` ADD CONSTRAINT `join_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lecture` ADD CONSTRAINT `lecture_sectionId_section_id_fk` FOREIGN KEY (`sectionId`) REFERENCES `section`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `option` ADD CONSTRAINT `option_questionId_question_id_fk` FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question` ADD CONSTRAINT `question_quizId_quiz_id_fk` FOREIGN KEY (`quizId`) REFERENCES `quiz`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question` ADD CONSTRAINT `question_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_sectionId_section_id_fk` FOREIGN KEY (`sectionId`) REFERENCES `section`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `requireCourse` ADD CONSTRAINT `requireCourse_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `requireCourse` ADD CONSTRAINT `requireCourse_rCourseId_course_id_fk` FOREIGN KEY (`rCourseId`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roadCertification` ADD CONSTRAINT `roadCertification_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roadCertification` ADD CONSTRAINT `roadCertification_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roadMap` ADD CONSTRAINT `roadMap_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `section` ADD CONSTRAINT `section_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `section` ADD CONSTRAINT `section_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student` ADD CONSTRAINT `student_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacher` ADD CONSTRAINT `teacher_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacherQualification` ADD CONSTRAINT `teacherQualification_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`userId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `viewRoadMap` ADD CONSTRAINT `viewRoadMap_rmId_roadMap_id_fk` FOREIGN KEY (`rmId`) REFERENCES `roadMap`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `viewRoadMap` ADD CONSTRAINT `viewRoadMap_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student`(`userId`) ON DELETE no action ON UPDATE no action;