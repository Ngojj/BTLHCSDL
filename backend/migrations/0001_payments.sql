-- Payment ledger: enrollment is created only from a PAID row (see src/payment).
CREATE TABLE `payment` (
	`orderCode` bigint NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int NOT NULL,
	`amount` int NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'PENDING',
	`checkoutUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`paidAt` timestamp,
	CONSTRAINT `payment_orderCode` PRIMARY KEY(`orderCode`),
	CONSTRAINT `payment_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student`(`userId`) ON DELETE cascade ON UPDATE no action,
	CONSTRAINT `payment_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX `idx_payment_student_course` ON `payment` (`studentId`,`courseId`);
--> statement-breakpoint
-- speeds up the monthly revenue / enrollment aggregation in src/analytics
CREATE INDEX `idx_join_dateStart` ON `join` (`dateStart`);
