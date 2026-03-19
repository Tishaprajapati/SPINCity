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
-- Table structure for table `station_performance`
--

DROP TABLE IF EXISTS `station_performance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `station_performance` (
  `performance_id` int NOT NULL AUTO_INCREMENT,
  `station_id` int NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `total_rentals` int DEFAULT '0',
  `total_revenue` decimal(10,2) DEFAULT '0.00',
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `maintenance_requests` int DEFAULT '0',
  `customer_complaints` int DEFAULT '0',
  `cycles_redistributed` int DEFAULT '0',
  `performance_score` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`performance_id`),
  UNIQUE KEY `unique_station_month_year` (`station_id`,`month`,`year`),
  KEY `idx_station` (`station_id`),
  KEY `idx_year_month` (`year`,`month`),
  KEY `idx_performance_score` (`performance_score`),
  CONSTRAINT `station_performance_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `station` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `station_performance_chk_1` CHECK (((`month` >= 1) and (`month` <= 12))),
  CONSTRAINT `station_performance_chk_2` CHECK ((`year` >= 2020)),
  CONSTRAINT `station_performance_chk_3` CHECK ((`total_rentals` >= 0)),
  CONSTRAINT `station_performance_chk_4` CHECK ((`total_revenue` >= 0)),
  CONSTRAINT `station_performance_chk_5` CHECK (((`average_rating` >= 0) and (`average_rating` <= 5.00))),
  CONSTRAINT `station_performance_chk_6` CHECK ((`maintenance_requests` >= 0)),
  CONSTRAINT `station_performance_chk_7` CHECK ((`customer_complaints` >= 0)),
  CONSTRAINT `station_performance_chk_8` CHECK ((`cycles_redistributed` >= 0)),
  CONSTRAINT `station_performance_chk_9` CHECK (((`performance_score` >= 0) and (`performance_score` <= 100)))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station_performance`
--

LOCK TABLES `station_performance` WRITE;
/*!40000 ALTER TABLE `station_performance` DISABLE KEYS */;
/*!40000 ALTER TABLE `station_performance` ENABLE KEYS */;
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
