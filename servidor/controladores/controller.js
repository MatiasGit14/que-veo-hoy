const connection = require("../lib/conexionbd");
var controller = {
    peliculas: (req, res) => {
        connection.query('SELECT * FROM pelicula', (error, results, fields) => {
            if (error) throw error;
            res.json({ peliculas: results });
        })

    }
};

module.exports = controller;