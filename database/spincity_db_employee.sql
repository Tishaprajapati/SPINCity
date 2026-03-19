CREATE DATABASE  IF NOT EXISTS `spincity_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `spincity_db`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: spincity_db
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `assigned_station` int DEFAULT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joining_date` date NOT NULL,
  `salary` double DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `employment_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `branch_id` int DEFAULT NULL,
  `employee_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shift` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_area` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `idx_designation` (`designation`),
  KEY `idx_assigned_station` (`assigned_station`),
  KEY `idx_rating` (`rating`),
  KEY `idx_employment_status` (`employment_status`),
  CONSTRAINT `fk_employee_station` FOREIGN KEY (`assigned_station`) REFERENCES `station` (`station_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `employee_chk_1` CHECK ((`salary` >= 0)),
  CONSTRAINT `employee_chk_2` CHECK (((`rating` >= 0) and (`rating` <= 5.00)))
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,NULL,'Project Administrator','2024-01-01',80000,5,'Active','2026-02-09 07:49:20','2026-02-10 07:34:45',NULL,'admin@spincity.com','System Admin','$2a$10$6ovRrLTka2FLYTW.kgxx4e3MfaHZT/dkJSCXj8ezeI3e.4zj.KHai','9000000000','ADMIN','Full Day','Active',NULL),(2,1,'Station Manager','2023-01-01',45000,4.5,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager1@spincity.com','Manager Station 1','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000001','EMPLOYEE','Full Day','Active',NULL),(3,2,'Station Manager','2023-01-01',45000,4.6,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager2@spincity.com','Manager Station 2','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000002','EMPLOYEE','Full Day','Active',NULL),(4,3,'Station Manager','2023-01-01',45000,4.4,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager3@spincity.com','Manager Station 3','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000003','EMPLOYEE','Full Day','Active',NULL),(5,4,'Station Manager','2023-01-01',45000,4.7,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager4@spincity.com','Manager Station 4','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000004','EMPLOYEE','Full Day','Active',NULL),(6,5,'Station Manager','2023-01-01',45000,4.3,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager5@spincity.com','Manager Station 5','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000005','EMPLOYEE','Full Day','Active',NULL),(7,6,'Station Manager','2023-01-01',45000,4.8,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager6@spincity.com','Manager Station 6','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000006','EMPLOYEE','Full Day','Active',NULL),(8,7,'Station Manager','2023-01-01',45000,4.6,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager7@spincity.com','Manager Station 7','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000007','EMPLOYEE','Full Day','Active',NULL),(9,8,'Station Manager','2023-01-01',45000,4.5,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager8@spincity.com','Manager Station 8','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000008','EMPLOYEE','Full Day','Active',NULL),(10,9,'Station Manager','2023-01-01',45000,4.4,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager9@spincity.com','Manager Station 9','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000009','EMPLOYEE','Full Day','Active',NULL),(11,10,'Station Manager','2023-01-01',45000,4.7,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager10@spincity.com','Manager Station 10','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000010','EMPLOYEE','Full Day','Active',NULL),(12,11,'Station Manager','2023-01-01',45000,4.6,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager11@spincity.com','Manager Station 11','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000011','EMPLOYEE','Full Day','Active',NULL),(13,12,'Station Manager','2023-01-01',45000,4.5,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager12@spincity.com','Manager Station 12','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000012','EMPLOYEE','Full Day','Active',NULL),(14,13,'Station Manager','2023-01-01',45000,4.3,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager13@spincity.com','Manager Station 13','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000013','EMPLOYEE','Full Day','Active',NULL),(15,14,'Station Manager','2023-01-01',15000,4.6,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'manager14@spincity.com','Manager Station 14','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9100000014','EMPLOYEE','Full Day','Active',NULL),(16,NULL,'Cycle Maintenance','2023-02-01',28000,4.2,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'maint1@spincity.com','Maintenance Tech 1','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9200000001','EMPLOYEE','Morning','Active',NULL),(17,NULL,'Cycle Maintenance','2023-02-01',28000,4.3,'Active','2026-02-09 07:49:20','2026-02-10 06:57:29',NULL,'maint2@spincity.com','Maintenance Tech 2','$2a$10$CvIHr.iVuuRJBO81ZQP5outuJh2Sr2GRcJw9QZJncvSVkkhk2nPRW','9200000002','EMPLOYEE','Evening','Active',NULL),(19,NULL,'Station Employee','2026-03-17',12000,NULL,'Active',NULL,NULL,NULL,'emp@spincity.com','admin@spincity.com','$2a$10$jqSdZEo/3PqmYk1vqDGxIOiSXS7eGbBFnEEFs9lJHNEos2auFQXKu','9100000014','EMPLOYEE','Full Day',NULL,NULL);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-19 23:22:07
