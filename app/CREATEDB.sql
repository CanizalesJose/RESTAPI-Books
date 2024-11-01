DROP DATABASE IF EXISTS booksCenter;
SET GLOBAL event_scheduler = ON;

CREATE DATABASE booksCenter default charset=utf8mb4 collate=utf8mb4_unicode_ci;

USE booksCenter;

CREATE TABLE Authors(
    id VARCHAR(15) PRIMARY KEY,
    fullName VARCHAR(100),
    nationality VARCHAR(50)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

CREATE TABLE Categories(
    id VARCHAR(15) PRIMARY KEY,
    descr VARCHAR(100)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

CREATE TABLE Books(
    id VARCHAR(15) PRIMARY KEY,
    title VARCHAR(100),
    isbn VARCHAR(18),
    author VARCHAR(15),
    publisher VARCHAR(100),
    publishYear INT,
    category VARCHAR(15),
    copies INT DEFAULT 1,
    loanCopies INT DEFAULT 0,
    imageUrl VARCHAR(255) DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s',
    FOREIGN KEY (author) REFERENCES Authors(id) ON DELETE RESTRICT,
    FOREIGN KEY (category) REFERENCES Categories(id) ON DELETE RESTRICT
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

CREATE TABLE Catalog(
    id VARCHAR(15) PRIMARY KEY,
    bookId VARCHAR(15),
    summary TEXT,
    isVisible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (bookId) REFERENCES Books(id) ON DELETE RESTRICT
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

CREATE TABLE Users(
    userName VARCHAR(30) PRIMARY KEY,
    userPassword VARCHAR(100),
    usertype VARCHAR(15),
    contactNumber VARCHAR(12),
    email VARCHAR(100),
    penalized BOOLEAN DEFAULT FALSE
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

CREATE TABLE Loans(
    id VARCHAR(15) PRIMARY KEY,
    username VARCHAR(30),
    loanDate DATE,
    returnDate DATE,
    FOREIGN KEY (username) REFERENCES Users(username) ON DELETE RESTRICT
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

CREATE TABLE LoanDetails(
    id INT AUTO_INCREMENT PRIMARY KEY,
    loanId VARCHAR(15),
    bookId VARCHAR(15),
    returned BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (loanId) REFERENCES Loans(id) ON DELETE RESTRICT,
    FOREIGN KEY (bookId) REFERENCES Books(id) ON DELETE RESTRICT
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

INSERT INTO `authors` VALUES ('A001','Gabriel García Marquez','Colombiano'),('A002','J.K. Rowling','Britanica'),('A003','George Orwell','Britanico'),('A004','Haruki Murakami','Japones'),('A005','Isabel Allende','Chilena'),('A006','Stephen King','Estadounidense'),('A007','Jane Austen','Britanica'),('A008','Mark Twain','Estadounidense'),('A009','Agatha Christie','Britanica'),('A010','F. Scott Fitzgerald','Estadounidense'),('A011','Hermann Hesse','Aleman'),('A012','Leo Tolstoy','Ruso'),('A013','Franz Kafka','Aleman'),('A014','Paulo Coelho','Brasileño'),('A015','Chimamanda Ngozi Adichie','Nigeriana');

INSERT INTO `categories` VALUES ('C001','Ficcion'),('C002','No Ficcion'),('C003','Ciencia'),('C004','Historia'),('C005','Fantasia'),('C006','Biografia'),('C007','Autoayuda'),('C008','Misterio'),('C009','Romantico'),('C010','Ciencia Ficcion'),('C011','Terror'),('C012','Clasicos'),('C013','Cultura'),('C014','Politica'),('C015','Religion');

INSERT INTO `books` VALUES 
('B001','Cien años de soledad','978-0060883287','A001','Random House',1967,'C001',1,0,'https://m.media-amazon.com/images/I/91TvVQS7loL._AC_UF1000,1000_QL80_.jpg'),
('B002','El otoño del patriarca','978-0307389730','A001','Vintage',1975,'C001',1,0,'https://imagessl3.casadellibro.com/a/l/s5/13/9788497592413.webp'),
('B003','El amor en los tiempos del cólera','978-0307389730','A001','Vintage',1985,'C001',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyNtOHlFQI6XGe8MZck5PMDhwEXpyf1odO9Q&s'),
('B004','Harry Potter y la piedra filosofal','978-0747532699','A002','Bloomsbury',1997,'C005',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSABnJg_Jemi0qe5O_ZAwEmSrZ4wf_7g7Plag&s'),
('B005','Harry Potter y la cámara secreta','978-0747538493','A002','Bloomsbury',1998,'C005',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpMmQXiX5-Iar-hWjkGRiC2hri_y8J_qyKoQ&s'),
('B006','Harry Potter y el prisionero de Azkaban','978-0747542155','A002','Bloomsbury',1999,'C005',1,0,'https://image.cdn0.buscalibre.com/5b5ad0261dc86127688b4568.__RS360x360__.jpg'),
('B007','1984','978-0451524935','A003','Harcourt',1949,'C001',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRASKlNdsq5m9x7q7I1TbwTjn9DqxBXZ1x3vw&s'),
('B008','Rebelión en la granja','978-0451526342','A003','Signet',1945,'C001',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBfKLJzudyfyJYk_EihMK3twBUZain4SztIQ&s'),
('B009','Norwegian Wood','978-0375704024','A004','Vintage',1987,'C001',1,0,'https://pendulo.com/imagenes/7503013/750301392573.GIF'),
('B010','Kafka en la orilla','978-1400079278','A004','Alfred A. Knopf',2002,'C001',1,0,'https://www.planetadelibros.com.mx/usuaris/libros/fotos/157/m_libros/156155_kafka-en-la-orilla_9788483835241.jpg'),
('B011','1Q84','978-0307593310','A004','Harvill Secker',2009,'C001',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg8YxLaKZEHM8yr5wr-L-0BB886TIePDPH0Q&s'),
('B012','La casa de los espíritus','978-0349100031','A005','Plaza & Janés',1982,'C001',1,0,'https://images.cdn3.buscalibre.com/fit-in/360x360/f4/91/f491e0c411dc2c7e35319ab466885bbc.jpg'),
('B013','Eva Luna','978-0393306718','A005','Penguin Books',1987,'C001',1,0,'https://www.u-topicas.com/imagenes_grandes/9786073/978607383202.JPG'),
('B014','Paula','978-0060974997','A005','Harper Perennial',1994,'C001',1,0,'https://images.cdn2.buscalibre.com/fit-in/360x360/13/43/1343b49952cf24c5f3ae17b86f381531.jpg'),
('B015','El resplandor','978-0385121675','A006','Doubleday',1977,'C011',1,0,'https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/9786073813990.jpg?scale=500&qlty=75'),
('B016','It','978-0452284290','A006','Viking Penguin',1986,'C011',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B017','Misery','978-0452264476','A006','Viking Penguin',1987,'C011',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B018','Orgullo y prejuicio','978-1503290563','A007','CreateSpace',1813,'C009',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B019','Sentido y sensibilidad','978-1503298255','A007','CreateSpace',1811,'C009',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B020','Emma','978-1514644028','A007','CreateSpace',1815,'C009',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B021','Las aventuras de Tom Sawyer','978-0486287401','A008','Dover Publications',1876,'C008',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B022','Las aventuras de Huckleberry Finn','978-0486286145','A008','Dover Publications',1884,'C008',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B023','Asesinato en el Orient Express','978-0062693662','A009','HarperCollins',1934,'C008',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B024','Muerte en el Nilo','978-0062073501','A009','HarperCollins',1937,'C008',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B025','El asesinato de Roger Ackroyd','978-0062073501','A009','HarperCollins',1926,'C008',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B026','El gran Gatsby','978-0743273565','A010','Scribner',1925,'C001',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B027','Suave es la noche','978-0743273565','A010','Scribner',1934,'C001',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B028','Siddhartha','978-0553208849','A011','New Directions',1922,'C001',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s'),
('B029','El lobo estepario','978-0805210600','A011','Henry Holt and Co.',1927,'C001',1,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s');

INSERT INTO `catalog` VALUES ('2oOSucUDsylkZ','B007','Londres, 1984: el Gran Hermano controla hasta el ├║ltimo detalle de la vida privada de los ciudadanos. Winston Smith trabaja en el Ministerio de la Verdad reescribiendo y retocando la historia para un estado totalitario que somete de forma despiadada a la poblaci├│n, hasta que siente que no quiere contribuir m├ís a este sistema perverso y decide rebelarse.',1),('70WAf','B008','Los animales de la granja de los Jones se sublevan contra sus due├▒os humanos y los vencen. Pero pronto surgen entre ellos rivalidades y envidias, y algunos se al├¡an con los amos que derrocaron, traicionando su propia identidad y los intereses de su clase.',1),('ASDFGHJKLZXCVBN','B006','La trama del libro describe que un peligroso asesino, Sirius Black, se escapÔö£Ôöé de Azkaban, la prisiÔö£Ôöén de los magos, y al parecer estÔö£├¡ dispuesto a encontrar y matar a Harry. Se sabe tambiÔö£┬«n que es la primera persona en escapar de la prisiÔö£Ôöén de magos y nadie sabe cÔö£Ôöémo lo hizo.',1),('NeNtjEB','B005','Sin saber que alguien ha abierto la C├ímara de los Secretos, dejando escapar una serie de monstruos peligrosos, Harry y sus amigos Ron y Hermione tendr├ín que enfrentarse con ara├▒as gigantes, serpientes encantadas, fantasmas enfurecidos y, sobre todo, con la mism├¡sima reencarnaci├│n de su m├ís temible adversario.',1),('QWERTYUIOPASDF','B003','GarcÔö£┬ía MÔö£├¡rquez traza la historia de un amor que no ha sido correspondido por medio siglo. Aunque nunca parece estar propiamente contenido, el amor fluye a traves de la novela de mil maneras: alegre, melancÔö£Ôöélico, enriquecedor, siempre sorprendente.',1);

INSERT INTO `users` VALUES ('admin','$2b$10$/H59qNhJRDbVWtA.DIU7f.zNpA1yWWfGcEM3g4w2zL1kF/Ge0X1vi','admin','123-123-1234','correo@correo.com',0),('canizales','$2a$10$gg0gsMs9mqq3w061FuN7HuJjyumVgwQtsiXBtg/.IpFwqXixRQvcK','admin','686-123-1234','admin@email.com',0),('usuario','$2a$10$gg0gsMs9mqq3w061FuN7HuJjyumVgwQtsiXBtg/.IpFwqXixRQvcK','client','686-321-4321','client@email.com',0);

INSERT INTO `loans` VALUES ('E3a6Gy1z7XEpc1','canizales','2024-10-26','2024-11-02'),('r6J5uPNV3hT8D','canizales','2024-10-26','2024-11-02'),('rjD','canizales','2024-10-26','2024-11-02'),('u','canizales','2024-10-26','2024-11-02'),('utC','canizales','2024-10-26','2024-11-02'),('VV','canizales','2024-10-26','2024-11-02'),('zztMfI7JD0','canizales','2024-10-26','2024-11-02');

INSERT INTO `loandetails` VALUES (1,'r6J5uPNV3hT8D','B007',1),(2,'r6J5uPNV3hT8D','B008',1),(3,'rjD','B003',1),(4,'u','B006',1),(5,'E3a6Gy1z7XEpc1','B006',1),(6,'zztMfI7JD0','B005',1),(7,'utC','B003',1),(8,'VV','B007',1),(9,'VV','B008',1);

DELIMITER //

CREATE TRIGGER checkLoanCopies_beforeNewLoan BEFORE INSERT ON LoanDetails
FOR EACH ROW
BEGIN
    IF (SELECT loanCopies from Books WHERE id = NEW.bookId) + 1 > (SELECT copies FROM Books WHERE id = NEW.bookId) THEN
    BEGIN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se pueden prestar mas copias de este libro';
    END;
    ELSE
        UPDATE Books SET loanCopies = loanCopies + 1 WHERE id = NEW.bookId;
    END IF;
END;
//

CREATE TRIGGER checkLoanCopies_afterReturn AFTER UPDATE ON LoanDetails
FOR EACH ROW
BEGIN
    IF NEW.returned = TRUE AND OLD.returned = FALSE THEN
        UPDATE Books SET loanCopies = loanCopies - 1 WHERE id = NEW.bookId;
    ELSEIF NEW.returned = FALSE AND OLD.returned = TRUE THEN
        UPDATE Books SET loanCopies = loanCopies + 1 WHERE id = NEW.bookId;
    END IF;
END;
//

CREATE EVENT penalize_users
ON SCHEDULE EVERY 24 HOUR
DO
BEGIN
    -- Actualiza el campo penalized de los usuarios con libros atrasados
    UPDATE Users
    SET penalized = TRUE
    WHERE userName IN (
        SELECT u.userName
        FROM Users u
        JOIN Loans l ON u.userName = l.username
        JOIN LoanDetails ld ON l.id = ld.loanId
        WHERE ld.returned = FALSE
        AND l.returnDate < CURDATE()
    );
END;
//

DELIMITER ;