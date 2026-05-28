const mongoose = require("mongoose");

let permisoScherma = new mongoose.Schema({

    id_user:{type:String,required:true},

    id_empresa:{type:String,required:true},
    
    estado:{type:String,required:true},
    
    suspendido:{type:Boolean,required:true},

    area:{type:String},

    role:{type:String,required:true},

    usuarios:{
        ver: {type:Boolean,default:false},
        modificar: {type:Boolean,default:false},
        eliminar:{type:Boolean,default:false}
      },

    inventario:{
        ver: {type:Boolean,default:false},
        modificar: {type:Boolean,default:false},
        eliminar:{type:Boolean,default:false}
      },
      
    miembros:{
        ver: {type:Boolean,default:false},
        modificar: {type:Boolean,default:false},
        eliminar:{type:Boolean,default:false}
      }


},{timestamps:true});

module.exports = mongoose.model('permiso',permisoScherma);