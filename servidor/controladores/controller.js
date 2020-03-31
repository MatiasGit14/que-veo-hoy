const connection = require("../lib/conexionbd");
var controller = {
    getPeliculas: (req, res) => {
        //Variables para almacenar los valores de los parametros de cada query
        let anio = req.query.anio;
        let genero = req.query.genero;
        let titulo = req.query.titulo;
        let orden = req.query.columna_orden;
        let tipo = req.query.tipo_orden;
        let cantidad = req.query.cantidad;
        let pagina = req.query.pagina;

        // Variables para gardar las consultas y no repetir tanto codigo
        let sql = 'SELECT * FROM pelicula';
        let countSql = 'SELECT count(*) as total FROM pelicula';

        // Array de los parametros que carga el usuario
        let parametros = [];

        // FILTROS 
        if (anio && genero && titulo) {
            sql += ' WHERE genero_id = ? AND anio = ? AND titulo LIKE ? ';
            countSql += ' WHERE genero_id = ? AND anio = ? AND titulo LIKE ? '; // indico parametros de la query con ? para pasarle los parametros segun lo ingresado en el front
            parametros = [parseInt(genero), parseInt(anio), '%' + titulo + '%'];
        } else if (anio && genero) {
            sql += ' WHERE anio = ? AND genero_id = ?';
            countSql += ' WHERE anio = ? AND genero_id = ?';
            parametros = [parseInt(anio), parseInt(genero)];
        } else if (anio && titulo) {
            sql += ' WHERE anio = ? AND titulo LIKE ?';
            countSql += ' WHERE anio = ? AND titulo LIKE ?';
            parametros = [parseInt(anio), '%' + titulo + '%'];
        } else if (genero && titulo) {
            sql += ' WHERE genero_id = ? AND titulo LIKE ?';
            countSql += ' WHERE genero_id = ? AND titulo LIKE ?';
            parametros = [parseInt(genero), '%' + titulo + '%'];
        } else if (anio) {
            sql += ' WHERE anio = ?';
            countSql += ' WHERE anio = ?';
            parametros = [parseInt(anio)];
        } else if (genero) {
            sql += ' WHERE genero_id = ?';
            countSql += ' WHERE genero_id = ?';
            parametros = [parseInt(genero)];
        } else if (titulo) {
            sql += " WHERE titulo LIKE ?";
            countSql += " WHERE titulo LIKE ?";
            parametros = ['%' + titulo + '%']; // indico que el parametro de la query puede ser parecido a con los %
        };
        if (orden && tipo) {
            sql += ' ORDER BY ' + orden + ' ' + tipo;
        };
        if (cantidad && parseInt(pagina) >= 1) {
            let offset = (parseInt(pagina) - 1) * parseInt(cantidad); // COn esta operacion matematica guardo en la variable Offset la cantidad de resultados que ya mostre
            sql += ' LIMIT ? OFFSET ? '; // con el LIMIT indico a partir de que fila contar, con el offset la cantidad de filas que quiero
            parametros.push(parseInt(cantidad)); // pusheo el resultado para que empiece desde la cantidad por pagina anterior
            parametros.push(offset); // pusheo la cantidad de filas que ya traje para que contine con las que siguen
        };

        connection.query(
            sql, //callback function con las query segun los filtros
            parametros, //[] Parametros de los filtros por url
            (error, results, fields) => {
                if (error) console.error(error);

                connection.query(
                    countSql, // callback function con la query para contar si es que primero pasa los demas filtros
                    parametros, // vuelvo a pasar los parametros de los filtros que vienen por url
                    (error, resultsCount, fields) => {
                        if (error) console.error(error);
                        res.json({ peliculas: results, total: resultsCount[0].total }); // cambio el nombre de la variable resultados por resultsCount y como devuelve un array de filas selecciono la primera[0] y accedo a su valor .total
                    }
                );
            }
        )
    },
    getGeneros: (req, res) => {
        connection.query('SELECT * FROM genero', (error, results, fields) => {
            if (error) throw error;
            res.json({ generos: results });
        })
    },
    getInformacionPeliculas: (req, res) => {
        let id = req.params.id;

        connection.query(
            'SELECT * FROM pelicula WHERE id = ?', [id],
            (error, peliculas, fields) => {
                if (error) return console.error(error);
                if (peliculas.length > 0) {
                    let pelicula = peliculas[0];
                    let generoId = pelicula.genero_id;

                    connection.query(
                        'SELECT * FROM genero WHERE id = ?', [generoId],
                        (error, generos, fields) => {
                            if (error) return console.error(error);
                            let genero = generos[0];

                            connection.query(
                                'SELECT a.* FROM actor_pelicula ap JOIN actor a ON a.id = ap.actor_id WHERE ap.pelicula_id = ?', [id],
                                (error, actores, fields) => {
                                    if (error) return console.error(error);
                                    res.json({
                                        pelicula: pelicula,
                                        actores: actores,
                                        genero: genero
                                    });
                                }
                            );
                        }
                    );
                } else {
                    res.status(404).send();
                }
            }
        );
    },
    getRecomendar: (req, res) => {
        let genero = req.query.genero;
        let anio_inicio = req.query.anio_inicio;
        let anio_fin = req.query.anio_fin;
        let puntuacion = req.query.puntuacion;
        let sql = 'SELECT * FROM pelicula p JOIN genero g ON g.id = p.genero_id ';
        let parametros = [];

        const concatenar = (parametros) => {
            if (parametros.length > 0) {
                return ' AND ';
            } else {
                return ' WHERE ';
            }
        }

        if (genero) {
            sql += ' WHERE g.nombre = ? ';
            parametros.push(genero);
        }
        if (anio_inicio) {
            sql += concatenar(parametros) + ' p.anio > ? ';
            parametros.push(parseInt(anio_inicio));
        }
        if (anio_fin) {
            sql += concatenar(parametros) + ' p.anio < ? ';
            parametros.push(parseInt(anio_fin));
        }
        if (puntuacion) {
            sql += concatenar(parametros) + ' p.puntuacion > ? ';
            parametros.push(parseInt(puntuacion));
        }

        connection.query(
            sql,
            parametros,
            (error, results, fields) => {
                if (error) console.error(error);
                res.json({ peliculas: results });
            }
        );

    },
}


module.exports = controller;