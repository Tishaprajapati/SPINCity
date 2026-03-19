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
-- Table structure for table `cycle_performance_master`
--

DROP TABLE IF EXISTS `cycle_performance_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cycle_performance_master` (
  `performance_id` int NOT NULL AUTO_INCREMENT,
  `cycle_category` enum('Gear','Non-Gear','Kids','Women','City','Electric') NOT NULL,
  `point_1` varchar(255) NOT NULL,
  `point_2` varchar(255) NOT NULL,
  `point_3` varchar(255) NOT NULL,
  `point_4` varchar(255) NOT NULL,
  `point_5` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`performance_id`),
  UNIQUE KEY `cycle_category` (`cycle_category`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cycle_performance_master`
--

LOCK TABLES `cycle_performance_master` WRITE;
/*!40000 ALTER TABLE `cycle_performance_master` DISABLE KEYS */;
INSERT INTO `cycle_performance_master` VALUES (1,'Gear','Smooth gear engagement','Consistent shifting','No abnormal noise','No slipping under load','Stable speed & torque','2026-02-03 11:32:39','/uploads/cycles/gear.jpg'),(2,'Non-Gear','Smooth cycle','Consistent timing','No abnormal noise','Handles rated load','No leaks / no alarms','2026-02-03 11:32:39','/uploads/cycles/nongear.jpeg'),(3,'Kids','Smooth pedaling','Easy braking','Stable balance','No sharp edges','Proper size fit','2026-02-03 11:32:39','/uploads/cycles/kids.webp'),(4,'Women','Comfortable seating','Easy step-through','Smooth pedaling','Reliable brakes','Stable balance','2026-02-03 11:32:39','/uploads/cycles/woman.webp'),(5,'City','Smooth pedaling','Reliable brakes','Comfortable ride','Easy handling','Road-ready condition','2026-02-03 11:32:39','/uploads/cycles/city.png'),(6,'Electric','Smooth motor assist','Reliable braking','Battery holds charge','Stable ride','No error lights','2026-02-03 11:32:39','/uploads/cycles/electric.png');
/*!40000 ALTER TABLE `cycle_performance_master` ENABLE KEYS */;
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
