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
-- Table structure for table `redistribution_log`
--

DROP TABLE IF EXISTS `redistribution_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `redistribution_log` (
  `redistribution_id` int NOT NULL AUTO_INCREMENT,
  `cycle_id` int NOT NULL,
  `from_station_id` int NOT NULL,
  `to_station_id` int NOT NULL,
  `redistribution_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `performed_by_emp_id` int NOT NULL,
  `reason` enum('Rebalancing','Maintenance','Customer Request','Station Full','Low Stock') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`redistribution_id`),
  KEY `idx_cycle` (`cycle_id`),
  KEY `idx_from_station` (`from_station_id`),
  KEY `idx_to_station` (`to_station_id`),
  KEY `idx_employee` (`performed_by_emp_id`),
  CONSTRAINT `redistribution_log_ibfk_1` FOREIGN KEY (`cycle_id`) REFERENCES `cycle` (`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `redistribution_log_ibfk_2` FOREIGN KEY (`from_station_id`) REFERENCES `station` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `redistribution_log_ibfk_3` FOREIGN KEY (`to_station_id`) REFERENCES `station` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `redistribution_log_ibfk_4` FOREIGN KEY (`performed_by_emp_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `redistribution_log`
--

LOCK TABLES `redistribution_log` WRITE;
/*!40000 ALTER TABLE `redistribution_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `redistribution_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-19 23:22:06
