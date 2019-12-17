CREATE DATABASE IF NOT EXISTS Jekiri;
USE Jekiri;

CREATE TABLE user(
userID INT NOT NULL AUTO_INCREMENT,
username VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
kwdikos varchar(255) NOT NULL,
PRIMARY KEY(userID)
);

INSERT INTO user(username, email, kwdikos) values
('panos', 'christopoulos@ceid.gr', 'fbaisdhfbadsjfbsj'),
('eris', 'trelakos@mfmndsk.ce', 'sfdafasddsa'),
('mhtsos', 'mhtsoooooo@mhtso.mhtso', 'fsdanjdfiasfsdak');

