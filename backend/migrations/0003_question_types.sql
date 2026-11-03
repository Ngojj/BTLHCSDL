-- The teacher UI creates "fill in blank" questions, but the original CHECK only allowed
-- multiple choice / true/false / short answer, so saving one failed with a constraint error.
ALTER TABLE `question` DROP CHECK `chk_question_type`;
--> statement-breakpoint
ALTER TABLE `question` ADD CONSTRAINT `chk_question_type` CHECK (`type` IN ('multiple choice','true/false','short answer','fill in blank'));
