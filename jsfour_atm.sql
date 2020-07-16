CREATE TABLE `jsfour_atm` (
  `identifier` VARCHAR(40) NOT NULL,
  `account` VARCHAR(60) NOT NULL,
  `pincode` INT(11) NOT NULL DEFAULT '1111',
   PRIMARY KEY (`identifier`)
);
