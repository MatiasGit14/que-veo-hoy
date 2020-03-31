CREATE database que_veo_hoy;
USE que_veo_hoy;
CREATE TABLE pelicula (
id INT NOT NULL AUTO_INCREMENT,
titulo VARCHAR(100) NOT NULL,
duracion INT(5),
director VARCHAR(400),
anio INT(5),
fecha_lanzamiento DATE,
puntuacion INT(2),
poster VARCHAR(300),
trama VARCHAR(700),
PRIMARY KEY(id)
);

CREATE TABLE genero (
id INT NOT NULL AUTO_INCREMENT,
nombre VARCHAR(30),
PRIMARY KEY(id)
);

ALTER TABLE pelicula
  ADD COLUMN genero_id INT NOT NULL;

  ALTER TABLE pelicula
  ADD FOREIGN KEY (genero_id) REFERENCES genero(id);
  
    
CREATE TABLE actor (
id INT NOT NULL AUTO_INCREMENT,
nombre VARCHAR(70),
PRIMARY KEY(id)
);


CREATE TABLE actor_pelicula (
id INT NOT NULL AUTO_INCREMENT,
actor_id INT NOT NULL,
pelicula_id INT NOT NULL,
PRIMARY KEY(id)
);

