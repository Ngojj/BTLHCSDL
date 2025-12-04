-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: elearning_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answerrecord`
--

DROP TABLE IF EXISTS `answerrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answerrecord` (
  `quizId` int NOT NULL,
  `studentId` int NOT NULL,
  `questionId` int NOT NULL,
  `studentAns` text,
  PRIMARY KEY (`questionId`,`studentId`),
  KEY `answerRecord_quizId_quiz_id_fk` (`quizId`),
  KEY `answerRecord_studentId_student_userId_fk` (`studentId`),
  CONSTRAINT `answerRecord_questionId_question_id_fk` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE CASCADE,
  CONSTRAINT `answerRecord_quizId_quiz_id_fk` FOREIGN KEY (`quizId`) REFERENCES `quiz` (`id`) ON DELETE CASCADE,
  CONSTRAINT `answerRecord_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answerrecord`
--

LOCK TABLES `answerrecord` WRITE;
/*!40000 ALTER TABLE `answerrecord` DISABLE KEYS */;
/*!40000 ALTER TABLE `answerrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certification`
--

DROP TABLE IF EXISTS `certification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `issueDate` date NOT NULL DEFAULT (curdate()),
  `expDate` date DEFAULT NULL,
  `courseId` int NOT NULL,
  `studentId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `certification_courseId_course_id_fk` (`courseId`),
  KEY `certification_studentId_student_userId_fk` (`studentId`),
  CONSTRAINT `certification_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `certification_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certification`
--

LOCK TABLES `certification` WRITE;
/*!40000 ALTER TABLE `certification` DISABLE KEYS */;
/*!40000 ALTER TABLE `certification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `language` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `teacherId` int NOT NULL,
  `creTime` date NOT NULL DEFAULT (curdate()),
  `avgQuiz` int NOT NULL DEFAULT '0',
  `price` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `course_teacherId_teacher_userId_fk` (`teacherId`),
  CONSTRAINT `course_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursetopic`
--

DROP TABLE IF EXISTS `coursetopic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coursetopic` (
  `courseId` int NOT NULL,
  `topic` varchar(255) NOT NULL,
  PRIMARY KEY (`courseId`,`topic`),
  CONSTRAINT `courseTopic_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursetopic`
--

LOCK TABLES `coursetopic` WRITE;
/*!40000 ALTER TABLE `coursetopic` DISABLE KEYS */;
/*!40000 ALTER TABLE `coursetopic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `do`
--

DROP TABLE IF EXISTS `do`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `do` (
  `quizId` int NOT NULL,
  `studentId` int NOT NULL,
  `score` int DEFAULT NULL,
  `attemptOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`quizId`,`studentId`),
  KEY `dO_studentId_student_userId_fk` (`studentId`),
  CONSTRAINT `dO_quizId_quiz_id_fk` FOREIGN KEY (`quizId`) REFERENCES `quiz` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dO_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `do`
--

LOCK TABLES `do` WRITE;
/*!40000 ALTER TABLE `do` DISABLE KEYS */;
/*!40000 ALTER TABLE `do` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `includecourse`
--

DROP TABLE IF EXISTS `includecourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `includecourse` (
  `rmId` int NOT NULL,
  `courseId` int NOT NULL,
  `order` int NOT NULL,
  PRIMARY KEY (`rmId`,`courseId`),
  KEY `includeCourse_courseId_course_id_fk` (`courseId`),
  CONSTRAINT `includeCourse_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `includeCourse_rmId_roadMap_id_fk` FOREIGN KEY (`rmId`) REFERENCES `roadmap` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `includecourse`
--

LOCK TABLES `includecourse` WRITE;
/*!40000 ALTER TABLE `includecourse` DISABLE KEYS */;
/*!40000 ALTER TABLE `includecourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interact`
--

DROP TABLE IF EXISTS `interact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interact` (
  `lectureId` int NOT NULL,
  `studentId` int NOT NULL,
  PRIMARY KEY (`lectureId`,`studentId`),
  KEY `interact_studentId_student_userId_fk` (`studentId`),
  CONSTRAINT `interact_lectureId_lecture_id_fk` FOREIGN KEY (`lectureId`) REFERENCES `lecture` (`id`) ON DELETE CASCADE,
  CONSTRAINT `interact_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interact`
--

LOCK TABLES `interact` WRITE;
/*!40000 ALTER TABLE `interact` DISABLE KEYS */;
/*!40000 ALTER TABLE `interact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `join`
--

DROP TABLE IF EXISTS `join`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `join` (
  `courseId` int NOT NULL,
  `studentId` int NOT NULL,
  `dateComplete` date DEFAULT NULL,
  `dateStart` date NOT NULL DEFAULT (curdate()),
  `progress` int NOT NULL DEFAULT '0',
  `GPA` double DEFAULT NULL,
  PRIMARY KEY (`courseId`,`studentId`),
  KEY `join_studentId_student_userId_fk` (`studentId`),
  CONSTRAINT `join_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `join_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `join`
--

LOCK TABLES `join` WRITE;
/*!40000 ALTER TABLE `join` DISABLE KEYS */;
/*!40000 ALTER TABLE `join` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecture`
--

DROP TABLE IF EXISTS `lecture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecture` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL DEFAULT 'uncomplete',
  `material` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `sectionId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lecture_name_unique` (`name`),
  KEY `lecture_sectionId_section_id_fk` (`sectionId`),
  CONSTRAINT `lecture_sectionId_section_id_fk` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecture`
--

LOCK TABLES `lecture` WRITE;
/*!40000 ALTER TABLE `lecture` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `option`
--

DROP TABLE IF EXISTS `option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `option` (
  `questionId` int NOT NULL,
  `option` varchar(255) NOT NULL,
  PRIMARY KEY (`questionId`,`option`),
  CONSTRAINT `option_questionId_question_id_fk` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `option`
--

LOCK TABLES `option` WRITE;
/*!40000 ALTER TABLE `option` DISABLE KEYS */;
/*!40000 ALTER TABLE `option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quizId` int NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'multiple choice',
  `answer` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `creTime` date NOT NULL DEFAULT (curdate()),
  `teacherId` int NOT NULL,
  PRIMARY KEY (`id`,`quizId`),
  UNIQUE KEY `question_id_unique` (`id`),
  KEY `question_quizId_quiz_id_fk` (`quizId`),
  KEY `question_teacherId_teacher_userId_fk` (`teacherId`),
  CONSTRAINT `question_quizId_quiz_id_fk` FOREIGN KEY (`quizId`) REFERENCES `quiz` (`id`) ON DELETE CASCADE,
  CONSTRAINT `question_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `state` varchar(255) NOT NULL DEFAULT 'opened',
  `attempt` int NOT NULL DEFAULT '1',
  `duration` int NOT NULL DEFAULT '10',
  `teacherId` int NOT NULL,
  `sectionId` int NOT NULL,
  `creTime` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `quiz_name_unique` (`name`),
  KEY `quiz_teacherId_teacher_userId_fk` (`teacherId`),
  KEY `quiz_sectionId_section_id_fk` (`sectionId`),
  CONSTRAINT `quiz_sectionId_section_id_fk` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quiz_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requirecours`
--

DROP TABLE IF EXISTS `requirecours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requirecours` (
  `courseId` int NOT NULL,
  `rCourseId` int NOT NULL,
  PRIMARY KEY (`courseId`,`rCourseId`),
  KEY `requireCours_rCourseId_course_id_fk` (`rCourseId`),
  CONSTRAINT `requireCours_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `requireCours_rCourseId_course_id_fk` FOREIGN KEY (`rCourseId`) REFERENCES `course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requirecours`
--

LOCK TABLES `requirecours` WRITE;
/*!40000 ALTER TABLE `requirecours` DISABLE KEYS */;
/*!40000 ALTER TABLE `requirecours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roadcertification`
--

DROP TABLE IF EXISTS `roadcertification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roadcertification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `expDate` date DEFAULT NULL,
  `issueDate` date NOT NULL DEFAULT (curdate()),
  `courseId` int NOT NULL,
  `studentId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roadCertification_courseId_course_id_fk` (`courseId`),
  KEY `roadCertification_studentId_student_userId_fk` (`studentId`),
  CONSTRAINT `roadCertification_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `roadCertification_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roadcertification`
--

LOCK TABLES `roadcertification` WRITE;
/*!40000 ALTER TABLE `roadcertification` DISABLE KEYS */;
/*!40000 ALTER TABLE `roadcertification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roadmap`
--

DROP TABLE IF EXISTS `roadmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roadmap` (
  `id` int NOT NULL AUTO_INCREMENT,
  `instruction` text NOT NULL,
  `description` text,
  `name` varchar(255) NOT NULL,
  `teacherId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roadMap_teacherId_teacher_userId_fk` (`teacherId`),
  CONSTRAINT `roadMap_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roadmap`
--

LOCK TABLES `roadmap` WRITE;
/*!40000 ALTER TABLE `roadmap` DISABLE KEYS */;
/*!40000 ALTER TABLE `roadmap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `numOfLecture` int NOT NULL DEFAULT '0',
  `timeTocomplete` int NOT NULL DEFAULT '12',
  `teacherId` int NOT NULL,
  `courseId` int NOT NULL,
  `creTime` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `section_name_unique` (`name`),
  KEY `section_teacherId_teacher_userId_fk` (`teacherId`),
  KEY `section_courseId_course_id_fk` (`courseId`),
  CONSTRAINT `section_courseId_course_id_fk` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `section_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section`
--

LOCK TABLES `section` WRITE;
/*!40000 ALTER TABLE `section` DISABLE KEYS */;
/*!40000 ALTER TABLE `section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `userId` int NOT NULL,
  `studentId` varchar(10) NOT NULL,
  `enrollmentDate` date NOT NULL,
  `numberCoursesEnrolled` int NOT NULL DEFAULT '0',
  `numberCoursesCompleted` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `student_studentId_unique` (`studentId`),
  CONSTRAINT `student_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `userId` int NOT NULL,
  `teacherId` varchar(255) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `teacher_teacherId_unique` (`teacherId`),
  CONSTRAINT `teacher_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacherqualification`
--

DROP TABLE IF EXISTS `teacherqualification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacherqualification` (
  `teacherId` int NOT NULL,
  `qualification` varchar(255) NOT NULL,
  PRIMARY KEY (`teacherId`,`qualification`),
  CONSTRAINT `teacherQualification_teacherId_teacher_userId_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacherqualification`
--

LOCK TABLES `teacherqualification` WRITE;
/*!40000 ALTER TABLE `teacherqualification` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacherqualification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(10) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `bankName` varchar(255) NOT NULL,
  `bankAccount` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`),
  UNIQUE KEY `user_username_unique` (`username`),
  UNIQUE KEY `user_password_unique` (`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `viewroadmap`
--

DROP TABLE IF EXISTS `viewroadmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viewroadmap` (
  `rmId` int NOT NULL,
  `studentId` int NOT NULL,
  `suitability` int NOT NULL DEFAULT '0',
  `timeSuitability` int NOT NULL DEFAULT '0',
  `courseSui` int NOT NULL DEFAULT '0',
  KEY `viewRoadMap_rmId_roadMap_id_fk` (`rmId`),
  KEY `viewRoadMap_studentId_student_userId_fk` (`studentId`),
  CONSTRAINT `viewRoadMap_rmId_roadMap_id_fk` FOREIGN KEY (`rmId`) REFERENCES `roadmap` (`id`) ON DELETE CASCADE,
  CONSTRAINT `viewRoadMap_studentId_student_userId_fk` FOREIGN KEY (`studentId`) REFERENCES `student` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viewroadmap`
--

LOCK TABLES `viewroadmap` WRITE;
/*!40000 ALTER TABLE `viewroadmap` DISABLE KEYS */;
/*!40000 ALTER TABLE `viewroadmap` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-04 14:28:05
