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
-- Table structure for table `station`
--

DROP TABLE IF EXISTS `station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `station` (
  `station_id` int NOT NULL AUTO_INCREMENT,
  `station_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `station_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `total_capacity` int NOT NULL,
  `available_cycles` int DEFAULT '0',
  `operating_hours` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `station_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `station_status` enum('Active','Inactive','Under Maintenance') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('Active','Inactive','Under_Maintenance') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`station_id`),
  KEY `idx_station_type` (`station_type`),
  KEY `idx_station_status` (`station_status`),
  KEY `idx_location` (`latitude`,`longitude`),
  CONSTRAINT `station_chk_1` CHECK ((`total_capacity` > 0)),
  CONSTRAINT `station_chk_2` CHECK ((`available_cycles` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station`
--

LOCK TABLES `station` WRITE;
/*!40000 ALTER TABLE `station` DISABLE KEYS */;
INSERT INTO `station` VALUES (1,'Sabarmati Riverfront','Sabarmati Riverfront, Ahmedabad',23.06,72.58,30,8,'6:00 AM - 11:00 PM','079-40001001','Outdoor','Active','2026-02-03 10:46:42','2026-03-19 13:11:18','Active'),(2,'Manek Chowk','Manek Chowk, Old City, Ahmedabad',23.0258,72.5873,25,20,'7:00 AM - 11:00 PM','079-40001002','Outdoor','Active','2026-02-03 10:46:42','2026-03-19 13:15:21','Active'),(3,'Kankaria Lake','Kankaria Lake Front, Ahmedabad',23.007,72.5975,40,14,'6:00 AM - 10:00 PM','079-40001003','Outdoor','Active','2026-02-03 10:46:42','2026-03-03 19:25:17','Active'),(4,'IIM Ahmedabad','IIM Road, Vastrapur, Ahmedabad',23.0339,72.5306,35,8,'6:00 AM - 10:00 PM','079-40001004','Smart Station','Active','2026-02-03 10:46:42','2026-03-01 23:01:30','Active'),(5,'Gujarat University','Gujarat University Area, Navrangpura',23.036,72.545,35,10,'6:00 AM - 10:00 PM','079-40001005','Outdoor','Active','2026-02-03 10:46:42','2026-03-17 06:14:51','Active'),(6,'CG Road','CG Road, Navrangpura, Ahmedabad',23.0309,72.5562,45,15,'24/7','079-40001006','Smart Station','Active','2026-02-03 10:46:42','2026-02-23 11:14:48','Active'),(7,'SG Highway','SG Highway, Ahmedabad',23.0686,72.5315,50,15,'24/7','079-40001007','Smart Station','Active','2026-02-03 10:46:42','2026-02-03 10:55:59','Active'),(8,'Bopal','Bopal Area, Ahmedabad',23.034,72.467,30,9,'6:00 AM - 10:00 PM','079-40001008','Outdoor','Active','2026-02-03 10:46:42','2026-02-26 17:56:03','Active'),(9,'Satellite','Satellite Road, Ahmedabad',23.0276,72.517,40,13,'6:00 AM - 11:00 PM','079-40001009','Kiosk','Active','2026-02-03 10:46:42','2026-03-17 06:14:52','Active'),(10,'Thaltej','Thaltej Area, Ahmedabad',23.05,72.516,35,11,'6:00 AM - 10:00 PM','079-40001010','Outdoor','Active','2026-02-03 10:46:42','2026-02-24 06:49:33','Active'),(11,'Bodakdev','Bodakdev, Ahmedabad',23.0405,72.5115,30,9,'6:00 AM - 10:00 PM','079-40001011','Outdoor','Active','2026-02-03 10:46:42','2026-02-24 06:48:09','Active'),(12,'Vastral','Vastral Road, Ahmedabad',23.01,72.62,25,10,'6:00 AM - 9:00 PM','079-40001012','Outdoor','Active','2026-02-03 10:46:42','2026-02-03 10:56:31','Active'),(13,'Nehru Bridge','Nehru Bridge, Ahmedabad',23.025,72.571,30,10,'24/7','079-40001013','Smart Station','Active','2026-02-03 10:46:42','2026-02-03 10:56:31','Active'),(14,'Railway Station','Ahmedabad Junction Railway Station',23.0225,72.5714,45,16,'24/7','079-40001014','Smart Station','Active','2026-02-03 10:46:42','2026-02-24 07:45:09','Active');
/*!40000 ALTER TABLE `station` ENABLE KEYS */;
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
