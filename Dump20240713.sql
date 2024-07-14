-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: agua
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `tbl_mediciones`
--

DROP TABLE IF EXISTS `tbl_mediciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_mediciones` (
  `id_medicion` bigint NOT NULL AUTO_INCREMENT,
  `valor` decimal(20,6) NOT NULL DEFAULT (0),
  `id_sensor` int NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id_medicion`),
  KEY `FK_tbl_mediciones_tbl_sensores` (`id_sensor`),
  CONSTRAINT `FK_tbl_mediciones_tbl_sensores` FOREIGN KEY (`id_sensor`) REFERENCES `tbl_sensores` (`id_sen`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_mediciones`
--

LOCK TABLES `tbl_mediciones` WRITE;
/*!40000 ALTER TABLE `tbl_mediciones` DISABLE KEYS */;
INSERT INTO `tbl_mediciones` VALUES (1,500.000000,2,'2024-07-10 00:51:33'),(2,500.000000,2,'2024-07-09 00:51:33'),(3,500.000000,3,'2024-07-11 14:51:33'),(4,500.000000,3,'2024-07-12 14:51:33'),(5,1000.000000,3,'2024-07-12 14:51:33'),(6,300.000000,2,'2024-07-12 20:15:12'),(7,200.000000,2,'2024-07-12 20:30:47');
/*!40000 ALTER TABLE `tbl_mediciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_sensores`
--

DROP TABLE IF EXISTS `tbl_sensores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_sensores` (
  `id_sen` int NOT NULL AUTO_INCREMENT,
  `tipo_sen` char(50) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL DEFAULT '0',
  `descripcion_sen` varchar(50) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL DEFAULT '0',
  `nombre_sen` varchar(50) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL DEFAULT '0',
  `codigo_sen` varchar(50) CHARACTER SET armscii8 COLLATE armscii8_bin DEFAULT NULL,
  `estado_sen` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_sen`) USING BTREE,
  KEY `FK_tbl_sensores_tbl_usuario` (`id_usuario`),
  CONSTRAINT `FK_tbl_sensores_tbl_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_sensores`
--

LOCK TABLES `tbl_sensores` WRITE;
/*!40000 ALTER TABLE `tbl_sensores` DISABLE KEYS */;
INSERT INTO `tbl_sensores` VALUES (1,'1','llave cocina','cocina','12455225',1,1),(2,'2','madidor cocina','valvula cocina','12455225',1,1),(3,'2','madidor sala','llave patio','12455225',1,1);
/*!40000 ALTER TABLE `tbl_sensores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_usuario`
--

DROP TABLE IF EXISTS `tbl_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(120) COLLATE armscii8_bin NOT NULL DEFAULT '0',
  `contraseña_usuario` varchar(120) COLLATE armscii8_bin NOT NULL DEFAULT '0',
  `codigo_placa` char(50) COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_usuario`
--

LOCK TABLES `tbl_usuario` WRITE;
/*!40000 ALTER TABLE `tbl_usuario` DISABLE KEYS */;
INSERT INTO `tbl_usuario` VALUES (1,'david','elrisas','8nUwgoGMLPtcS6ucNCBCGxqRT5a51bp97X5999ZeRJLDHleHoO');
/*!40000 ALTER TABLE `tbl_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'agua'
--

--
-- Dumping routines for database 'agua'
--
/*!50003 DROP PROCEDURE IF EXISTS `getWeekdataUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getWeekdataUser`(
	IN `nomUser` VARCHAR(150)
)
BEGIN
SELECT
    dia.dia_semana,
    COALESCE(SUM(m.valor), 0) AS consumo_diario
FROM (
    SELECT 'Monday' AS dia_semana
    UNION SELECT 'Tuesday'
    UNION SELECT 'Wednesday'
    UNION SELECT 'Thursday'
    UNION SELECT 'Friday'
    UNION SELECT 'Saturday'
    UNION SELECT 'Sunday'
) AS dia
LEFT JOIN tbl_mediciones m ON dia.dia_semana = DAYNAME(m.fecha_hora)
JOIN tbl_sensores s ON m.id_sensor = s.id_sen
JOIN tbl_usuario u ON s.id_usuario = u.id_usuario AND u.nombre_usuario = nomUser
WHERE
    YEARWEEK(m.fecha_hora, 1) = YEARWEEK(CURDATE(), 1)  -- Consumo de la semana actual
GROUP BY
    dia.dia_semana
ORDER BY
    FIELD(dia.dia_semana, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-13 14:35:25
