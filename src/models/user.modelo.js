const mongoose = require('mongoose');
const validator = require('validator')

let ShemaRegister = new mongoose.Schema({
    correo:{
        type: String,
        required: true,
        unique: true,
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

    direccion:{
        type: String,
        required: false,
        lowercase: true,
    },

    passwordHash:{
        type: String,
        required: true,    
    },

},{timestamps:true})//fecha de creacion y modificacion

module.exports = mongoose.model('users',ShemaRegister);