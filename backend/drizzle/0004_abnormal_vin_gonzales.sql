ALTER TABLE "dO" ADD COLUMN "score" double precision;--> statement-breakpoint
ALTER TABLE "dO" DROP CONSTRAINT pk_dO;
--> statement-breakpoint
ALTER TABLE "dO" ADD CONSTRAINT pk_dO PRIMARY KEY(quizId,studentId,attemptOrder);