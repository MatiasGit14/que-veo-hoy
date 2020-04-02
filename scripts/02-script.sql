/*CREAR ESTA TABLA GENERO*/

CREATE TABLE genero (
id INT NOT NULL AUTO_INCREMENT,
nombre VARCHAR(30),
PRIMARY KEY(id)
);

/* INSERTAR SCRIPT DE SCRIPT-PASO-2 SOLO LOS INSERT DE GENERO */

/* MODIFICAR LA TABLA PELICULA AGREGANDO LA COLUMNA GENERO_ID*/
ALTER TABLE pelicula
  ADD COLUMN genero_id INT NOT NULL;

/*INSERTAR LOS UPDATES DEL SCRIPT-PASO-2 PARA LA TABLA PELICULA*/

/*MODIFICAR LA TABLA PELICULA HACIENDO LA COLUMNA GENERO_ID LA FOREIGN KEY*/
  ALTER TABLE pelicula
  ADD FOREIGN KEY (genero_id) REFERENCES genero(id);