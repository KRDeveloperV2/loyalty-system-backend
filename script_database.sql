/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 8.0.39 : Database - loyaltysystem
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`loyaltysystem` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `loyaltysystem`;

/*Table structure for table `admins` */

DROP TABLE IF EXISTS `admins`;

CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `store_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `admins` */

insert  into `admins`(`id`,`first_name`,`last_name`,`email`,`password`,`created_at`,`store_name`) values 
(3,'Whan','KR','admin@gmail.com','$2a$10$EOMBKI7xJrq2yN6EgNqLvel8di7BBjSyYGfgksd7ML2ElBVXwQFni','2024-11-03 12:26:03','ร้านน้ำหวาน'),
(4,'น้องหมี','แบร์','admin2@gmail.com','$2a$10$oFf/FhamhhFko4bljXzDieydfOmkIKVCAcN/ybsXaRyYLEy2xrRhi','2024-11-09 11:27:48','ร้านชานมหมี'),
(5,'หมูกระทะ','อู๊ดๆ ','admin3@gmail.com','$2a$10$geuVDvnyIjSerKm.Cqp3GOodbz7WZHfa1otTCpe5CEnxHxKTTk4pW','2024-11-09 19:50:15','ร้านหมูกระทะ'),
(6,'น้องหนู','หมูกระทะ','admin4@gmail.com','$2a$10$FvFUeWhE5gsVR6ORW4JwjOWCw3LHDjClF9C1RTeFS8cjvy8ZdkHv2','2024-11-10 09:58:32','น้องหนูหมูกระทะ');

/*Table structure for table `otp` */

DROP TABLE IF EXISTS `otp`;

CREATE TABLE `otp` (
  `otp_id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`otp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `otp` */

insert  into `otp`(`otp_id`,`phone`,`otp_code`,`created_at`,`expires_at`,`is_verified`) values 
(1,'0859754852','832829','2024-11-03 13:04:29','2024-11-03 13:09:29',0),
(2,'0859754852','549297','2024-11-03 13:12:01','2024-11-03 13:17:02',1),
(3,'0859754852','650018','2024-11-03 13:13:08','2024-11-03 13:18:09',1),
(4,'0859754852','744238','2024-11-03 13:14:19','2024-11-03 13:19:20',1),
(5,'0859754852','864819','2024-11-03 13:32:55','2024-11-03 13:37:56',1),
(6,'0859754852','569237','2024-11-03 13:35:30','2024-11-03 13:40:31',1),
(7,'0865347169','624826','2024-11-05 20:47:38','2024-11-05 20:52:38',1),
(8,'1111111111','722231','2024-11-06 05:36:40','2024-11-06 05:41:40',1),
(9,'2222222222','607851','2024-11-06 21:30:45','2024-11-06 21:35:46',1),
(10,'11111111111','303887','2024-11-09 15:34:39','2024-11-09 15:39:39',0),
(11,'1111111111','357548','2024-11-09 15:43:54','2024-11-09 15:48:55',0),
(12,'1111111111','756445','2024-11-09 15:44:29','2024-11-09 15:49:30',0),
(13,'1111111111','494602','2024-11-09 15:49:19','2024-11-09 15:54:19',0),
(14,'3333333333','530164','2024-11-09 15:49:44','2024-11-09 15:54:45',0),
(15,'3333333333','571567','2024-11-09 15:52:16','2024-11-09 15:57:17',1),
(16,'3333333333','455182','2024-11-09 16:00:43','2024-11-09 16:05:43',1),
(17,'3333333333','550347','2024-11-09 16:24:08','2024-11-09 16:29:08',1),
(18,'4444444444','413619','2024-11-09 19:52:21','2024-11-09 19:57:21',1),
(19,'5555555555','603927','2024-11-10 10:02:01','2024-11-10 10:07:02',1);

/*Table structure for table `reward_redeems` */

DROP TABLE IF EXISTS `reward_redeems`;

CREATE TABLE `reward_redeems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `reward_id` int NOT NULL,
  `redeemed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `reward_redeems` */

insert  into `reward_redeems`(`id`,`user_id`,`reward_id`,`redeemed_at`,`is_used`) values 
(37,9,1,'2024-11-09 17:21:35',1),
(38,8,4,'2024-11-09 19:56:12',1),
(39,9,2,'2024-11-09 21:03:09',0),
(40,14,3,'2024-11-10 10:03:41',1);

/*Table structure for table `rewards` */

DROP TABLE IF EXISTS `rewards`;

CREATE TABLE `rewards` (
  `reward_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `points_required` int NOT NULL,
  `redeemed_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`reward_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `rewards` */

insert  into `rewards`(`reward_id`,`name`,`description`,`image_url`,`points_required`,`redeemed_count`,`created_at`,`updated_at`,`status`) values 
(1,'ชานม','ชานม','https://image.bangkokbiznews.com/uploads/images/contents/w1024/2023/05/3nAm6iSJIUgWmuwzJCQC.webp?x-image-process=style/lg-webp',10,1,'2024-11-03 19:03:19','2024-11-09 17:21:35',1),
(2,'ชาเย็น','ชาเย็น','https://p16-sign-sg.lemon8cdn.com/tos-alisg-v-a3e477-sg/o0tAqBaBElAIeApmXiQFEqDLECof6AruCgDK9T~tplv-sdweummd6v-shrink:640:0:q50.webp?lk3s=66c60501&source=seo_middle_feed_list&x-expires=1762192800&x-signature=6GzWRAm4iDjuRP2BACO2VJ7EC9o%3D',10,1,'2024-11-03 19:39:38','2024-11-09 21:03:09',1),
(3,'ชาเขียว','ชาเขียว','https://static.wixstatic.com/media/6bae2b_cd0282a3e45e4df483ce484ca4c4a2d0~mv2.png/v1/fill/w_720,h_720,al_c,q_90,enc_auto/6bae2b_cd0282a3e45e4df483ce484ca4c4a2d0~mv2.png',10,1,'2024-11-03 19:40:24','2024-11-10 10:03:41',1),
(4,'ไอศกรีมมหาชัย','ไอศกรีมมหาชัย','https://kaikang.itupz.com/wp-content/uploads/2023/08/cropped-S__4169771.jpg',10,1,'2024-11-03 19:43:05','2024-11-09 19:56:12',1),
(5,'หูฟังบูธทูธ','หูฟังบูธทูธ','https://f.btwcdn.com/store-49566/product/1e4d63aa-80ea-ef60-3416-64a691b853a4.jpg',100,0,'2024-11-03 19:44:18','2024-11-03 20:08:31',1),
(6,'xx','xx','https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',10,0,'2024-11-06 21:32:39','2024-11-09 20:40:43',0),
(7,'ชาเขียว เย็นใจ','ชาเขียว','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0c90RzsjXVvO9nnc7-pq3Db9FoIFFY-c2bA&s',20,0,'2024-11-09 19:58:20','2024-11-09 19:58:20',1),
(8,'ไอติมหมูกระทะ','หมูกระทะ','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhnATL6M13fEJehDYCPsHEIAdKewxdv2a8IA&s',100,0,'2024-11-10 10:00:17','2024-11-10 10:00:17',1);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) NOT NULL,
  `pin_code` varchar(60) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `phone_UNIQUE` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user` */

insert  into `user`(`user_id`,`name`,`phone`,`pin_code`,`created_at`) values 
(8,'น้องหนึ่ง','1111111111','$2a$10$EFHeo37BlHqONWHV/TMfsen/SDxz53xqhGxSjHQ5duJFnNo6NYHQq','2024-11-06 05:36:48'),
(9,'น้องสอง','2222222222','$2a$10$81KVucOEDsjNF8b.GZgc7OxdjMJfUB/IbdhZBypMlop7cmor5e4nS','2024-11-06 21:30:54'),
(12,'น้องสาม','3333333333','$2a$10$xgtOtjnT/OyxspwpCZZ6/uV4r/k/qVHf.j08f98Z6EtJRpCI72wcK','2024-11-09 16:24:21'),
(13,'น้องสี่','4444444444','$2a$10$ITXjAs0cdaWDGg9nc4kZD.SZX4Vb7wNiUkGqENf.M6hRP5IMru4cu','2024-11-09 19:52:34'),
(14,'น้องห้า','5555555555','$2a$10$/xqdNG9O/SbBYxI0yzf9ZeWUjRXb0N/6CJ.JPEl3z/rdIBlA6YtIq','2024-11-10 10:02:18');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
