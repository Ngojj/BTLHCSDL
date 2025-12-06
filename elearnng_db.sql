USE elearning_db;
-- Script đáp ứng yêu cầu bài tập lớn 2: tạo bảng + ràng buộc, dữ liệu mẫu, trigger, thủ tục, hàm.
-- MySQL 8.x

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa đối tượng TRIGER
-- DROP TRIGGER IF EXISTS trg_join_limit_active;
DROP TRIGGER IF EXISTS trg_lecture_count_ins;
DROP TRIGGER IF EXISTS trg_lecture_count_del;

-- Xóa đối tượng PROCEDURE
DROP PROCEDURE IF EXISTS sp_course_insert;
DROP PROCEDURE IF EXISTS sp_course_update;
DROP PROCEDURE IF EXISTS sp_course_delete;
DROP PROCEDURE IF EXISTS sp_list_courses_by_teacher;
DROP PROCEDURE IF EXISTS sp_student_progress_summary;

-- Xóa đối tượng FUNCTION
DROP FUNCTION IF EXISTS fn_total_spent;
DROP FUNCTION IF EXISTS fn_check_prereq_met;

-- Xóa đối tượng TABLE (Thứ tự xóa phải là từ con đến cha)

-- Bảng con cần dùng backtick (Tên trùng với từ khóa SQL)
DROP TABLE IF EXISTS answerRecord; -- Tên đúng theo script tạo bảng
DROP TABLE IF EXISTS dO;
DROP TABLE IF EXISTS `option`;
DROP TABLE IF EXISTS interact;
DROP TABLE IF EXISTS `join`;
DROP TABLE IF EXISTS roadCertification;
DROP TABLE IF EXISTS certification;

-- Các bảng còn lại
DROP TABLE IF EXISTS viewRoadMap;
DROP TABLE IF EXISTS includeCourse;
DROP TABLE IF EXISTS roadMap;

-- Các bảng cần thiết để xóa các bảng trên
DROP TABLE IF EXISTS requireCourse;
DROP TABLE IF EXISTS courseTopic;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS quiz;
DROP TABLE IF EXISTS lecture;
DROP TABLE IF EXISTS section;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS teacherQualification;
DROP TABLE IF EXISTS teacher;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS `user`;

SET FOREIGN_KEY_CHECKS = 1;

-- BẢNG NGUỒN
CREATE TABLE `user` (answerrecord
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `firstName` VARCHAR(32) NOT NULL,
  `lastName` VARCHAR(64) NOT NULL,
  `username` VARCHAR(64) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student','teacher','admin') NOT NULL,
  `bankName` VARCHAR(255) NOT NULL,
  `bankAccount` VARCHAR(255) NOT NULL,
  UNIQUE KEY uk_user_email (`email`),
  UNIQUE KEY uk_user_username (`username`),
  UNIQUE KEY uk_user_password (`password`),
  CONSTRAINT ck_user_email CHECK (`email` REGEXP '^[^@]+@[^@]+\\.[^@]+$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE teacher (
  `userId` INT NOT NULL PRIMARY KEY,
  `teacherId` VARCHAR(16) NOT NULL,
  UNIQUE KEY uk_teacher_tid (`teacherId`),
  CONSTRAINT fk_teacher_user FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE student (
  `userId` INT NOT NULL PRIMARY KEY,
  `studentId` VARCHAR(16) NOT NULL,
  `enrollmentDate` DATE NOT NULL,
  `numberCoursesEnrolled` INT NOT NULL DEFAULT 0,
  `numberCoursesCompleted` INT NOT NULL DEFAULT 0,
  UNIQUE KEY uk_student_sid (`studentId`),
  CONSTRAINT fk_student_user FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT ck_student_counts CHECK (`numberCoursesEnrolled` >= 0 AND `numberCoursesCompleted` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Đảm bảo đã DROP trigger cũ nếu bạn đã tạo trước đó
DROP TRIGGER IF EXISTS trg_student_enrollment_date;

DELIMITER $$
CREATE TRIGGER trg_student_enrollment_date
BEFORE INSERT ON student
FOR EACH ROW
BEGIN
    -- Kiểm tra nếu ngày đăng ký (NEW.enrollmentDate) lớn hơn ngày hiện tại
    IF NEW.enrollmentDate > CURRENT_DATE THEN
        -- Nếu vi phạm, dừng thao tác và hiển thị thông báo lỗi
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Ngày đăng ký (enrollmentDate) không được lớn hơn ngày hiện tại';
    END IF;
END$$
DELIMITER ;
CREATE TABLE teacherQualification (
  `teacherId` INT NOT NULL,
  `qualification` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`teacherId`,`qualification`),
  CONSTRAINT fk_teacherQualification_teacher FOREIGN KEY (`teacherId`) REFERENCES teacher(`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE course (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(80) NOT NULL,
  `language` VARCHAR(64) NOT NULL,
  `description` TEXT NOT NULL,
  `teacherId` INT NOT NULL,
  `creTime` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `avgQuiz` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `price` INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_course_teacher FOREIGN KEY (`teacherId`) REFERENCES teacher(`userId`) ON DELETE CASCADE,
  CONSTRAINT ck_course_price CHECK (`price` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE courseTopic (
  `courseId` INT NOT NULL,
  `topic` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`courseId`,`topic`),
  CONSTRAINT fk_courseTopic_course FOREIGN KEY (`courseId`) REFERENCES course(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE section (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `numOfLecture` INT NOT NULL DEFAULT 0,
  `timeTocomplete` INT NOT NULL DEFAULT 12,
  `teacherId` INT NOT NULL,
  `courseId` INT NOT NULL,
  `creTime` DATE NOT NULL DEFAULT (CURRENT_DATE),
  UNIQUE KEY uk_section_name (`name`),
  CONSTRAINT fk_section_teacher FOREIGN KEY (`teacherId`) REFERENCES teacher(`userId`) ON DELETE CASCADE,
  CONSTRAINT fk_section_course FOREIGN KEY (`courseId`) REFERENCES course(`id`) ON DELETE CASCADE,
  CONSTRAINT ck_section_time CHECK (`timeTocomplete` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE lecture (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `state` VARCHAR(20) NOT NULL DEFAULT 'uncomplete',
  `material` VARCHAR(255),
  `reference` VARCHAR(255),
  `sectionId` INT NOT NULL,
  UNIQUE KEY uk_lecture_name (`name`),
  CONSTRAINT fk_lecture_section FOREIGN KEY (`sectionId`) REFERENCES section(`id`) ON DELETE CASCADE,
  CONSTRAINT ck_lecture_state CHECK (`state` IN ('uncomplete','in-progress','done'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE quiz (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `state` VARCHAR(20) NOT NULL DEFAULT 'opened',
  `attempt` INT NOT NULL DEFAULT 1,
  `duration` INT NOT NULL DEFAULT 10,
  `teacherId` INT NOT NULL,
  `sectionId` INT NOT NULL,
  `creTime` DATE NOT NULL DEFAULT (CURRENT_DATE),
  UNIQUE KEY uk_quiz_name (`name`),
  CONSTRAINT fk_quiz_teacher FOREIGN KEY (`teacherId`) REFERENCES teacher(`userId`) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_section FOREIGN KEY (`sectionId`) REFERENCES section(`id`) ON DELETE CASCADE,
  CONSTRAINT ck_quiz_attempt CHECK (`attempt` > 0),
  CONSTRAINT ck_quiz_duration CHECK (`duration` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE question (
  `id` INT AUTO_INCREMENT,
  `quizId` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL DEFAULT 'multiple choice',
  `answer` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `creTime` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `teacherId` INT NOT NULL,
  PRIMARY KEY (`id`,`quizId`),
  CONSTRAINT uk_question_id UNIQUE (`id`),
  CONSTRAINT fk_question_quiz FOREIGN KEY (`quizId`) REFERENCES quiz(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_question_teacher FOREIGN KEY (`teacherId`) REFERENCES teacher(`userId`) ON DELETE CASCADE,
  CONSTRAINT ck_question_type CHECK (`type` IN ('multiple choice','true-false','essay'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `option` (
  `questionId` INT NOT NULL,
  `option` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`questionId`,`option`),
  CONSTRAINT fk_option_question FOREIGN KEY (`questionId`) REFERENCES question(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `join` (
  `courseId` INT NOT NULL,
  `studentId` INT NOT NULL,
  `dateComplete` DATE DEFAULT NULL,
  `dateStart` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `progress` INT NOT NULL DEFAULT 0,
  `GPA` DECIMAL(3,2),
  PRIMARY KEY (`courseId`,`studentId`),
  CONSTRAINT fk_join_course FOREIGN KEY (`courseId`) REFERENCES course(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_join_student FOREIGN KEY (`studentId`) REFERENCES student(`userId`) ON DELETE CASCADE,
  CONSTRAINT ck_join_progress CHECK (`progress` BETWEEN 0 AND 100),
  CONSTRAINT ck_join_gpa CHECK (`GPA` IS NULL OR (`GPA` BETWEEN 0 AND 10)),
  CONSTRAINT ck_join_dates CHECK (`dateComplete` IS NULL OR `dateComplete` >= `dateStart`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dO (
  `quizId` INT NOT NULL,
  `studentId` INT NOT NULL,
  `score` DECIMAL(5,2),
  `attemptOrder` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`quizId`,`studentId`,`attemptOrder`),
  CONSTRAINT fk_do_quiz FOREIGN KEY (`quizId`) REFERENCES quiz(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_do_student FOREIGN KEY (`studentId`) REFERENCES student(`userId`) ON DELETE CASCADE,
  CONSTRAINT ck_do_score CHECK (`score` IS NULL OR (`score` BETWEEN 0 AND 100)),
  CONSTRAINT ck_do_attempt CHECK (`attemptOrder` >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE answerRecord (
  `quizId` INT NOT NULL,
  `studentId` INT NOT NULL,
  `questionId` INT NOT NULL,
  `studentAns` TEXT,
  PRIMARY KEY (`questionId`,`studentId`),
  CONSTRAINT fk_ar_quiz FOREIGN KEY (`quizId`) REFERENCES quiz(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_ar_student FOREIGN KEY (`studentId`) REFERENCES student(`userId`) ON DELETE CASCADE,
  CONSTRAINT fk_ar_question FOREIGN KEY (`questionId`) REFERENCES question(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE certification (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `issueDate` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `expDate` DATE DEFAULT NULL,
  `courseId` INT NOT NULL,
  `studentId` INT NOT NULL,
  CONSTRAINT fk_cert_course FOREIGN KEY (`courseId`) REFERENCES course(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_cert_student FOREIGN KEY (`studentId`) REFERENCES student(`userId`) ON DELETE CASCADE,
  CONSTRAINT ck_cert_dates CHECK (`expDate` IS NULL OR `expDate` > `issueDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE roadMap (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `instruction` TEXT NOT NULL,
  `description` TEXT,
  `name` VARCHAR(255) NOT NULL,
  `teacherId` INT NOT NULL,
  CONSTRAINT fk_rm_teacher FOREIGN KEY (`teacherId`) REFERENCES teacher(`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE includeCourse (
  `rmId` INT NOT NULL,
  `courseId` INT NOT NULL,
  `order` INT NOT NULL,
  PRIMARY KEY (`rmId`,`courseId`),
  CONSTRAINT fk_inc_rm FOREIGN KEY (`rmId`) REFERENCES roadMap(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_inc_course FOREIGN KEY (`courseId`) REFERENCES course(`id`) ON DELETE CASCADE,
  CONSTRAINT ck_inc_order CHECK (`order` >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE viewRoadMap (
  `rmId` INT NOT NULL,
  `studentId` INT NOT NULL,
  `suitability` INT NOT NULL DEFAULT 0,
  `timeSuitability` INT NOT NULL DEFAULT 0,
  `courseSui` INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_view_rm FOREIGN KEY (`rmId`) REFERENCES roadMap(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_view_student FOREIGN KEY (`studentId`) REFERENCES student(`userId`) ON DELETE CASCADE,
  CONSTRAINT ck_view_scores CHECK (`suitability` BETWEEN 0 AND 100 AND `timeSuitability` BETWEEN 0 AND 100 AND `courseSui` BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE requireCourse (
  `courseId` INT NOT NULL,
  `rCourseId` INT NOT NULL,
  PRIMARY KEY (`courseId`,`rCourseId`),
  CONSTRAINT fk_req_course FOREIGN KEY (`courseId`) REFERENCES course(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_req_rcourse FOREIGN KEY (`rCourseId`) REFERENCES course(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE roadCertification (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `expDate` DATE DEFAULT NULL,
  `issueDate` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `courseId` INT NOT NULL,
  `studentId` INT NOT NULL,
  CONSTRAINT fk_rcert_course FOREIGN KEY (`courseId`) REFERENCES course(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_rcert_student FOREIGN KEY (`studentId`) REFERENCES student(`userId`) ON DELETE CASCADE,
  CONSTRAINT ck_rcert_dates CHECK (`expDate` IS NULL OR `expDate` > `issueDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE interact (
  `lectureId` INT NOT NULL,
  `studentId` INT NOT NULL,
  PRIMARY KEY (`lectureId`,`studentId`),
  CONSTRAINT fk_interact_lecture FOREIGN KEY (`lectureId`) REFERENCES lecture(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_interact_student FOREIGN KEY (`studentId`) REFERENCES student(`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DỮ LIỆU MẪU (>=5 bản ghi mỗi bảng)
INSERT INTO `user` (`email`,`firstName`,`lastName`,`username`,`password`,`role`,`bankName`,`bankAccount`) VALUES
('alice.teacher@example.com','Alice','Tran','alice.t','pw1','teacher','VCB','001'),
('bob.teacher@example.com','Bob','Nguyen','bob.t','pw2','teacher','VCB','002'),
('carl.teacher@example.com','Carl','Pham','carl.t','pw3','teacher','ACB','003'),
('dana.teacher@example.com','Dana','Le','dana.t','pw4','teacher','TCB','004'),
('evan.teacher@example.com','Evan','Do','evan.t','pw5','teacher','MB','005'),
('sara.student@example.com','Sara','Ho','sara.s','pw6','student','VCB','101'),
('tom.student@example.com','Tom','Ly','tom.s','pw7','student','VCB','102'),
('mia.student@example.com','Mia','Vo','mia.s','pw8','student','ACB','103'),
('leo.student@example.com','Leo','Pham','leo.s','pw9','student','TCB','104'),
('ivy.student@example.com','Ivy','Bui','ivy.s','pw10','student','MB','105');

INSERT INTO teacher(`userId`,`teacherId`) VALUES
(1,'T001'),(2,'T002'),(3,'T003'),(4,'T004'),(5,'T005');

INSERT INTO student(`userId`,`studentId`,`enrollmentDate`,`numberCoursesEnrolled`,`numberCoursesCompleted`) VALUES
(6,'S001','2024-01-10',2,1),
(7,'S002','2024-02-15',2,0),
(8,'S003','2024-03-12',1,0),
(9,'S004','2024-01-20',3,2),
(10,'S005','2024-04-01',1,0);

INSERT INTO teacherQualification(`teacherId`,`qualification`) VALUES
(1,'AWS Certified'),(2,'Azure Fundamentals'),(3,'GCP Associate'),(4,'Oracle DBA'),(5,'Docker & K8s');

INSERT INTO course(`name`,`language`,`description`,`teacherId`,`creTime`,`avgQuiz`,`price`) VALUES
('SQL Basics','English','Intro to SQL',1,'2024-03-01',0,100),
('Web Backend','English','NodeJS basics',2,'2024-03-05',0,120),
('Data Analysis','Vietnamese','Pandas & BI',3,'2024-03-07',0,150),
('Cloud 101','English','Intro cloud',4,'2024-03-10',0,130),
('DevOps Pipeline','English','CI/CD basics',5,'2024-03-12',0,160);

INSERT INTO courseTopic(`courseId`,`topic`) VALUES
(1,'SELECT'),(1,'JOIN'),(2,'Express'),(3,'Pandas'),(4,'IAM');

INSERT INTO section(`name`,`numOfLecture`,`timeTocomplete`,`teacherId`,`courseId`,`creTime`) VALUES
('SQL Intro',0,10,1,1,'2024-03-02'),
('Backend Routing',0,12,2,2,'2024-03-06'),
('BI Overview',0,8,3,3,'2024-03-08'),
('Cloud Basics',0,14,4,4,'2024-03-11'),
('CI Concepts',0,9,5,5,'2024-03-13');

INSERT INTO lecture(`name`,`state`,`material`,`reference`,`sectionId`) VALUES
('SQL SELECT','done','slides1','url1',1),
('Express Router','in-progress','slides2','url2',2),
('PowerBI Intro','done','slides3','url3',3),
('IAM Roles','uncomplete','slides4','url4',4),
('Pipeline Basics','in-progress','slides5','url5',5);

INSERT INTO quiz(`name`,`state`,`attempt`,`duration`,`teacherId`,`sectionId`,`creTime`) VALUES
('Quiz SQL 1','opened',2,20,1,1,'2024-03-03'),
('Quiz Backend 1','opened',1,15,2,2,'2024-03-07'),
('Quiz BI 1','opened',1,25,3,3,'2024-03-09'),
('Quiz Cloud 1','opened',1,20,4,4,'2024-03-12'),
('Quiz DevOps 1','opened',2,18,5,5,'2024-03-14');

INSERT INTO question(`quizId`,`type`,`answer`,`content`,`creTime`,`teacherId`) VALUES
(1,'multiple choice','A','What does SELECT do?','2024-03-03',1),
(2,'multiple choice','B','Express default port?','2024-03-07',2),
(3,'true-false','True','BI stands for Business Intelligence','2024-03-09',3),
(4,'multiple choice','C','Which service manages IAM?','2024-03-12',4),
(5,'multiple choice','D','CI stands for?','2024-03-14',5);

INSERT INTO `option`(`questionId`,`option`) VALUES
(1,'A'),(2,'B'),(3,'True'),(4,'C'),(5,'D');

INSERT INTO `join`(`courseId`,`studentId`,`dateComplete`,`dateStart`,`progress`,`GPA`) VALUES
(1,6,NULL,'2024-04-10',60,NULL),
(1,7,'2024-04-20','2024-03-15',100,8.5),
(2,8,NULL,'2024-04-18',40,NULL),
(3,9,'2024-05-10','2024-03-18',100,9.0),
(4,10,NULL,'2024-05-01',20,NULL);

INSERT INTO dO(`quizId`,`studentId`,`score`,`attemptOrder`) VALUES
(1,6,70,1),
(1,7,90,1),
(2,8,55,1),
(3,9,95,1),
(4,10,40,1);

INSERT INTO answerRecord(`quizId`,`studentId`,`questionId`,`studentAns`) VALUES
(1,6,1,'A'),
(1,7,1,'A'),
(2,8,2,'B'),
(3,9,3,'True'),
(4,10,4,'C');

INSERT INTO certification(`name`,`issueDate`,`expDate`,`courseId`,`studentId`) VALUES
('SQL Cert','2024-05-01','2026-05-01',1,7),
('SQL Cert','2024-05-01','2026-05-01',1,6),
('BI Cert','2024-06-02','2026-06-02',3,9),
('Cloud Cert','2024-06-10','2026-06-10',4,10),
('Backend Cert','2024-05-20','2026-05-20',2,8);

INSERT INTO roadMap(`instruction`,`description`,`name`,`teacherId`) VALUES
('Follow SQL path','SQL desc','RM SQL',1),
('Follow backend path','BE desc','RM BE',2),
('Follow BI path','BI desc','RM BI',3),
('Follow cloud path','Cloud desc','RM Cloud',4),
('Follow DevOps path','DevOps desc','RM DevOps',5);

INSERT INTO includeCourse(`rmId`,`courseId`,`order`) VALUES
(1,1,1),(2,2,1),(3,3,1),(4,4,1),(5,5,1);

INSERT INTO viewRoadMap(`rmId`,`studentId`,`suitability`,`timeSuitability`,`courseSui`) VALUES
(1,6,80,75,70),
(2,7,60,65,55),
(3,8,70,70,70),
(4,9,85,80,90),
(5,10,50,55,45);

INSERT INTO requireCourse(`courseId`,`rCourseId`) VALUES
(2,1),(3,1),(4,1),(5,2),(5,4);

INSERT INTO roadCertification(`name`,`expDate`,`issueDate`,`courseId`,`studentId`) VALUES
('RM SQL Cert','2026-05-01','2024-05-01',1,6),
('RM BE Cert','2026-06-01','2024-06-01',2,8),
('RM BI Cert','2026-06-15','2024-06-15',3,9),
('RM Cloud Cert','2026-07-01','2024-07-01',4,10),
('RM DevOps Cert','2026-07-10','2024-07-10',5,7);

INSERT INTO interact(`lectureId`,`studentId`) VALUES
(1,6),(2,7),(3,8),(4,9),(5,10);

-- TRIGGER NGHIỆP VỤ: giới hạn số khóa đang học (<100%) tối đa 3
DELIMITER $$
CREATE TRIGGER trg_join_limit_active
BEFORE INSERT ON `join`
FOR EACH ROW
BEGIN
  DECLARE active_cnt INT;
  SELECT COUNT(*) INTO active_cnt
  FROM `join`
  WHERE studentId = NEW.studentId AND progress < 100;
  IF active_cnt >= 3 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sinh viên đã có 3 khóa đang học, không thể đăng ký thêm';
  END IF;
END$$

-- TRIGGER THUỘC TÍNH DẪN XUẤT: cập nhật section.numOfLecture
CREATE TRIGGER trg_lecture_count_ins
AFTER INSERT ON lecture
FOR EACH ROW
BEGIN
  UPDATE section s
  SET s.numOfLecture = (SELECT COUNT(*) FROM lecture l WHERE l.sectionId = NEW.sectionId)
  WHERE s.id = NEW.sectionId;
END$$

CREATE TRIGGER trg_lecture_count_del
AFTER DELETE ON lecture
FOR EACH ROW
BEGIN
  UPDATE section s
  SET s.numOfLecture = (SELECT COUNT(*) FROM lecture l WHERE l.sectionId = OLD.sectionId)
  WHERE s.id = OLD.sectionId;
END$$
DELIMITER ;

-- THỦ TỤC CRUD cho bảng course kèm validate
DELIMITER $$
CREATE PROCEDURE sp_course_insert(
  IN p_name VARCHAR(80),
  IN p_language VARCHAR(64),
  IN p_description TEXT,
  IN p_teacherId INT,
  IN p_price INT
)
BEGIN
  IF p_price < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Giá khóa học phải >= 0';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM teacher t WHERE t.userId = p_teacherId) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Giáo viên không tồn tại';
  END IF;
  INSERT INTO course(`name`,`language`,`description`,`teacherId`,`price`)
  VALUES(p_name,p_language,p_description,p_teacherId,p_price);
END$$

CREATE PROCEDURE sp_course_update(
  IN p_courseId INT,
  IN p_name VARCHAR(80),
  IN p_language VARCHAR(64),
  IN p_description TEXT,
  IN p_price INT
)
BEGIN
  IF NOT EXISTS (SELECT 1 FROM course c WHERE c.id = p_courseId) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Khóa học không tồn tại';
  END IF;
  IF p_price < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Giá khóa học phải >= 0';
  END IF;
  UPDATE course
  SET `name` = p_name,
      `language` = p_language,
      `description` = p_description,
      `price` = p_price
  WHERE id = p_courseId;
END$$

CREATE PROCEDURE sp_course_delete(IN p_courseId INT)
BEGIN
  IF EXISTS (SELECT 1 FROM `join` j WHERE j.courseId = p_courseId) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Khóa học đã có sinh viên, không được xóa';
  END IF;
  DELETE FROM course WHERE id = p_courseId;
END$$

-- THỦ TỤC TRUY VẤN
CREATE PROCEDURE sp_list_courses_by_teacher(
  IN p_teacherId INT,
  IN p_minPrice INT
)
BEGIN
  SELECT c.id, c.name, c.price, c.language, u.firstName, u.lastName
  FROM course c
  JOIN teacher t ON t.userId = c.teacherId
  JOIN `user` u ON u.id = t.userId
  WHERE c.teacherId = p_teacherId AND c.price >= p_minPrice
  ORDER BY c.price DESC, c.name ASC;
END$$

CREATE PROCEDURE sp_student_progress_summary(
  IN p_minProgress INT
)
BEGIN
  SELECT s.studentId,
         u.firstName,
         u.lastName,
         COUNT(j.courseId) AS totalCourses,
         AVG(j.progress) AS avgProgress
  FROM `join` j
  JOIN student s ON s.userId = j.studentId
  JOIN `user` u ON u.id = s.userId
  WHERE j.progress >= p_minProgress
  GROUP BY s.studentId, u.firstName, u.lastName
  HAVING AVG(j.progress) >= p_minProgress
  ORDER BY avgProgress DESC;
END$$
DELIMITER ;

-- HÀM
DELIMITER $$
CREATE FUNCTION fn_total_spent(p_studentId INT)
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_courseId INT;
  DECLARE v_sum INT DEFAULT 0;
  DECLARE cur CURSOR FOR SELECT courseId FROM `join` WHERE studentId = p_studentId;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
  IF p_studentId IS NULL OR p_studentId <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'studentId không hợp lệ';
  END IF;
  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO v_courseId;
    IF done = 1 THEN LEAVE read_loop; END IF;
    SELECT v_sum + price INTO v_sum FROM course WHERE id = v_courseId;
  END LOOP;
  CLOSE cur;
  RETURN v_sum;
END$$

CREATE FUNCTION fn_check_prereq_met(p_courseId INT, p_studentId INT)
RETURNS TINYINT
DETERMINISTIC
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_req INT;
  DECLARE ok TINYINT DEFAULT 1;
  DECLARE cur CURSOR FOR SELECT rCourseId FROM requireCourse WHERE courseId = p_courseId;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
  IF p_courseId IS NULL OR p_studentId IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tham số đầu vào không hợp lệ';
  END IF;
  OPEN cur;
  prereq_loop: LOOP
    FETCH cur INTO v_req;
    IF done = 1 THEN LEAVE prereq_loop; END IF;
    IF NOT EXISTS (
      SELECT 1 FROM `join` j WHERE j.courseId = v_req AND j.studentId = p_studentId AND j.progress = 100
    ) THEN
      SET ok = 0;
      LEAVE prereq_loop;
    END IF;
  END LOOP;
  CLOSE cur;
  RETURN ok;
END$$
DELIMITER ;

SET FOREIGN_KEY_CHECKS = 1;

-- Hướng dẫn nhanh kiểm thử:
-- 1) CALL sp_course_insert('New Course','English','desc',1,50);
-- 2) CALL sp_course_update(1,'SQL Basics Updated','English','desc',120);
-- 3) CALL sp_course_delete(99); -- sẽ báo lỗi nếu tồn tại join
-- 4) CALL sp_list_courses_by_teacher(1,0);
-- 5) CALL sp_student_progress_summary(50);
-- 6) SELECT fn_total_spent(6);
-- 7) SELECT fn_check_prereq_met(2,6);
