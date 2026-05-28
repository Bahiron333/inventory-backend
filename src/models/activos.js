const mongoose = require('mongoose');

let ShemaActivos = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        lowercase: true,
    },

    estado:{
        type: String,
        required: true,
        lowercase: true,
    },

    cantidad_usuarios:{
        type: Number,
        required: true,
        default: 1
    },

    id_categoria:{
        type: String,
        required: false,
        lowercase: true
    },

    id_usuarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false // puede empezar vacío
    }],
    
    id_empresa:{
        type: String,
        required: true,
    },

    campos_adicionales:{
       type: Array,
       required:false
    },


},{timestamps:true})//fecha de creacion y modificacion

module.exports = mongoose.model('activos',ShemaActivos);