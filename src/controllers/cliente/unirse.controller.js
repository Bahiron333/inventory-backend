const cliente = require("../../models/cliente.modelo");
const permiso = require("../../models/permisos.modelo");

exports.unirseCliente = async (req,res)=>{
    try{
        const {codigo} = req.body;
        const empresa = await cliente.findOne({codigo:codigo});

        if(!empresa){
            return res.status(404).json({menssage:"empresa no encontrada"});
        }else{

            const idUsuario = req.params.id; //obteniemos el id del usuario 
            const result = await permiso.findOne({id_user:idUsuario,id_empresa:empresa._id});

            //esto valida que el usuario no este unido a una empresa 
            if(result) return res.status(200).json({menssage:"Ya estas unido a esta empresa"});

            const permisoUsuario = new permiso({
            id_user: req.params.id,
            id_empresa: empresa._id,
            role:"usuario",
            estado:"activo",
            area:"",
            suspendido:false,
            usuarios:{
                ver: false,
                modificar: false,
                eliminar:false
            },
            inventario:{
                ver: false,
                modificar: false,
                eliminar:false
            },
                miembros:{
                ver: false,
                modificar: false,
                eliminar:false
            }
                            
            });
            req.idUsuario =  empresa._id;
            permisoUsuario.save();
            return res.status(200).json({menssage:"Los datos fueron recibidos exitosamente"});
        }       
    }catch(err){
        console.log(err);
        return res.status(500).json("Error en mostrar los miembros")
    }
}