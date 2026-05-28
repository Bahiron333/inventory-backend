const mongoose = require("mongoose");
const validator = require("validator");

let codigoSchema = new mongoose.Schema({
    codigo:{
        type:Number,
        required:true,
        unique:false,
    },
    correo:{
        type: String,
        required: true,
        unique: false,
        lowercase: true,
        validate: (value)=>{
            return validator.isEmail(value)
        }
    },
});

module.exports = mongoose.model("CodigoRegistro",codigoSchema);