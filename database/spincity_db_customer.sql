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
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_age` int DEFAULT NULL,
  `customer_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_proof_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_proof_document` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_date` date NOT NULL DEFAULT (curdate()),
  `membership_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'hourly',
  `wallet_balance` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emergency_contact` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favorite_food` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favorite_sport` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notifications_enabled` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `customer_email` (`customer_email`),
  UNIQUE KEY `customer_phone` (`customer_phone`),
  KEY `idx_customer_email` (`customer_email`),
  KEY `idx_customer_phone` (`customer_phone`),
  KEY `idx_membership_type` (`membership_type`),
  CONSTRAINT `customer_chk_1` CHECK (((`customer_age` >= 18) and (`customer_age` <= 100))),
  CONSTRAINT `customer_chk_2` CHECK ((`wallet_balance` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (2,'Priya Sharma',24,'456 SG Highway, Ahmedabad, Gujarat','priya.sharma@email.com','9876543211','Driving License',NULL,'2024-02-20','Annual',1200,'2026-01-12 07:02:45','2026-03-12 09:00:43','',NULL,NULL,NULL,NULL,0),(3,'Amit Patel',32,'789 Satellite Road, Ahmedabad, Gujarat','amit.patel@email.com','9876543212','PAN Card',NULL,'2024-03-10','Weekly',250,'2026-01-12 07:02:45','2026-03-12 09:00:43','',NULL,NULL,NULL,NULL,0),(4,'Neha Desai',26,'321 Navrangpura, Ahmedabad, Gujarat','neha.desai@email.com','9876543213','Voter ID',NULL,'2024-04-05','Daily',95,'2026-01-12 07:02:45','2026-03-12 09:00:43','',NULL,NULL,NULL,NULL,0),(5,'Karan Shah',30,'654 Vastrapur, Ahmedabad, Gujarat','karan.shah@email.com','9876543214','Passport',NULL,'2024-05-12','None',0,'2026-01-12 07:02:45','2026-03-12 09:00:43','',NULL,NULL,NULL,NULL,0),(10,'tisha prajapati',50,'gotri, vadodara, gujarat - 390021','dkp_dkp2000@yahoo.com','+919426570299','Aadhar_Card',NULL,'2026-01-22','hourly',500,'2026-01-22 16:38:32','2026-03-12 09:00:43','1111','4444466666','tisha Prajapati',NULL,NULL,0),(20,'Tisha Prajapati',21,'kalali, vadodara, gujarat - 390012','test@example.com','9999599999',NULL,NULL,'2026-02-03','hourly',0,'2026-02-03 06:42:12','2026-03-12 09:00:43','test123','9999888877','dk prajapati',NULL,NULL,0),(21,'tisha dharmnedra prajapati',21,'kalali, vadodara, gujarat - 390012','tk502@gmail.com','5555666678',NULL,NULL,'2026-02-03','hourly',0,'2026-02-03 06:43:33','2026-03-12 09:00:43','4444','2223334445','dharmendra prajapati',NULL,NULL,0),(24,'kirtida prajapati',48,'kalali, vadodara, gujarat - 390012','anjalidp200@gmail.com','7574078587','Driving License',NULL,'2026-02-05','hourly',0,'2026-02-05 09:26:36','2026-03-12 09:00:43','1111','9429766948','tisha','panipuri','badminton',0),(25,'dharmendra prajapati',21,'kalali, vadodara, gujarat - 390012','tprajapati502@gmail.com','+919429766948',NULL,'/uploads/idproofs/Tisha_Prajapati.pdf','2026-02-09','hourly',0,'2026-02-09 10:29:58','2026-03-11 09:12:04','$2a$10$byS5nLmQSDwBb9tXtlOTxOi/1HGQH7xsNS4WMkVDTGvVViO2RM6MW','2223334445','dharmendra prajapati','panipuri','badminton',1),(26,'ghanshyam pandey',38,'kalali, vadodara, gujarat - 390012','ghanshyamp@gmail.com','7777888898','Driving License',NULL,'2026-02-10','hourly',0,'2026-02-10 08:33:40','2026-03-12 09:00:43','$2a$10$w93ZfYQFXtWbpWvr9KGzQOH05ZOQUa0u2ipSDFXoJu9pQnucUMF6S','2223334445','dharmendra prajapati','panipuri','badminton',0),(27,'Dharmendra Prajapati',26,'123 Main Street, Ahmedabad, Gujarat - 380015','test123@gmail.com','9426571299','Aadhar','/uploads/idproofs/1234567890_aadhar.jpg','2026-02-23','BASIC',0,'2026-02-23 18:01:32','2026-03-12 09:00:43','$2a$10$mktUTXG6vS37.Rz6Kggnd.NL7jLDy4vgkjPZAmSv9/DXIJdUsZ2q2','9426570298','Parent Name',NULL,NULL,0),(28,'Anjali Prajapati',38,'kalali, vadodara, gujarat - 390012','anjalidp2001@gmail.com','7574076564','Aadhar','/uploads/idproofs/1771872282129_WhatsApp_Image_2026-02-22_at_1.12.44_AM.jpeg','2026-02-24','BASIC',0,'2026-02-23 18:45:11','2026-03-12 09:00:43','$2a$10$LHGfqR4N8NIkMI1p9pmnfOcwuGvNtiZ/6Z7sTGrwYY919MAiSL0cC','2223334445','dharmendra prajapati','panipuri','badminton',0);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
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
