CREATE DATABASE IF NOT EXISTS Proyecto;
USE Proyecto;
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    secquestion VARCHAR(255),
    secanswer VARCHAR(255),
    role VARCHAR(255)
);
CREATE TABLE Carritos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

CREATE TABLE PersonajesCarrito (
  id INT PRIMARY KEY AUTO_INCREMENT,
  carrito_id INT,
  nombre_personaje VARCHAR(255),
  imagen_personaje VARCHAR(255),
  FOREIGN KEY (carrito_id) REFERENCES Carritos(id)
);
SET SQL_SAFE_UPDATES = 0;

ALTER TABLE PersonajesCarrito
ADD COLUMN precio INT AFTER id;

DELETE FROM Proyecto.PersonajesCarrito WHERE ID;

ALTER TABLE Usuarios
ADD COLUMN calle VARCHAR(255),
ADD COLUMN colonia VARCHAR(255),
ADD COLUMN codigo_postal VARCHAR(10),
ADD COLUMN municipio_delgacion VARCHAR(255),
ADD COLUMN estado VARCHAR(255),
ADD COLUMN telefono VARCHAR(20),
ADD COLUMN num_tarjeta VARCHAR(20),
ADD COLUMN fecha_expiracion VARCHAR(10),
ADD COLUMN cvv VARCHAR(4);
