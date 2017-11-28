-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 28. Nov 2017 um 14:09
-- Server Version: 5.5.53-0+deb8u1
-- PHP-Version: 5.6.29-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `production-control-release`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `character-costumes`
--

CREATE TABLE IF NOT EXISTS `character-costumes` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `character` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=544 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `character-costumes`
--

INSERT INTO `character-costumes` (`id`, `name`, `character`) VALUES
(1, 'default', 1),
(2, 'default', 2),
(3, 'default', 3),
(4, 'red', 1),
(5, 'green', 1),
(6, 'blue', 1),
(7, 'green', 2),
(8, 'blue', 2),
(9, 'red', 2),
(10, 'white', 3),
(11, 'blue', 3),
(12, 'green', 3),
(13, 'yellow', 3),
(14, 'default', 4),
(15, 'default', 5),
(16, 'default', 6),
(17, 'default', 7),
(18, 'default', 8),
(19, 'default', 9),
(20, 'default', 10),
(21, 'default', 11),
(22, 'default', 12),
(23, 'default', 13),
(24, 'default', 14),
(25, 'default', 15),
(26, 'default', 16),
(27, 'default', 17),
(28, 'default', 18),
(29, 'default', 19),
(30, 'default', 20),
(31, 'default', 21),
(32, 'default', 22),
(33, 'default', 23),
(34, 'default', 24),
(35, 'default', 25),
(36, 'default', 26),
(37, 'black', 4),
(38, 'blue', 4),
(39, 'green', 4),
(40, 'pink', 4),
(41, 'red', 4),
(42, 'black', 23),
(43, 'blue', 23),
(44, 'green', 23),
(45, 'red', 23),
(46, 'default', 27),
(47, 'default', 28),
(48, 'default', 29),
(49, 'default', 30),
(50, 'default', 31),
(51, 'default', 32),
(52, 'default', 33),
(53, 'yellow', 33),
(54, 'red', 33),
(55, 'white', 33),
(56, 'original', 33),
(57, 'green', 33),
(58, 'pink', 33),
(59, 'blue', 33),
(60, 'default', 34),
(61, 'black', 34),
(62, 'yellow', 34),
(63, 'green', 34),
(64, 'grey', 34),
(65, 'orange', 34),
(66, 'red', 34),
(67, 'blue', 34),
(68, 'default', 35),
(69, 'larry', 35),
(70, 'roy', 35),
(71, 'wendy', 35),
(72, 'iggy', 35),
(73, 'morton', 35),
(74, 'lemmy', 35),
(75, 'ludwig', 35),
(76, 'black', 29),
(77, 'red', 29),
(78, 'green', 29),
(79, 'blue', 29),
(80, 'white', 29),
(81, 'yellow', 29),
(82, 'cyan', 29),
(83, 'default', 36),
(84, 'red', 36),
(85, 'green', 36),
(86, 'pink', 36),
(87, 'yellow', 36),
(88, 'white', 36),
(89, 'blue', 36),
(90, 'purple', 36),
(91, 'default', 37),
(92, 'adventblack', 37),
(93, 'blue', 37),
(94, 'adventblue', 37),
(95, 'red', 37),
(96, 'adventteal', 37),
(97, 'black', 37),
(98, 'adventpurple', 37),
(99, 'default', 38),
(100, 'female', 38),
(101, 'red', 38),
(102, 'orange', 38),
(103, 'blue', 38),
(104, 'pink', 38),
(105, 'green', 38),
(106, 'black', 38),
(107, 'white', 27),
(108, 'blue', 27),
(109, 'yellow', 27),
(110, 'black', 27),
(111, 'green', 27),
(112, 'striped', 27),
(113, 'purple', 27),
(114, 'yellow', 28),
(115, 'red', 28),
(116, 'blue', 28),
(117, 'green', 28),
(118, 'white', 28),
(119, 'fire', 28),
(120, 'black', 28),
(121, 'yellow', 30),
(122, 'blue', 30),
(123, 'red', 30),
(124, 'green', 30),
(125, 'white', 30),
(126, 'orange', 30),
(127, 'black', 30),
(128, 'red', 31),
(135, 'white', 31),
(136, 'grey', 31),
(137, 'teal', 31),
(138, 'navy', 31),
(139, 'green', 31),
(140, 'purple', 31),
(141, 'orange', 32),
(142, 'pink', 32),
(143, 'cyan', 32),
(144, 'white', 32),
(145, 'purple', 32),
(146, 'blue', 32),
(147, 'yellow', 32),
(148, 'default', 39),
(149, 'default', 40),
(150, 'green', 40),
(151, 'brown', 40),
(152, 'yellow', 40),
(153, 'red', 40),
(154, 'blue', 40),
(155, 'white', 40),
(156, 'purple', 40),
(157, 'default', 41),
(158, 'white', 41),
(159, 'pink', 41),
(160, 'purple', 41),
(161, 'green', 41),
(162, 'blue', 41),
(163, 'yellow', 41),
(164, 'cyan', 41),
(165, 'default', 42),
(166, 'black', 42),
(167, 'red', 42),
(168, 'blue', 42),
(169, 'green', 42),
(170, 'white', 42),
(171, 'yellow', 42),
(172, 'pink', 42),
(173, 'default', 43),
(174, 'red', 43),
(175, 'blue', 43),
(176, 'green', 43),
(177, 'black', 43),
(178, 'yellow', 43),
(179, 'purple', 43),
(180, 'pink', 43),
(181, 'default', 44),
(182, 'black', 44),
(183, 'blue', 44),
(184, 'brown', 44),
(185, 'white', 44),
(186, 'tan', 44),
(187, 'yellow', 44),
(188, 'red', 44),
(189, 'default', 45),
(190, 'orange', 45),
(191, 'blue', 45),
(192, 'red', 45),
(193, 'green', 45),
(194, 'black', 45),
(195, 'white', 45),
(196, 'pink', 45),
(197, 'default', 46),
(198, 'black', 46),
(199, 'red', 46),
(200, 'green', 46),
(201, 'orange', 46),
(202, 'white', 46),
(203, 'yellow', 46),
(204, 'purple', 46),
(205, 'default', 47),
(206, 'white', 47),
(207, 'purple', 47),
(208, 'green', 47),
(209, 'red', 47),
(210, 'yellow', 47),
(211, 'grey', 47),
(212, 'blue', 47),
(213, 'default', 48),
(214, 'red', 48),
(215, 'pink', 48),
(216, 'black', 48),
(217, 'lavender', 48),
(218, 'green', 48),
(219, 'grey', 48),
(220, 'purple', 48),
(221, 'default', 49),
(222, 'yellow', 49),
(223, 'red', 49),
(224, 'blue', 49),
(225, 'green', 49),
(226, 'brown', 49),
(227, 'black', 49),
(228, 'white', 49),
(229, 'default', 50),
(230, 'red', 50),
(231, 'white', 50),
(232, 'blue', 50),
(233, 'green', 50),
(234, 'pink', 50),
(235, 'nurse', 50),
(236, 'glasses', 50),
(237, 'default', 51),
(238, 'pink', 51),
(239, 'green', 51),
(240, 'purple', 51),
(241, 'cyan', 51),
(242, 'brown', 51),
(243, 'blue', 51),
(244, 'black', 51),
(245, 'default', 52),
(246, 'red', 52),
(247, 'blue', 52),
(248, 'purple', 52),
(249, 'yellow', 52),
(250, 'black', 52),
(251, 'white', 52),
(252, 'grey', 52),
(253, 'default', 53),
(254, 'default', 54),
(255, 'yellow', 53),
(256, 'white', 53),
(257, 'red', 53),
(258, 'blue', 53),
(259, 'orange', 53),
(260, 'green', 53),
(261, 'pink', 53),
(262, 'defaultwire', 53),
(263, 'yellowwire', 53),
(264, 'whitewire', 53),
(265, 'redwire', 53),
(266, 'bluewire', 53),
(267, 'orangewire', 53),
(268, 'greenwire', 53),
(269, 'pinkwire', 53),
(270, 'default', 55),
(271, 'orange', 55),
(272, 'blue', 55),
(273, 'red', 55),
(274, 'grey', 55),
(275, 'cyan', 55),
(276, 'green', 55),
(277, 'purple', 55),
(278, 'default', 56),
(279, 'default', 57),
(280, 'default', 58),
(281, 'default', 59),
(282, 'default', 60),
(283, 'default', 61),
(284, 'default', 62),
(285, 'default', 63),
(286, 'default', 65),
(287, 'default', 66),
(288, 'default', 67),
(289, 'default', 68),
(290, 'default', 69),
(291, 'default', 70),
(292, 'default', 71),
(293, 'default', 72),
(294, 'default', 73),
(295, 'default', 74),
(296, 'default', 75),
(297, 'default', 76),
(298, 'default', 77),
(299, 'default', 78),
(300, 'default', 79),
(301, 'default', 80),
(302, 'default', 81),
(303, 'default', 82),
(304, 'default', 83),
(305, 'default', 84),
(306, 'default', 85),
(307, 'default', 86),
(308, 'default', 87),
(309, 'blue', 87),
(310, 'red', 87),
(311, 'black', 87),
(312, 'green', 87),
(313, 'white', 87),
(314, 'shortsorange', 87),
(315, 'shortsblue', 87),
(316, 'red', 86),
(317, 'blue', 86),
(318, 'purple', 86),
(319, 'green', 86),
(320, 'black', 86),
(321, 'pink', 86),
(322, 'white', 86),
(323, 'red', 85),
(324, 'blue', 85),
(325, 'yellow', 85),
(326, 'pink', 85),
(327, 'cyan', 85),
(328, 'purple', 85),
(329, 'black', 85),
(330, 'male', 84),
(331, 'green', 84),
(332, 'malegreen', 84),
(333, 'red', 84),
(334, 'malered', 84),
(335, 'yellow', 84),
(336, 'maleyellow', 84),
(337, 'red', 83),
(338, 'yellow', 83),
(339, 'cyan', 83),
(340, 'classic', 83),
(341, 'classicred', 83),
(342, 'classiccyan', 83),
(343, 'classicgreen', 83),
(344, 'pink', 82),
(345, 'yellow', 82),
(346, 'green', 82),
(347, 'cyan', 82),
(348, 'blue', 82),
(349, 'purple', 82),
(350, 'chartreuse', 82),
(351, 'red', 81),
(352, 'blue', 81),
(353, 'purple', 81),
(354, 'brown', 81),
(355, 'black', 81),
(356, 'grey', 81),
(357, 'teal', 81),
(358, 'purple', 80),
(359, 'cyan', 80),
(360, 'white', 80),
(361, 'black', 80),
(362, 'yellow', 80),
(363, 'green', 80),
(364, 'red', 80),
(365, 'white', 79),
(366, 'black', 79),
(367, 'orange', 79),
(368, 'blue', 79),
(369, 'lavender', 79),
(370, 'yellow', 79),
(371, 'trunks', 79),
(372, 'red', 78),
(373, 'purple', 78),
(374, 'pink', 78),
(375, 'green', 78),
(376, 'black', 78),
(377, 'yellow', 78),
(378, 'white', 78),
(379, 'blue', 77),
(380, 'pink', 77),
(381, 'brown', 77),
(382, 'purple', 77),
(383, 'green', 77),
(384, 'white', 77),
(385, 'black', 77),
(386, 'grey', 76),
(387, 'cyan', 76),
(388, 'black', 76),
(389, 'orange', 76),
(390, 'blue', 76),
(391, 'green', 76),
(392, 'red', 76),
(393, 'red', 75),
(394, 'green', 75),
(395, 'violet', 75),
(396, 'cyan', 75),
(397, 'purple', 75),
(398, 'pink', 75),
(399, 'yellow', 75),
(400, 'pink', 74),
(401, 'yellow', 74),
(402, 'green', 74),
(403, 'red', 74),
(404, 'purple', 74),
(405, 'black', 74),
(406, 'white', 74),
(407, 'female', 73),
(408, 'green', 73),
(409, 'red', 73),
(410, 'blue', 73),
(411, 'orange', 73),
(412, 'white', 73),
(413, 'pink', 73),
(414, 'grey', 72),
(415, 'yellow', 72),
(416, 'purple', 72),
(417, 'blue', 72),
(418, 'green', 72),
(419, 'white', 72),
(420, 'red', 72),
(421, 'yellow', 71),
(422, 'red', 71),
(423, 'green', 71),
(424, 'blue', 71),
(425, 'black', 71),
(426, 'cyan', 71),
(428, 'pink', 71),
(429, 'red', 70),
(430, 'green', 70),
(431, 'cyan', 70),
(432, 'yellow', 70),
(433, 'blue', 70),
(434, 'white', 70),
(435, 'purple', 70),
(436, 'pink', 69),
(437, 'cyan', 69),
(438, 'green', 69),
(439, 'blue', 69),
(440, 'red', 69),
(441, 'black', 69),
(442, 'purple', 69),
(443, 'blue', 68),
(444, 'yellow', 68),
(445, 'black', 68),
(446, 'purple', 68),
(447, 'white', 68),
(448, 'red', 68),
(449, 'plaid', 68),
(450, 'red', 67),
(451, 'green', 67),
(452, 'blue', 67),
(453, 'alph', 67),
(454, 'alphgreen', 67),
(455, 'alphpink', 67),
(456, 'alphred', 67),
(457, 'white', 66),
(458, 'yellow', 66),
(459, 'green', 66),
(460, 'blue', 66),
(461, 'black', 66),
(462, 'cyan', 66),
(463, 'purple', 66),
(464, 'red', 65),
(465, 'yellow', 65),
(466, 'blue', 65),
(467, 'teal', 65),
(468, 'cyan', 65),
(469, 'green', 65),
(470, 'white', 65),
(471, 'orange', 60),
(472, 'blue', 60),
(473, 'brown', 60),
(474, 'pink', 60),
(475, 'yellow', 60),
(476, 'cyan', 60),
(477, 'purple', 60),
(478, 'white', 59),
(479, 'red', 59),
(480, 'green', 59),
(481, 'navy', 59),
(482, 'pink', 59),
(483, 'purple', 59),
(484, 'grey', 59),
(485, 'red', 58),
(486, 'green', 58),
(487, 'brown', 58),
(488, 'cyan', 58),
(489, 'chartreuse', 58),
(490, 'orange', 58),
(491, 'grey', 58),
(492, 'red', 57),
(493, 'green', 57),
(494, 'black', 57),
(495, 'white', 57),
(496, 'blue', 57),
(497, 'yellow', 57),
(498, 'purple', 57),
(499, 'green', 56),
(500, 'black', 56),
(501, 'white', 56),
(502, 'red', 56),
(503, 'yellow', 56),
(504, 'navy', 56),
(505, 'purple', 56),
(506, 'default', 88),
(507, 'default', 89),
(508, 'default', 90),
(509, 'default', 91),
(510, 'default', 92),
(511, 'default', 93),
(512, 'default', 94),
(513, 'default', 95),
(514, 'default', 96),
(515, 'default', 97),
(516, 'default', 98),
(517, 'default', 99),
(518, 'default', 100),
(519, 'default', 101),
(520, 'default', 102),
(521, 'default', 103),
(522, 'default', 104),
(523, 'default', 105),
(524, 'default', 106),
(525, 'default', 107),
(526, 'default', 108),
(527, 'default', 109),
(528, 'default', 110),
(533, 'red', 16),
(534, 'green', 16),
(535, 'black', 16),
(536, 'white', 16),
(537, 'red', 17),
(538, 'blue', 17),
(539, 'green', 17),
(540, 'default', 111),
(541, 'default', 112),
(542, 'default', 113),
(543, 'default', 114);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `characters`
--

CREATE TABLE IF NOT EXISTS `characters` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `short` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `game` int(11) NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `characters`
--

INSERT INTO `characters` (`id`, `name`, `short`, `game`, `position`) VALUES
(1, 'Fox', 'Fox', 1, 0),
(2, 'Falco', 'Falco', 1, 1),
(3, 'Peach', 'Peach', 1, 2),
(4, 'Captain Falcon', 'Cpt.Falcon', 1, 3),
(5, 'Bowser', 'Bowser', 1, 4),
(6, 'Donkey Kong', 'DK', 1, 5),
(7, 'Dr. Mario', 'Doc', 1, 6),
(8, 'Game & Watch', 'G&W', 1, 7),
(9, 'Ganondorf', 'Ganon', 1, 8),
(10, 'Ice Climbers', 'IC', 1, 9),
(11, 'Jigglypuff', 'Jigglypuff', 1, 10),
(12, 'Kirby', 'Kirby', 1, 11),
(13, 'Link', 'Link', 1, 12),
(14, 'Luigi', 'Luigi', 1, 13),
(15, 'Mario', 'Mario', 1, 14),
(16, 'Marth', 'Marth', 1, 15),
(17, 'Mewtwo', 'Mewtwo', 1, 16),
(18, 'Ness', 'Ness', 1, 17),
(19, 'Pichu', 'Pichu', 1, 18),
(20, 'Pikachu', 'Pikachu', 1, 19),
(21, 'Roy', 'Roy', 1, 20),
(22, 'Samus', 'Samus', 1, 21),
(23, 'Sheik', 'Sheik', 1, 22),
(24, 'Young Link', 'Y.Link', 1, 23),
(25, 'Yoshi', 'Yoshi', 1, 24),
(26, 'Zelda', 'Zelda', 1, 25),
(27, 'Mario', 'mario', 3, 0),
(28, 'Peach', 'Peach', 3, 1),
(29, 'Captain Falcon', 'Cpt.Falcon', 3, 2),
(30, 'Kirby', 'Kirby', 3, 3),
(31, 'Lucario', 'Lucario', 3, 4),
(32, 'Luigi', 'Luigi', 3, 5),
(33, 'Bayonetta', 'Bayonetta', 3, 6),
(34, 'Bowser', 'Bowser', 3, 7),
(35, 'Bowser Jr.', 'Bowser Jr.', 3, 8),
(36, 'Charizard', 'Charizard', 3, 9),
(37, 'Cloud', 'Cloud', 3, 10),
(38, 'Corrin', 'Corrin', 3, 11),
(39, 'Mario', 'Mario', 2, 0),
(40, 'Dark Pit', 'Dark Pit', 3, 12),
(41, 'Diddy Kong', 'Diddy', 3, 13),
(42, 'Donkey Kong', 'DK', 3, 14),
(43, 'Dr. Mario', 'Doc', 3, 15),
(44, 'Duck Hunt', 'Duck Hunt', 3, 16),
(45, 'Falco', 'Falco', 3, 17),
(46, 'Fox', 'Fox', 3, 18),
(47, 'Ganondorf', 'Ganon', 3, 19),
(48, 'Greninja', 'Greninja', 3, 20),
(49, 'Ike', 'Ike', 3, 21),
(50, 'Jigglypuff', 'Jigglypuff', 3, 22),
(51, 'King Dedede', 'D3', 3, 23),
(52, 'Link', 'Link', 3, 24),
(53, 'Little Mac', 'Little Mac', 3, 25),
(55, 'Lucas', 'Lucas', 3, 26),
(56, 'Lucina', 'Lucina', 3, 27),
(57, 'Marth', 'Marth', 3, 28),
(58, 'Mega Man', 'Mega Man', 3, 29),
(59, 'Meta Knight', 'MK', 3, 30),
(60, 'Mewtwo', 'Mewtwo', 3, 31),
(61, 'Mii Brawler', 'Mii Brawler', 3, 32),
(62, 'Mii Swordfighter', 'Mii Swordfighter', 3, 33),
(63, 'Mii Gunner', 'Mii Gunner', 3, 34),
(65, 'Mr. Game & Watch', 'G&W', 3, 35),
(66, 'Ness', 'Ness', 3, 36),
(67, 'Olimar', 'Olimar', 3, 37),
(68, 'Pac-Man', 'Pac-Man', 3, 38),
(69, 'Palutena', 'Palutena', 3, 39),
(70, 'Pikachu', 'Pikachu', 3, 40),
(71, 'Pit', 'Pit', 3, 41),
(72, 'R.O.B.', 'ROB', 3, 42),
(73, 'Robin', 'Robin', 3, 43),
(74, 'Rosalina & Luma', 'Rosalina', 3, 44),
(75, 'Roy', 'Roy', 3, 45),
(76, 'Ryu', 'Ryu', 3, 46),
(77, 'Samus', 'Samus', 3, 47),
(78, 'Sheik', 'Sheik', 3, 48),
(79, 'Shulk', 'Shulk', 3, 49),
(80, 'Sonic', 'Sonic', 3, 50),
(81, 'Toon Link', 'T.Link', 3, 51),
(82, 'Villager', 'Villager', 3, 52),
(83, 'Wario', 'Wario', 3, 53),
(84, 'Wii Fit Trainer', 'WFT', 3, 54),
(85, 'Yoshi', 'Yoshi', 3, 55),
(86, 'Zelda', 'Zelda', 3, 56),
(87, 'Zero Suit Samus', 'ZSS', 3, 57),
(88, 'Ike', 'Ike', 2, 1),
(89, 'Snake', 'Snake', 2, 2),
(90, 'King Dedede', 'D3', 2, 3),
(91, 'Diddy Kong', 'Diddy', 2, 4),
(92, 'Ice Climbers', 'IC', 2, 5),
(93, 'Peach', 'Peach', 2, 6),
(94, 'Falco', 'Falco', 2, 7),
(95, 'Kirby', 'Kirby', 2, 8),
(96, 'Marth', 'Marth', 2, 9),
(97, 'Ness', 'Ness', 2, 10),
(98, 'Wolf', 'Wolf', 2, 11),
(99, 'Yoshi', 'Yoshi', 2, 12),
(100, 'Jigglypuff', 'Jigglypuff', 2, 13),
(101, 'Samus', 'Samus', 2, 14),
(102, 'Zero Suit Samus', 'Zero Suit Samus', 2, 15),
(103, 'Toon Link', 'T.Link', 2, 16),
(104, 'Meta Knight', 'MK', 2, 17),
(105, 'Fox', 'Fox', 2, 18),
(106, 'Lucas', 'Lucas', 2, 19),
(107, 'Zelda', 'Zelda', 2, 20),
(108, 'Fox', 'Fox', 5, 0),
(109, 'Donkey Kong', 'DK', 5, 1),
(110, 'Captain Falcon', 'Cpt.Falcon', 5, 2),
(111, 'Sheik', 'Sheik', 6, 0),
(112, 'Kirby', 'Kirby', 6, 1),
(113, 'Fox', 'Fox', 6, 2),
(114, 'Falco', 'Falco', 6, 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `countries`
--

CREATE TABLE IF NOT EXISTS `countries` (
`id` int(11) NOT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `continent` varchar(40) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `countries`
--

INSERT INTO `countries` (`id`, `name`, `continent`) VALUES
(1, 'Germany', 'Europe'),
(2, 'Sweden', 'Europe'),
(3, 'England', 'Europe'),
(4, 'Wales', 'Europe'),
(5, 'Scotland', 'Europe'),
(6, 'Northern Ireland', 'Europe'),
(7, 'Ireland', 'Europe'),
(8, 'Spain', 'Europe'),
(9, 'Italy', 'Europe'),
(10, 'France', 'Europe'),
(11, 'Belgium', 'Europe'),
(12, 'Switzerland', 'Europe'),
(13, 'Denmark', 'Europe'),
(14, 'Finland', 'Europe'),
(15, 'Norway', 'Europe'),
(16, 'Greece', 'Europe'),
(17, 'Poland', 'Europe'),
(18, 'United States', 'North America'),
(19, 'Canada', 'North America'),
(20, 'Mexico', 'North America'),
(21, 'Chile', 'South America'),
(22, 'Brazil', 'South America'),
(23, 'Netherlands', 'Europe'),
(24, 'Austria', 'Europe'),
(25, 'Luxembourg', 'Europe'),
(26, 'Hong Kong', 'Asia'),
(27, 'Japan', 'Asia'),
(28, 'Morocco', 'Africa'),
(29, 'Portugal', 'Europe'),
(30, 'Vietnam', 'Asia'),
(31, 'Iceland', 'Europe'),
(32, 'Sudan', 'Africa'),
(33, 'Saudi Arabia', 'Asia'),
(34, 'Kuwait', 'Asia'),
(35, 'Hungary', 'Europe'),
(36, 'South Korea', 'Asia'),
(37, 'Russia', 'Europe'),
(38, 'Israel', 'Europe');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `games`
--

CREATE TABLE IF NOT EXISTS `games` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `short` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `games`
--

INSERT INTO `games` (`id`, `name`, `short`) VALUES
(1, 'Super Smash Bros. Melee', 'Melee'),
(2, 'Super Smash Bros. Brawl', 'Brawl'),
(3, 'Super Smash Bros. for Wii U', 'Smash 4'),
(4, 'Super Smash Bros. for 3DS', 'Smash 4 3DS'),
(5, 'Super Smash Bros. N64', 'Smash 64'),
(6, 'Project M', 'P:M'),
(7, 'Street Fighter V', 'SFV'),
(8, 'Mario Party 5', 'MP5'),
(9, 'Rivals of Aether', 'RoA'),
(10, 'Guilty Gear XRD Rev2', 'GG XRD'),
(11, 'Street Fighter 3: Third Strike', 'SF3'),
(12, 'Tekken 7', 'Tekken 7'),
(13, 'Ultimate Marvel vs. Capcom 3', 'UMvC3'),
(14, 'Injustice 2', 'Injustice 2'),
(15, 'Derby Densetsu: Under Night in-Birth', 'DD: UNiB'),
(16, 'Skullgirls 2nd Encore', 'Skullgirls');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `player`
--

CREATE TABLE IF NOT EXISTS `player` (
`id` int(11) NOT NULL,
  `nickname` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `country` int(11) NOT NULL,
  `displayname` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `twitter` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `youtube` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `twitch` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `firstname` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `smashrankingeu` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `smashgg` int(11) NOT NULL DEFAULT '0',
  `tafostats` int(20) NOT NULL,
  `teampartner` int(11) NOT NULL,
  `laststreamactivity` int(11) NOT NULL,
  `modify_time` int(12) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `player`
--

INSERT INTO `player` (`id`, `nickname`, `country`, `displayname`, `twitter`, `youtube`, `twitch`, `firstname`, `lastname`, `smashrankingeu`, `smashgg`, `tafostats`, `teampartner`, `laststreamactivity`, `modify_time`) VALUES
(1, 'Liva', 1, '', 'GGs_Liva', '', 'Livastyle', '', '', '', 0, 0, 0, 0, 0),
(2, 'Armada', 2, '[A]rmada', '', '', '', '', '', '', 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `player-teams`
--

CREATE TABLE IF NOT EXISTS `player-teams` (
  `pid` int(11) NOT NULL,
  `tid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `profile`
--

CREATE TABLE IF NOT EXISTS `profile` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `theme` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'default',
  `autoupdatetime` int(11) NOT NULL DEFAULT '500',
  `scoreboarddata` longtext COLLATE utf8_unicode_ci NOT NULL,
  `dest_xml` tinyint(1) NOT NULL DEFAULT '0',
  `dest_json` tinyint(1) NOT NULL DEFAULT '0',
  `dest_curl` tinyint(1) NOT NULL DEFAULT '0',
  `dest_text` tinyint(1) NOT NULL DEFAULT '0',
  `dest_websocket` tinyint(1) NOT NULL DEFAULT '0',
  `casinodata` text COLLATE utf8_unicode_ci NOT NULL,
  `smashgg` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `twitter` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `playlist` longtext COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `profile`
--

INSERT INTO `profile` (`id`, `name`, `active`, `theme`, `autoupdatetime`, `scoreboarddata`, `dest_xml`, `dest_json`, `dest_curl`, `dest_text`, `dest_websocket`, `casinodata`, `smashgg`, `twitter`, `playlist`) VALUES
(1, 'default', 1, 'generic', 500, '{}', 0, 1, 0, 0, 1, '{}', '', '', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `quiz_answers`
--

CREATE TABLE IF NOT EXISTS `quiz_answers` (
`id` int(11) NOT NULL,
  `question` int(11) NOT NULL,
  `option` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `correct` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `quiz_answers`
--

INSERT INTO `quiz_answers` (`id`, `question`, `option`, `correct`) VALUES
(1, 5, 'Normal', 0),
(2, 5, 'Green', 1),
(3, 5, 'Red', 0),
(4, 5, 'Black', 0),
(5, 5, 'All are equal', 0),
(6, 4, 'Westballz', 0),
(7, 4, 'dizzkidboogie', 1),
(8, 4, 'Chillindude', 0),
(9, 4, 'Slox', 0),
(10, 3, 'Syndicate 2016', 0),
(11, 3, 'Dreamhack Winter 16', 1),
(12, 3, 'BEAST 6', 0),
(13, 3, 'Kickstart 11 ', 0),
(14, 3, 'Avalon IX', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `quiz_questions`
--

CREATE TABLE IF NOT EXISTS `quiz_questions` (
`id` int(11) NOT NULL,
  `cat` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `game` int(11) NOT NULL,
  `question` varchar(200) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `cat`, `game`, `question`) VALUES
(1, 'Head 2 head', 1, 'Which Ice Climber player did Armada lose a game to for the first time?'),
(2, 'Player', 1, 'Which character did Ice main in the beginning of his carrer?'),
(3, 'Head 2 head', 1, 'At which of these event did Professor Pro beat Ice?'),
(4, 'Head 2 head', 1, 'Which US American player did Daydee beat at BEAST 7 to put himself on 17th?'),
(5, 'Character', 1, 'Which of Captain Falcons costumes has the biggest model?');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `stages`
--

CREATE TABLE IF NOT EXISTS `stages` (
`id` int(11) NOT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `game` int(11) NOT NULL,
  `short` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `singles_starter` tinyint(1) NOT NULL DEFAULT '0',
  `doubles_starter` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `stages`
--

INSERT INTO `stages` (`id`, `name`, `game`, `short`, `singles_starter`, `doubles_starter`) VALUES
(1, 'Final Destination', 1, 'fd', 1, 1),
(2, 'Battlefield', 1, 'bf', 1, 1),
(3, 'Dreamland', 1, 'dl', 1, 1),
(4, 'Yoshis Story', 1, 'ys', 1, 1),
(5, 'Fountain of Dreams', 1, 'fod', 1, 0),
(6, 'Pokemon Stadium', 1, 'ps', 0, 1),
(7, 'Palutenas Temple (Omega)', 3, 'pt_o', 0, 0),
(8, 'Battlefield', 3, 'bf', 1, 1),
(9, 'Smashville', 3, 'sv', 1, 1),
(10, 'Town and City', 3, 'tc', 1, 1),
(11, 'Lylat Cruise', 3, 'lc', 1, 1),
(12, 'Final Destination', 3, 'fd', 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `team-logos`
--

CREATE TABLE IF NOT EXISTS `team-logos` (
`id` int(11) NOT NULL,
  `teamid` int(11) NOT NULL,
  `filename` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `logo` tinyint(1) NOT NULL,
  `inline` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `team-logos`
--

INSERT INTO `team-logos` (`id`, `teamid`, `filename`, `logo`, `inline`) VALUES
(1, 1, '14ae0b9a32ab7b3a2ee1842f6afdc2bc.png', 0, 1),
(2, 1, '78e613405ca15d81a1566c539cf12241.png', 1, 0),
(3, 25, '58ee7deaceac2e0343272fb6e61d8f4d.png', 1, 1),
(4, 28, 'b9be5422c3d3a9eca094c8b560b5c8f6.png', 1, 1),
(5, 35, '85786e9bc5eac5c8b88306f051f27b4f.png', 1, 1),
(6, 7, '88a0b0c33261b685e4643d1fb71b4d8c.png', 0, 0),
(7, 7, '1ee2509ceb4c1069ea4ea8e49dd390ea.png', 1, 1),
(8, 8, '954d7a92ec5d458ab4002f5ff06ea65c.png', 1, 1),
(9, 8, '1464f7eb692bebd9880fc127e85bb408.png', 0, 0),
(10, 9, '637321e797f08df809258edd0be1a197.png', 1, 0),
(11, 9, 'ddcee59606f888cdd147828dc895742c.png', 0, 1),
(12, 10, 'b039cc90014ed962a25455bbc743479c.png', 0, 1),
(13, 10, '5ed995081e6a08d28730111102985ab1.png', 0, 0),
(14, 10, '84d64e39769b3edc2739f7091b054f97.png', 1, 0),
(15, 30, '525ca4a6ddd4913fddd91ba535fa9378.png', 1, 0),
(16, 30, 'ef21a32183e38f62e375bcbc09b29f0b.png', 0, 0),
(17, 30, '4f797389f5dd1b2c265a1e2a67915bf5.png', 0, 1),
(18, 29, 'c812254f0c0cb50265231abef0f973a8.png', 1, 0),
(19, 29, '5d6f100f34b134d8c36096a900db160d.png', 0, 1),
(20, 36, 'a7d85bf51e1724de652ebeee20ae8c8e.png', 1, 1),
(21, 31, 'd1e3793e6a71fd5b22a2bc1c581037d9.png', 1, 1),
(22, 13, '3cec1bfed232cdcb2cf39afb76a4aeea.png', 1, 1),
(23, 2, '8c0a80db14179c9f171a518e92d2da24.png', 1, 1),
(24, 2, 'ba505a6b30d5fb522350262021fa5fbf.png', 0, 0),
(25, 32, '6449446117b580884fa3330be8998869.png', 1, 1),
(26, 20, '58b088409ef5ea370228dbec6508e7ad.png', 1, 0),
(27, 20, '82af10d6cecd4c8d1eacfdcf5ffab0dc.png', 0, 1),
(28, 6, '06ab2b36d252576ab9105c5b3e10e13e.png', 1, 1),
(29, 4, 'dc4519e04ffe62384b1263394d923f12.png', 0, 0),
(30, 4, '5719d9a4210b8a4e96061bf5f7db0cad.png', 1, 1),
(31, 24, '4d045f0012da9d81d6f332241bb78fbf.png', 0, 1),
(32, 24, '6364395596a6d7bf0db76b698cdd8030.png', 1, 0),
(33, 5, '91babb3bdd3157f1cb9813eac50f9bdb.png', 0, 1),
(34, 5, '0f25e669d5fedb5724bc5733fa4ec46a.png', 1, 0),
(35, 34, '1de3120e52975166f84d3d9a05aab77c.png', 1, 1),
(36, 18, '378d3969d4dcbe7d422133f4e625a6d8.png', 1, 1),
(37, 33, '96f6a51d7b287992513a5c82c512735d.png', 1, 0),
(38, 33, '2defd708f9437d54fa6d1b570a1ad1dd.png', 0, 1),
(39, 19, '8ae5e7655dec743a8814a9ea3be1e86a.png', 0, 0),
(40, 19, '64bbc18dca6c6b46e68516e992cc7b7b.png', 1, 0),
(41, 19, '7c562cd7c1a4966dbd0e17a055c9a14f.png', 0, 0),
(42, 19, '6ba4b1174c4152c2f3cc227e015fa2f8.png', 0, 1),
(43, 22, '4debc7a6e62ae16c330caa67e6c57421.png', 1, 1),
(44, 21, '89eb71a35fcfe8e8d521e3c7247b8139.png', 1, 1),
(45, 14, '6839f48fcec41ffe92d3ffbafda3d668.png', 1, 0),
(46, 14, 'd15713795cd75ea976b959b3617e816b.png', 0, 1),
(47, 17, 'cc4a1edc60e5853890db76b2ffe71226.png', 1, 1),
(48, 17, 'd5900b21215bd60cbeb4dc366df6ad6e.png', 0, 0),
(49, 17, '4471c5ac5190fb8bc9084359c01782f7.png', 0, 0),
(50, 27, '59ec76355b9e49b31f699755f617bc10.png', 1, 0),
(51, 27, '167e6525922f490b480a0e4d76b03bb7.png', 0, 1),
(52, 12, '0c1dcdac38841fa3ad12eed10dbf2c65.png', 1, 0),
(53, 12, '9cdd65e9b59d146fda7a9ec106b021cd.png', 0, 0),
(54, 12, 'c5c7c7f84eaa8afbad01a0992188ac91.png', 0, 1),
(55, 3, 'f9334775158b2c35d5d28ddf1d3c05f0.png', 1, 1),
(56, 26, '2c31de2977131837915cde9b9933f150.png', 0, 0),
(57, 26, '5f599701663e7a72b8b874638b77a62d.png', 1, 1),
(58, 15, '128bb3feded9a93e61ffa2f4042d4276.png', 1, 1),
(59, 11, '3df8581c9a335ce5d2bde36fd4b5fb53.png', 0, 1),
(60, 11, 'f9e1b38f2d9cc03b2977921870ce807e.png', 1, 0),
(61, 16, '580477dc53e0e1de34e624e0c308fca6.png', 0, 0),
(62, 16, 'eb98d903f5638573dacfff2adf821795.png', 1, 1),
(63, 23, '72f693db59d6d16ec6a3fb4c01977e25.png', 1, 1),
(64, 37, 'cc24d29a466ffa592df6f986a7b98754.png', 0, 1),
(65, 37, 'e9e7009c59877eecdb96ed5c03f272e3.png', 1, 0),
(66, 38, '4511ca631df7b407d99fae3d612decb0.png', 0, 1),
(67, 38, 'baffe57ed5444091c2e0999f5ad63f9d.png', 1, 0),
(68, 39, '8b6697e23ebc093b48168578f0150ffb.png', 1, 1),
(69, 40, '82e997b162896426fc7b2336093b3fc9.png', 1, 0),
(70, 40, 'a505f6baca056fdb52bf6631a3c666ac.png', 0, 1),
(71, 42, '544c89784c7f1fff2d9d3f903e24a98d.png', 1, 1),
(72, 43, '09d444525a38e56d913ffa435feac9c6.png', 1, 1),
(73, 44, '934869164a8a9c2130217352c5cbedf8.png', 1, 1),
(74, 45, '7e8a5a8415217b3d2c5d768d4dc0fcad.png', 1, 0),
(75, 45, 'a4f8b7e10169bc60b4ea93ecefc4bc9a.png', 0, 1),
(76, 46, '1af87ca361f5d9784dad556de103c050.png', 1, 1),
(77, 47, 'a9dcb590270b54c467ccd6895f4e380d.png', 0, 0),
(78, 47, '7d52068fa9429d1d87f40224e723c43f.png', 0, 1),
(79, 47, 'a657480de713d1c78b5a088017028156.png', 1, 0),
(80, 48, 'b3a19badfeedefcf893c1c54240234d1.png', 1, 1),
(81, 49, '7cd337f341603c07b569fc70bc8790be.png', 0, 0),
(82, 49, 'f51f970b3e10082df35ee931dec1b8bc.png', 1, 1),
(83, 50, '6054a7ee8c9dfaa8cfc2bcad03e56232.png', 0, 0),
(84, 50, 'e59941d73a2f0f163789cf31490030ce.png', 0, 0),
(85, 50, 'db48b34ece2da3376c461240e63a0621.png', 1, 1),
(86, 52, '2b208163efc39076c8c6019af8aa95b4.png', 1, 1),
(87, 53, 'edbded56269c17e03d90fd4eaf1e5957.png', 0, 0),
(88, 53, 'e164592cea41121aca39ba8a379c370b.png', 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `teams`
--

CREATE TABLE IF NOT EXISTS `teams` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `prefix` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `teams`
--

INSERT INTO `teams` (`id`, `name`, `prefix`) VALUES
(1, 'Alliance', '[A]'),
(2, 'Geeky Goon Squad', 'GGs'),
(3, 'Team Solomid', 'TSM'),
(4, 'RedBull', 'RB'),
(5, 'Revolution', 'Revo'),
(6, 'mYinsanity', 'mYi'),
(7, 'Beefy Smash Dudes', 'BSD'),
(8, 'BYOController', 'BYOC'),
(9, 'Cloud 9', 'C9'),
(10, 'Counter Logic Gaming', 'CLG'),
(11, 'VGBootCamp', 'VGBC'),
(12, 'Team Prismatic', 'pM'),
(13, 'G2 Esports', 'G2'),
(14, 'Team Heir', 'Heir'),
(15, 'The Gatekeepers', 'GK'),
(16, 'Wolves eSports', 'Wolves'),
(17, 'Team Liquid', 'Liquid'),
(18, 'Selfless', 'Selfless'),
(19, 'Splyce', 'SPY'),
(20, 'Luminosity Gaming', 'LG'),
(21, 'Team Calyptus', 'TCL'),
(22, 'Stofftiere Online e.V.', 'SFTO'),
(23, 'Solution Gaming', 'SG'),
(24, 'Renegades', 'RNG'),
(25, 'APT', 'APT'),
(26, 'Team Viral', 'vL'),
(27, 'Team Misfits', 'MSF'),
(28, 'Asterion', 'AST'),
(29, 'Elevate', 'Elevate'),
(30, 'DAT Team', 'DAT'),
(31, 'FoX Gaming e.V.', 'FoX'),
(32, 'Hexagon Smash', '0x'),
(33, 'ShieldBreakFast', 'SBF'),
(34, 'Salty Playground', 'SYPG'),
(35, 'Basement Lan', 'BML'),
(36, 'Evil Gaming ', 'eViL'),
(37, 'SmashStudios', 'SS'),
(38, 'Echo Fox', 'FOX'),
(39, 'Black Sun E-Sports', 'SUN'),
(40, 'Melee it on me', 'MIOM'),
(41, 'LuK GmbH & Co. KG', 'LuK'),
(42, 'Tempo Storm', 'Tempo'),
(43, 'Arcade Dreams', 'AD'),
(44, 'Virtualdojo Vienna', 'VDV'),
(45, 'ZOWIE', 'ZOWIE'),
(46, 'Frys Electronics', 'Frys'),
(47, 'beastcoast', 'BC'),
(48, 'Eraiize Gaming', 'ER'),
(49, 'Neutral Gaming', 'NG'),
(50, 'Clutch 23', 'CL23'),
(51, 'Mission Complete', 'MC'),
(52, 'Pixel Esport Bar', 'PXL'),
(53, 'SwiftFox', 'SF');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `thumbnails`
--

CREATE TABLE IF NOT EXISTS `thumbnails` (
`id` int(11) NOT NULL,
  `filename` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `tn_filename` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `vod` int(11) NOT NULL,
  `theme` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `time` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `vods`
--

CREATE TABLE IF NOT EXISTS `vods` (
`id` int(11) NOT NULL,
  `yt` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `smashgg_setid` int(20) NOT NULL,
  `game` int(10) NOT NULL,
  `p1` text COLLATE utf8_unicode_ci NOT NULL,
  `p2` text COLLATE utf8_unicode_ci NOT NULL,
  `c1` text COLLATE utf8_unicode_ci NOT NULL,
  `c2` text COLLATE utf8_unicode_ci NOT NULL,
  `round` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `event` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `casters` text COLLATE utf8_unicode_ci NOT NULL,
  `time` int(20) NOT NULL,
  `done` tinyint(1) NOT NULL DEFAULT '0',
  `file` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `custom_title` varchar(200) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `character-costumes`
--
ALTER TABLE `character-costumes`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `characters`
--
ALTER TABLE `characters`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `countries`
--
ALTER TABLE `countries`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `games`
--
ALTER TABLE `games`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `player`
--
ALTER TABLE `player`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `player-teams`
--
ALTER TABLE `player-teams`
 ADD KEY `pid` (`pid`), ADD KEY `tid` (`tid`), ADD KEY `pid_2` (`pid`), ADD KEY `tid_2` (`tid`);

--
-- Indizes für die Tabelle `profile`
--
ALTER TABLE `profile`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `quiz_answers`
--
ALTER TABLE `quiz_answers`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `quiz_questions`
--
ALTER TABLE `quiz_questions`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `stages`
--
ALTER TABLE `stages`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `team-logos`
--
ALTER TABLE `team-logos`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `teams`
--
ALTER TABLE `teams`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `thumbnails`
--
ALTER TABLE `thumbnails`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `vods`
--
ALTER TABLE `vods`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `character-costumes`
--
ALTER TABLE `character-costumes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=544;
--
-- AUTO_INCREMENT für Tabelle `characters`
--
ALTER TABLE `characters`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=115;
--
-- AUTO_INCREMENT für Tabelle `countries`
--
ALTER TABLE `countries`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=39;
--
-- AUTO_INCREMENT für Tabelle `games`
--
ALTER TABLE `games`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT für Tabelle `player`
--
ALTER TABLE `player`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT für Tabelle `profile`
--
ALTER TABLE `profile`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT für Tabelle `quiz_answers`
--
ALTER TABLE `quiz_answers`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT für Tabelle `quiz_questions`
--
ALTER TABLE `quiz_questions`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT für Tabelle `stages`
--
ALTER TABLE `stages`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT für Tabelle `team-logos`
--
ALTER TABLE `team-logos`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=89;
--
-- AUTO_INCREMENT für Tabelle `teams`
--
ALTER TABLE `teams`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=54;
--
-- AUTO_INCREMENT für Tabelle `thumbnails`
--
ALTER TABLE `thumbnails`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `vods`
--
ALTER TABLE `vods`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
