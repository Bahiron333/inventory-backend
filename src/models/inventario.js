const mongoose = require('mongoose');

let ShemaInventario = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        lowercase: true,
    },

    tipo:{
        type: String,
        required: false,
        lowercase: true
    },

    numero_minimo_stock:{
        type: Number,
        required: true,
    },

    id_empresa:{
        type: String,
        required: true,
    },

    cantidad:{
        type: Number,
        required: true,
        default: 0
    },

},{timestamps:true})//fecha de creacion y modificacion

module.exports = mongoose.model('inventario',ShemaInventario);