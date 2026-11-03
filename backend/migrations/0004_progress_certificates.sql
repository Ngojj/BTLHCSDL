-- Per-student lecture progress: where the student stopped, and when they finished the lecture.
-- A row without `completedAt` means "started but not finished".
ALTER TABLE `interact`
	ADD COLUMN `positionSeconds` int NOT NULL DEFAULT 0,
	ADD COLUMN `completedAt` timestamp NULL,
	ADD COLUMN `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
--> statement-breakpoint
-- Certificates carry a public verification code and the grade they were issued with,
-- and a student can hold at most one certificate per course.
ALTER TABLE `certification`
	ADD COLUMN `code` varchar(20) NULL,
	ADD COLUMN `grade` double NULL;
--> statement-breakpoint
ALTER TABLE `certification`
	ADD CONSTRAINT `uq_certification_code` UNIQUE (`code`),
	ADD CONSTRAINT `uq_certification_student_course` UNIQUE (`studentId`, `courseId`);
