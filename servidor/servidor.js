//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var control = require("./controladores/controller");
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';
app.get('/peliculas', control.getPeliculas);
app.get('/generos', control.getGeneros);
app.get('/peliculas/recomendacion', control.getRecomendar);
app.get('/peliculas/:id', control.getInformacionPeliculas);


app.listen(puerto, function() {
    console.log("Escuchando en el puerto " + puerto);
});