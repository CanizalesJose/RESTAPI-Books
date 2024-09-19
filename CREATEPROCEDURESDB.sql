DELIMITER $$

CREATE PROCEDURE existUser(IN inputUsername VARCHAR(100))
BEGIN
    SELECT username FROM Users WHERE username = inputUsername;
END $$

CREATE PROCEDURE registerUser(IN inputUsername VARCHAR(30), IN inputPassword VARCHAR(100), IN inputUsertype VARCHAR(15))
BEGIN
    INSERT INTO Users (userName, userPassword, usertype) VALUES (inputUsername, inputPassword, inputUsertype);
END $$

DELIMITER ;