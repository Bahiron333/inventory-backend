const mongoose = require('mongoose');

//este metodo permite la conexion con mongo
const connectionDB = async () => { 
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connexion a mongol");
    }catch(error){
       console.log("Error en la conexion con la base de datos");
       process.exit(1); //detiene la app si falla la conexion
    }
}

module.exports = connectionDB;