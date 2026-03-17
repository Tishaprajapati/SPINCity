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
-- Table structure for table `rental_transaction`
--

DROP TABLE IF EXISTS `rental_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_transaction` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `cycle_id` int NOT NULL,
  `rental_start_time` datetime NOT NULL,
  `rental_end_time` datetime DEFAULT NULL,
  `pickup_station_id` int NOT NULL,
  `return_station_id` int DEFAULT NULL,
  `rental_duration` int DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rental_status` enum('Pending','Active','Completed','Cancelled') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deposit_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'NOT_PAID',
  `approved_by_emp_id` int DEFAULT NULL,
  `approval_status` enum('Pending','Approved','Rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `approval_time` datetime DEFAULT NULL,
  `deposit_amount` decimal(10,2) DEFAULT NULL,
  `end_requested` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`transaction_id`),
  KEY `pickup_station_id` (`pickup_station_id`),
  KEY `return_station_id` (`return_station_id`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_cycle` (`cycle_id`),
  KEY `idx_rental_status` (`rental_status`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `approved_by_emp_id` (`approved_by_emp_id`),
  CONSTRAINT `rental_transaction_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rental_transaction_ibfk_2` FOREIGN KEY (`cycle_id`) REFERENCES `cycle` (`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rental_transaction_ibfk_3` FOREIGN KEY (`pickup_station_id`) REFERENCES `station` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rental_transaction_ibfk_4` FOREIGN KEY (`return_station_id`) REFERENCES `station` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rental_transaction_ibfk_5` FOREIGN KEY (`approved_by_emp_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_transaction`
--

LOCK TABLES `rental_transaction` WRITE;
/*!40000 ALTER TABLE `rental_transaction` DISABLE KEYS */;
INSERT INTO `rental_transaction` VALUES (6,25,117,'2026-02-23 00:47:20','2026-02-26 23:14:15',4,3,5666,945,'Pending','Completed','2026-02-22 19:17:20','2026-02-22 21:11:19','NOT_PAID',1,'Approved','2026-02-26 16:17:42',NULL,0),(7,25,148,'2026-02-23 02:06:07','2026-02-23 02:42:57',5,5,36,0,'Pending','Completed','2026-02-22 20:36:07','2026-02-22 21:12:57','NOT_PAID',NULL,'Pending',NULL,NULL,0),(8,25,82,'2026-02-23 02:43:59','2026-02-23 02:45:30',9,9,1,5,'Pending','Completed','2026-02-22 21:13:59','2026-02-22 21:13:59','NOT_PAID',NULL,'Pending',NULL,NULL,0),(9,25,145,'2026-02-23 12:02:02','2026-02-23 12:04:00',11,11,1,5,'Pending','Completed','2026-02-23 06:32:02','2026-02-23 06:32:02','NOT_PAID',NULL,'Pending',NULL,NULL,0),(10,25,125,'2026-02-23 12:08:40','2026-02-23 12:12:19',4,4,3,5,'Pending','Completed','2026-02-23 06:38:40','2026-02-23 06:38:40','NOT_PAID',NULL,'Pending',NULL,NULL,0),(11,25,173,'2026-02-23 12:24:30','2026-02-23 12:27:45',4,4,3,5,'Pending','Completed','2026-02-23 06:54:30','2026-02-23 06:54:30','NOT_PAID',NULL,'Pending',NULL,NULL,0),(12,25,149,'2026-02-23 12:34:15','2026-02-23 12:45:43',4,4,11,5,'Pending','Completed','2026-02-23 07:04:15','2026-02-23 07:04:15','NOT_PAID',NULL,'Pending',NULL,NULL,0),(13,25,133,'2026-02-23 12:46:50','2026-02-23 12:51:49',4,4,4,5,'Pending','Completed','2026-02-23 07:16:50','2026-02-23 07:21:26','NOT_PAID',NULL,'Pending',NULL,NULL,0),(14,25,149,'2026-02-23 12:57:34','2026-02-23 13:03:20',4,4,5,5,'Pending','Completed','2026-02-23 07:27:34','2026-02-23 07:27:34','NOT_PAID',NULL,'Pending',NULL,NULL,0),(15,25,101,'2026-02-23 13:04:06','2026-02-23 13:12:06',4,4,7,5,'Pending','Completed','2026-02-23 07:34:06','2026-02-23 07:34:06','NOT_PAID',NULL,'Pending',NULL,NULL,0),(16,25,101,'2026-02-23 16:06:20','2026-02-23 16:28:36',4,4,22,5,'Pending','Completed','2026-02-23 10:36:20','2026-02-23 10:36:20','NOT_PAID',NULL,'Pending',NULL,NULL,0),(17,25,3,'2026-02-23 16:40:19','2026-02-23 16:44:49',6,6,4,40,'Pending','Completed','2026-02-23 11:10:19','2026-02-23 11:10:19','NOT_PAID',NULL,'Pending',NULL,NULL,0),(18,25,149,'2026-02-23 22:16:38','2026-02-23 22:25:27',4,4,8,5,'Pending','Completed','2026-02-23 16:46:38','2026-02-23 16:46:38','NOT_PAID',NULL,'Pending',NULL,NULL,0),(19,25,113,'2026-02-24 12:18:08','2026-02-24 12:19:33',11,10,1,5,'Pending','Completed','2026-02-24 06:48:08','2026-02-24 06:48:08','NOT_PAID',NULL,'Pending',NULL,NULL,0),(20,25,173,'2026-02-24 12:34:39','2026-02-24 12:35:44',4,5,1,5,'Pending','Completed','2026-02-24 07:04:39','2026-02-24 07:04:39','NOT_PAID',NULL,'Pending',NULL,NULL,0),(21,25,28,'2026-02-24 13:14:53','2026-03-04 00:55:17',1,3,10780,1800,'Pending','Completed','2026-02-24 07:44:53','2026-02-24 07:44:53','NOT_PAID',2,'Approved','2026-03-02 23:22:06',NULL,0),(22,25,85,'2026-02-24 14:20:26','2026-02-24 14:21:06',3,3,0,0,'Success','Completed','2026-02-24 08:50:26','2026-02-24 08:50:26','NOT_PAID',NULL,'Pending',NULL,NULL,0),(23,25,102,'2026-02-25 02:18:28','2026-02-25 02:19:29',2,2,1,0,'Paid','Completed','2026-02-24 20:48:28','2026-02-24 20:48:28','NOT_PAID',NULL,'Pending',NULL,NULL,0),(24,25,99,'2026-02-26 23:26:03','2026-02-26 23:27:25',8,5,1,0,'Success','Completed','2026-02-26 17:56:03','2026-02-26 17:56:03','NOT_PAID',NULL,'Pending',NULL,NULL,0),(25,25,141,'2026-03-02 04:30:50','2026-03-02 04:31:30',4,4,0,0,'Success','Completed','2026-03-01 23:00:50','2026-03-01 23:00:50','RETURNED',NULL,'Pending',NULL,NULL,0),(26,25,148,'2026-03-05 00:14:40','2026-03-05 00:16:24',5,5,1,0,'Success','Completed','2026-03-04 18:44:40','2026-03-04 18:44:40','NOT_PAID',NULL,'Pending',NULL,NULL,0),(27,25,56,'2026-03-05 13:14:48','2026-03-05 13:18:08',1,1,3,0,'Success','Completed','2026-03-05 07:44:48','2026-03-05 07:44:48','RETURNED',2,'Approved','2026-03-05 13:16:00',NULL,0),(28,25,44,'2026-03-05 16:17:16','2026-03-05 16:22:14',1,1,4,0,'Success','Completed','2026-03-05 10:47:16','2026-03-05 10:47:16','RETURNED',2,'Rejected','2026-03-05 16:23:32',NULL,0),(29,25,4,'2026-03-05 16:28:17','2026-03-05 16:43:03',1,1,14,0,'Success','Completed','2026-03-05 10:58:17','2026-03-05 10:58:17','COLLECTED',2,'Approved','2026-03-05 16:28:57',NULL,0),(30,25,40,'2026-03-09 23:29:07','2026-03-10 00:15:03',1,1,NULL,31.5,'Pending','Completed','2026-03-09 17:59:08','2026-03-09 17:59:08','COLLECTED',2,'Approved','2026-03-09 23:39:14',NULL,0),(31,25,4,'2026-03-10 12:38:31','2026-03-10 12:42:23',1,1,NULL,35,'Pending','Completed','2026-03-10 07:08:31','2026-03-10 07:08:31','NOT_PAID',2,'Rejected','2026-03-10 23:31:29',NULL,0),(32,25,20,'2026-03-10 12:43:43','2026-03-10 12:44:34',1,1,NULL,35,'Pending','Completed','2026-03-10 07:13:43','2026-03-10 07:13:43','NOT_PAID',2,'Rejected','2026-03-10 23:31:31',NULL,0),(33,25,4,'2026-03-10 14:04:41','2026-03-10 14:37:03',1,1,NULL,35,'Pending','Completed','2026-03-10 08:34:41','2026-03-10 08:34:41','NOT_PAID',2,'Rejected','2026-03-10 23:31:15',NULL,0),(34,25,4,'2026-03-10 16:41:58','2026-03-10 16:59:15',1,2,6,0,'Paid','Completed','2026-03-10 11:11:58','2026-03-10 11:11:58','RETURNED',1,'Approved','2026-03-10 16:46:50',NULL,0),(35,25,8,'2026-03-10 23:33:38','2026-03-10 23:49:12',1,1,15,0,'Paid','Pending','2026-03-10 18:03:38','2026-03-10 18:03:38','RETURNED',2,'Approved','2026-03-10 23:36:53',NULL,0),(36,25,56,'2026-03-11 00:17:12','2026-03-11 00:18:11',1,1,0,0,'Paid','Pending','2026-03-10 18:47:12','2026-03-10 18:47:12','RETURNED',2,'Approved','2026-03-11 00:17:33',NULL,0),(37,25,60,'2026-03-11 00:47:16','2026-03-11 01:01:37',1,1,14,0,'Paid','Pending','2026-03-10 19:17:16','2026-03-10 19:17:16','RETURNED',2,'Approved','2026-03-11 01:01:20',NULL,0),(38,25,8,'2026-03-11 11:40:05','2026-03-11 11:46:44',1,1,4,0,'Paid','Completed','2026-03-11 06:10:05','2026-03-11 06:10:05','FORFEITED',2,'Approved','2026-03-11 11:44:03',NULL,0),(39,25,12,'2026-03-11 12:02:15','2026-03-11 12:03:25',1,1,0,0,'Paid','Completed','2026-03-11 06:32:15','2026-03-11 06:32:15','RETURNED',2,'Approved','2026-03-11 12:02:36',NULL,0),(40,25,8,'2026-03-11 12:04:59','2026-03-11 12:11:46',1,2,1,0,'Paid','Completed','2026-03-11 06:34:59','2026-03-11 06:34:59','RETURNED',2,'Approved','2026-03-11 12:05:14',NULL,0),(41,25,36,'2026-03-11 12:16:25','2026-03-11 12:18:54',1,2,2,0,'Paid','Completed','2026-03-11 06:46:25','2026-03-11 06:46:25','RETURNED',2,'Approved','2026-03-11 12:17:01',NULL,0),(42,25,44,'2026-03-12 12:58:13','2026-03-12 13:00:01',1,2,1,45,'Pending','Completed','2026-03-12 07:28:13','2026-03-12 07:28:13','RETURNED',2,'Approved','2026-03-12 12:58:58',NULL,0);
/*!40000 ALTER TABLE `rental_transaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-17 10:10:24
