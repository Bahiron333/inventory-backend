const express = require('express'); //para instalar express
const cors = require('cors') //el cors permite el acesso de las paginas que emiten una solicitud
const app = express(); //app del backend
const connectionDB = require('./config/dbs')

//usamos router para el enrutamiento de solicitudes
const routers = require('./routers/index'); 

app.use(express.json()); //permite el manejo de archivos json
app.use(cors()); //usamos el cors
connectionDB();//Conexion a la base de datos 
app.use('/',routers) //End point de la api

//exportamos la app
module.exports = app;