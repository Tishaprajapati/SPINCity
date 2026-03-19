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
-- Table structure for table `cycle_pricing`
--

DROP TABLE IF EXISTS `cycle_pricing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cycle_pricing` (
  `pricing_id` int NOT NULL AUTO_INCREMENT,
  `performance_id` int NOT NULL,
  `price_per_hour` decimal(6,2) NOT NULL,
  `daily_price` decimal(6,2) DEFAULT NULL,
  `weekly_price` decimal(6,2) DEFAULT NULL,
  `monthly_price` decimal(6,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`pricing_id`),
  KEY `performance_id` (`performance_id`),
  CONSTRAINT `cycle_pricing_ibfk_1` FOREIGN KEY (`performance_id`) REFERENCES `cycle_performance_master` (`performance_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cycle_pricing`
--

LOCK TABLES `cycle_pricing` WRITE;
/*!40000 ALTER TABLE `cycle_pricing` DISABLE KEYS */;
INSERT INTO `cycle_pricing` VALUES (1,3,25.00,100.00,500.00,1500.00,'2026-02-04 08:07:49','2026-02-18 13:17:05'),(2,2,35.00,140.00,700.00,2100.00,'2026-02-04 08:07:49','2026-02-18 13:17:05'),(3,4,40.00,160.00,800.00,2400.00,'2026-02-04 08:07:49','2026-02-18 13:17:05'),(4,5,50.00,200.00,1000.00,3000.00,'2026-02-04 08:07:49','2026-02-18 13:17:05'),(5,1,45.00,180.00,900.00,2700.00,'2026-02-04 08:07:49','2026-02-18 13:17:05'),(6,6,70.00,280.00,1400.00,4200.00,'2026-02-04 08:07:49','2026-02-18 13:17:05');
/*!40000 ALTER TABLE `cycle_pricing` ENABLE KEYS */;
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
