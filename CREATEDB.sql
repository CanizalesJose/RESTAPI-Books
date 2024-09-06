DROP DATABASE IF EXISTS booksCenter;

CREATE DATABASE booksCenter;

USE booksCenter;

CREATE TABLE Author(
    authorId VARCHAR(15) PRIMARY KEY,
    authorName VARCHAR(100),
    authorNationality VARCHAR(50)
);

INSERT INTO Author values("1", "Bram Stoker", "Irlanda");
INSERT INTO Author VALUES("2", "Brandon Sanderson", "Estados Unidos");