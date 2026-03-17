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
-- Table structure for table `cycle_service`
--

DROP TABLE IF EXISTS `cycle_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cycle_service` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `cycle_id` int NOT NULL,
  `last_serviced_date` date DEFAULT NULL,
  `next_service_due` date DEFAULT NULL,
  `total_rides_since_service` int DEFAULT '0',
  `condition_note` varchar(255) DEFAULT NULL,
  `condition_status` enum('Good','Minor_Issue','Major_Issue','Critical') DEFAULT NULL,
  `reported_by_emp_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`service_id`),
  KEY `cycle_id` (`cycle_id`),
  KEY `reported_by_emp_id` (`reported_by_emp_id`),
  CONSTRAINT `cycle_service_ibfk_1` FOREIGN KEY (`cycle_id`) REFERENCES `cycle` (`cycle_id`),
  CONSTRAINT `cycle_service_ibfk_2` FOREIGN KEY (`reported_by_emp_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cycle_service`
--

LOCK TABLES `cycle_service` WRITE;
/*!40000 ALTER TABLE `cycle_service` DISABLE KEYS */;
INSERT INTO `cycle_service` VALUES (10,3,NULL,'2026-02-27',0,'Front tyre is punctured','Major_Issue',2,'2026-02-26 11:25:33','2026-02-26 11:25:33'),(11,4,NULL,'2026-03-13',0,'seat cover damaged','Minor_Issue',3,'2026-03-12 06:44:23','2026-03-12 06:44:23'),(12,2,NULL,'2026-03-13',0,'wheel punctured','Major_Issue',3,'2026-03-12 07:30:39','2026-03-12 07:30:39');
/*!40000 ALTER TABLE `cycle_service` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-17 10:10:25
