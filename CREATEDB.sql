DROP DATABASE IF EXISTS booksCenter;

CREATE DATABASE booksCenter;

USE booksCenter;

CREATE TABLE Authors(
    id VARCHAR(15) PRIMARY KEY,
    fullName VARCHAR(100),
    nationality VARCHAR(50)
);

CREATE TABLE Categories(
    id VARCHAR(15) PRIMARY KEY,
    descr VARCHAR(100)
);

CREATE TABLE Books(
    id VARCHAR(15) PRIMARY KEY,
    title VARCHAR(100),
    isbn VARCHAR(18),
    author VARCHAR(15),
    publisher VARCHAR(100),
    publishYear INT,
    category VARCHAR(15),
    copies INT,
    imageUrl VARCHAR(255) DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s',
    FOREIGN KEY (author) REFERENCES Authors(id) ON DELETE SET NULL,
    FOREIGN KEY (category) REFERENCES Categories(id) ON DELETE SET NULL
);

CREATE TABLE Users(
    userName VARCHAR(30) PRIMARY KEY,
    userPassword VARCHAR(100),
    usertype VARCHAR(15)
);


INSERT INTO Users(userName, userPassword, usertype) VALUES 
('canizales', '$2a$10$gg0gsMs9mqq3w061FuN7HuJjyumVgwQtsiXBtg/.IpFwqXixRQvcK', 'admin'),
('usuario', '$2a$10$gg0gsMs9mqq3w061FuN7HuJjyumVgwQtsiXBtg/.IpFwqXixRQvcK', 'client');


INSERT INTO Authors (id, fullName, nationality) VALUES
('A001', 'Gabriel García Marquez', 'Colombiano'),
('A002', 'J.K. Rowling', 'Britanica'),
('A003', 'George Orwell', 'Britanico'),
('A004', 'Haruki Murakami', 'Japones'),
('A005', 'Isabel Allende', 'Chilena'),
('A006', 'Stephen King', 'Estadounidense'),
('A007', 'Jane Austen', 'Britanica'),
('A008', 'Mark Twain', 'Estadounidense'),
('A009', 'Agatha Christie', 'Britanica'),
('A010', 'F. Scott Fitzgerald', 'Estadounidense'),
('A011', 'Hermann Hesse', 'Aleman'),
('A012', 'Leo Tolstoy', 'Ruso'),
('A013', 'Franz Kafka', 'Aleman'),
('A014', 'Paulo Coelho', 'Brasileño'),
('A015', 'Chimamanda Ngozi Adichie', 'Nigeriana');

INSERT INTO Categories (id, descr) VALUES
('C001', 'Ficcion'),
('C002', 'No Ficcion'),
('C003', 'Ciencia'),
('C004', 'Historia'),
('C005', 'Fantasia'),
('C006', 'Biografia'),
('C007', 'Autoayuda'),
('C008', 'Misterio'),
('C009', 'Romantico'),
('C010', 'Ciencia Ficcion'),
('C011', 'Terror'),
('C012', 'Clasicos'),
('C013', 'Cultura'),
('C014', 'Politica'),
('C015', 'Religion');

-- Libros de Gabriel García Márquez
INSERT INTO Books (id, title, isbn, author, publisher, publishYear, category, copies) VALUES
('B001', 'Cien años de soledad', '978-0060883287', 'A001', 'Random House', 1967, 'C001', 10),
('B002', 'El otoño del patriarca', '978-0307389730', 'A001', 'Vintage', 1975, 'C001', 8),
('B003', 'El amor en los tiempos del cólera', '978-0307389730', 'A001', 'Vintage', 1985, 'C001', 7),

-- Libros de J.K. Rowling
('B004', 'Harry Potter y la piedra filosofal', '978-0747532699', 'A002', 'Bloomsbury', 1997, 'C005', 15),
('B005', 'Harry Potter y la cámara secreta', '978-0747538493', 'A002', 'Bloomsbury', 1998, 'C005', 14),
('B006', 'Harry Potter y el prisionero de Azkaban', '978-0747542155', 'A002', 'Bloomsbury', 1999, 'C005', 13),

-- Libros de George Orwell
('B007', '1984', '978-0451524935', 'A003', 'Harcourt', 1949, 'C001', 8),
('B008', 'Rebelión en la granja', '978-0451526342', 'A003', 'Signet', 1945, 'C001', 9),

-- Libros de Haruki Murakami
('B009', 'Norwegian Wood', '978-0375704024', 'A004', 'Vintage', 1987, 'C001', 12),
('B010', 'Kafka en la orilla', '978-1400079278', 'A004', 'Alfred A. Knopf', 2002, 'C001', 11),
('B011', '1Q84', '978-0307593310', 'A004', 'Harvill Secker', 2009, 'C001', 10),

-- Libros de Isabel Allende
('B012', 'La casa de los espíritus', '978-0349100031', 'A005', 'Plaza & Janés', 1982, 'C001', 9),
('B013', 'Eva Luna', '978-0393306718', 'A005', 'Penguin Books', 1987, 'C001', 8),
('B014', 'Paula', '978-0060974997', 'A005', 'Harper Perennial', 1994, 'C001', 7),

-- Libros de Stephen King
('B015', 'El resplandor', '978-0385121675', 'A006', 'Doubleday', 1977, 'C011', 11),
('B016', 'It', '978-0452284290', 'A006', 'Viking Penguin', 1986, 'C011', 10),
('B017', 'Misery', '978-0452264476', 'A006', 'Viking Penguin', 1987, 'C011', 12),

-- Libros de Jane Austen
('B018', 'Orgullo y prejuicio', '978-1503290563', 'A007', 'CreateSpace', 1813, 'C009', 14),
('B019', 'Sentido y sensibilidad', '978-1503298255', 'A007', 'CreateSpace', 1811, 'C009', 13),
('B020', 'Emma', '978-1514644028', 'A007', 'CreateSpace', 1815, 'C009', 12),

-- Libros de Mark Twain
('B021', 'Las aventuras de Tom Sawyer', '978-0486287401', 'A008', 'Dover Publications', 1876, 'C008', 13),
('B022', 'Las aventuras de Huckleberry Finn', '978-0486286145', 'A008', 'Dover Publications', 1884, 'C008', 12),

-- Libros de Agatha Christie
('B023', 'Asesinato en el Orient Express', '978-0062693662', 'A009', 'HarperCollins', 1934, 'C008', 10),
('B024', 'Muerte en el Nilo', '978-0062073501', 'A009', 'HarperCollins', 1937, 'C008', 11),
('B025', 'El asesinato de Roger Ackroyd', '978-0062073501', 'A009', 'HarperCollins', 1926, 'C008', 9),

-- Libros de F. Scott Fitzgerald
('B026', 'El gran Gatsby', '978-0743273565', 'A010', 'Scribner', 1925, 'C001', 12),
('B027', 'Suave es la noche', '978-0743273565', 'A010', 'Scribner', 1934, 'C001', 10),

-- Libros de Hermann Hesse
('B028', 'Siddhartha', '978-0553208849', 'A011', 'New Directions', 1922, 'C001', 7),
('B029', 'El lobo estepario', '978-0805210600', 'A011', 'Henry Holt and Co.', 1927, 'C001', 8),

-- Libros de Leo Tolstoy
('B030', 'Guerra y paz', '978-0143039990', 'A012', 'Penguin Classics', 1869, 'C004', 6),
('B031', 'Anna Karenina', '978-0143035008', 'A012', 'Penguin Classics', 1877, 'C001', 7),

-- Libros de Franz Kafka
('B032', 'El proceso', '978-0805202419', 'A013', 'Schocken Books', 1925, 'C001', 8),
('B033', 'La metamorfosis', '978-0553211440', 'A013', 'New Directions', 1915, 'C001', 9),

-- Libros de Paulo Coelho
('B034', 'El alquimista', '978-0061122415', 'A014', 'HarperOne', 1988, 'C009', 14),
('B035', 'Brida', '978-0061724830', 'A014', 'HarperOne', 1990, 'C009', 12),

-- Libros de Chimamanda Ngozi Adichie
('B036', 'Americanah', '978-0307455925', 'A015', 'Knopf', 2013, 'C009', 10),
('B037', 'Medio sol amarillo', '978-0307455703', 'A015', 'Knopf', 2006, 'C001', 11),
('B038', 'Querida Ijeawele', '978-0525434778', 'A015', 'Knopf', 2017, 'C001', 9);