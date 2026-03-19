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
-- Table structure for table `maintenance_log`
--

DROP TABLE IF EXISTS `maintenance_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_log` (
  `maintenance_id` int NOT NULL AUTO_INCREMENT,
  `cycle_id` int NOT NULL,
  `maintenance_date` date NOT NULL,
  `maintenance_type` enum('Routine','Repair','Emergency','Inspection') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `cost` decimal(10,2) DEFAULT NULL,
  `performed_by_emp_id` int DEFAULT NULL,
  `next_maintenance_due` date DEFAULT NULL,
  `parts_replaced` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reported_by_emp_id` int DEFAULT NULL,
  `report_status` enum('Reported','Assigned','In Progress','Completed') COLLATE utf8mb4_unicode_ci DEFAULT 'Reported',
  PRIMARY KEY (`maintenance_id`),
  KEY `idx_cycle` (`cycle_id`),
  KEY `idx_maintenance_type` (`maintenance_type`),
  KEY `idx_employee` (`performed_by_emp_id`),
  KEY `reported_by_emp_id` (`reported_by_emp_id`),
  CONSTRAINT `maintenance_log_ibfk_1` FOREIGN KEY (`cycle_id`) REFERENCES `cycle` (`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `maintenance_log_ibfk_2` FOREIGN KEY (`performed_by_emp_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `maintenance_log_ibfk_3` FOREIGN KEY (`reported_by_emp_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `maintenance_log_chk_1` CHECK ((`cost` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_log`
--

LOCK TABLES `maintenance_log` WRITE;
/*!40000 ALTER TABLE `maintenance_log` DISABLE KEYS */;
INSERT INTO `maintenance_log` VALUES (6,3,'2026-02-26','Repair','Front tyre is punctured',500.00,2,'2026-04-02','tyre',NULL,NULL,2,'Completed'),(7,4,'2026-03-12','Repair','seat cover damaged',0.00,16,'2026-04-12','General service',NULL,NULL,3,'Completed'),(8,2,'2026-03-12','Repair','wheel punctured',0.00,16,'2026-04-12','General service',NULL,NULL,3,'Completed');
/*!40000 ALTER TABLE `maintenance_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-19 23:22:05
