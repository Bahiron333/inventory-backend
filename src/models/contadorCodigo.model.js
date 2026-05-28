const mongoose  = require("mongoose");

let SchermaContador = new mongoose.Schema({

    nombre:{
        type:String,
    },
    
    contador:{
        type:Number
    }
});

module.exports = mongoose.model('contadore',SchermaContador)