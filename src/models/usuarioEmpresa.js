const mongoose = require('mongoose');
const validator = require('validator')

let ShemaUsuarioEmpresa = new mongoose.Schema({
    correo:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value)=>{
            return validator.isEmail(value)
        }
    },

    id_empresa:{
        type: String,
        required: true,
    },

    nombre:{
        type: String,
        required: true,
        lowercase: true,
    },

    direccion:{
        type: String,
        required: false,
        lowercase: true,
    },

    departamento:{
        type: String,
        required: false, 
        lowercase: true   
    },

    estado:{
        type: String,
        required: true, 
        lowercase: true  
    },

    id_miembro:{
        type: String,
        required: false, 
    }

},{timestamps:true})//fecha de creacion y modificacion

module.exports = mongoose.model('usuarioEmpresa',ShemaUsuarioEmpresa);