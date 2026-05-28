const mongoose = require('mongoose');
const validator = require('validator')

let ShemaCliente = new mongoose.Schema({
    descripcion:{
        type: String,
        lowercase: true,
    },

    correo:{
        type: String,
        required: true,
        lowercase: true,
        validate: (value)=>{
            return validator.isEmail(value)
        }
    },

    nombre:{
        type: String,
        required: true,
        lowercase: true,
    },

    numero:{
        type: String,
        required: false,
        validate: (value)=>{
            return validator.isNumeric(value)
        }
    },

    nit:{
        type: String,
        required: false,
        lowercase: true,
    },

    codigo:{
        type: String,
        required:true,
        unique:true
    },

    id_representante:{
        type: String,
        required:true,
        lowercase:true,
    }
    
},{timestamps:true})//fecha de creacion y modificacion

module.exports = mongoose.model('cliente',ShemaCliente);