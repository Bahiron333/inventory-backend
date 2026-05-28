const mongoose = require('mongoose');

let ShemaAtributosExtras = new mongoose.Schema({

    nombre:{
        type: String,
        required: true,
        lowercase: true,
    },

    multiple_valor:{
        type: Boolean,
        required: true,
        default: false
    },

    id_inventario:{
        type: String,
        required: true,
    }

},{timestamps:true})//fecha de creacion y modificacion

module.exports = mongoose.model('atributosExtras',ShemaAtributosExtras);