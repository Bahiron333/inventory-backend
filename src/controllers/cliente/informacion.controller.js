const clienteModel = require("../../models/cliente.modelo");
const permiso = require("../../models/permisos.modelo");
const user = require("../../models/user.modelo");

exports.informacion = async (req,res)=>{
    try{
        const idUser = req.params.id;
        const idCliente = req.params.idCliente;
        let cliente = {};
        const permisos = await permiso.findOne({id_user:idUser,id_empresa:idCliente});
        const clienteBD = await clienteModel.findById(idCliente);
        const representante = await user.findById(clienteBD.id_representante).select('nombre');

        cliente = {
            "nombre":clienteBD.nombre,
            "descripcion":clienteBD.descripcion,
            "correo":clienteBD.correo,
            "nit":clienteBD.nit,
            "id_representante":clienteBD.id_representante,
            "representante": representante.nombre,
            "id":clienteBD._id.toString(),
            "codigo":clienteBD.codigo,
            "fecha_asociacion":permisos.createdAt.toISOString().split('T')[0],
            "cantidadUsuario":0,
            "cantidadActivos":0
        }

        const userRole = permisos.role;

        return res.status(200).json({cliente,userRole});

    }catch(err){
        console.log(err);
        return res.status(500).json({mensaje:"hubo un error en obtener la informacion"})
    }
}