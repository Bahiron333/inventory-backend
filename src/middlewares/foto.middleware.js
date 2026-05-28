const multer = require("multer");

const storage = multer.memoryStorage() //lo guarda en la memoria del servidor 
const upload = multer({storage}); //sube el archivo 

module.exports = upload;