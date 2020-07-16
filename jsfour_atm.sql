CREATE TABLE `jsfour_atm` (
  `identifier` varchar(40) NOT NULL,
  `account` varchar(60) NOT NULL,
  `pincode` int(11) NOT NULL DEFAULT '1111',
   PRIMARY KEY (`identifier`)
);
