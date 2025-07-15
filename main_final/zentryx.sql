-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2025 at 03:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

create database if not exists `zentryx`;
USE `zentryx`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zentryx`
--

-- --------------------------------------------------------

--
-- Table structure for table `administra`
--

CREATE TABLE `administra` (
  `nom_usuario` varchar(20) NOT NULL,
  `id_grupo` int(100) NOT NULL,
  `id_root` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grupo`
--

CREATE TABLE `grupo` (
  `id_grupo` int(100) NOT NULL,
  `nom_usuario` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `habla`
--

CREATE TABLE `habla` (
  `nom_usuario_emisor` varchar(20) NOT NULL,
  `nom_usuario_receptor` varchar(20) NOT NULL,
  `id_juego` int(20) NOT NULL,
  `contenido` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `juega`
--

CREATE TABLE `juega` (
  `nom_usuario` varchar(20) NOT NULL,
  `id_juego` int(20) NOT NULL,
  `puntos` int(50) DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `juego`
--

CREATE TABLE `juego` (
  `id_juego` int(20) NOT NULL,
  `nom_juego` varchar(20) NOT NULL,
  `reglas` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `root`
--

CREATE TABLE `root` (
  `id_root` int(11) NOT NULL,
  `passwd_root` varchar(80) NOT NULL,
  `calle` varchar(20) NOT NULL,
  `num_calle` int(11) NOT NULL,
  `departamento` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `root`
--

INSERT INTO `root` (`id_root`, `passwd_root`, `calle`, `num_calle`, `departamento`) VALUES
(1, '12345678', 'calle', 2, 'Montevideo'),
(2, '12345678', 'calle', 3, 'Montevideo');

-- --------------------------------------------------------

--
-- Table structure for table `root_tel`
--

CREATE TABLE `root_tel` (
  `id_root` int(11) NOT NULL,
  `tel` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `root_tel`
--

INSERT INTO `root_tel` (`id_root`, `tel`) VALUES
(1, 996543),
(2, 99444);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `nom_usuario` varchar(20) NOT NULL,
  `passwd` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administra`
--
ALTER TABLE `administra`
  ADD PRIMARY KEY (`nom_usuario`,`id_grupo`,`id_root`),
  ADD KEY `id_root` (`id_root`),
  ADD KEY `id_grupo` (`id_grupo`);

--
-- Indexes for table `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`id_grupo`,`nom_usuario`),
  ADD KEY `nom_usuario` (`nom_usuario`);

--
-- Indexes for table `habla`
--
ALTER TABLE `habla`
  ADD PRIMARY KEY (`nom_usuario_emisor`,`nom_usuario_receptor`,`id_juego`),
  ADD KEY `nom_usuario_receptor` (`nom_usuario_receptor`),
  ADD KEY `id_juego` (`id_juego`);

--
-- Indexes for table `juega`
--
ALTER TABLE `juega`
  ADD PRIMARY KEY (`id_juego`,`nom_usuario`),
  ADD KEY `nom_usuario` (`nom_usuario`);

--
-- Indexes for table `juego`
--
ALTER TABLE `juego`
  ADD PRIMARY KEY (`id_juego`);

--
-- Indexes for table `root`
--
ALTER TABLE `root`
  ADD PRIMARY KEY (`id_root`);

--
-- Indexes for table `root_tel`
--
ALTER TABLE `root_tel`
  ADD PRIMARY KEY (`id_root`,`tel`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`nom_usuario`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `administra`
--
ALTER TABLE `administra`
  ADD CONSTRAINT `administra_ibfk_1` FOREIGN KEY (`id_root`) REFERENCES `root` (`id_root`),
  ADD CONSTRAINT `administra_ibfk_2` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  ADD CONSTRAINT `administra_ibfk_3` FOREIGN KEY (`nom_usuario`) REFERENCES `usuarios` (`nom_usuario`);

--
-- Constraints for table `grupo`
--
ALTER TABLE `grupo`
  ADD CONSTRAINT `grupo_ibfk_1` FOREIGN KEY (`nom_usuario`) REFERENCES `usuarios` (`nom_usuario`);

--
-- Constraints for table `habla`
--
ALTER TABLE `habla`
  ADD CONSTRAINT `habla_ibfk_1` FOREIGN KEY (`nom_usuario_emisor`) REFERENCES `usuarios` (`nom_usuario`),
  ADD CONSTRAINT `habla_ibfk_2` FOREIGN KEY (`nom_usuario_receptor`) REFERENCES `usuarios` (`nom_usuario`),
  ADD CONSTRAINT `habla_ibfk_3` FOREIGN KEY (`id_juego`) REFERENCES `juego` (`id_juego`);

--
-- Constraints for table `juega`
--
ALTER TABLE `juega`
  ADD CONSTRAINT `juega_ibfk_1` FOREIGN KEY (`nom_usuario`) REFERENCES `usuarios` (`nom_usuario`),
  ADD CONSTRAINT `juega_ibfk_2` FOREIGN KEY (`id_juego`) REFERENCES `juego` (`id_juego`);

--
-- Constraints for table `root_tel`
--
ALTER TABLE `root_tel`
  ADD CONSTRAINT `root_tel_ibfk_1` FOREIGN KEY (`id_root`) REFERENCES `root` (`id_root`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
