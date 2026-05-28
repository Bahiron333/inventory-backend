const mongoose = require("mongoose");
const validator = require("validator");

let fotoSchema = new mongoose.Schema({
    idCliente: {
        type:String,
        required:true
    },
    imagen: {
        data: Buffer,
        contentType: String
    },
});

module.exports = mongoose.model("fotos",fotoSchema);