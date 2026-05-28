const cliente = require("../../models/cliente.modelo");
const permiso = require("../../models/permisos.modelo");
const users = require("../../models/user.modelo");

exports.mostrarCliente = async (req,res) => {
    try{
        let clientes = []; //datos a enviar
        let user = {};
        let contadorClientes = 0;
        const idUser = req.params.id;
        const idClientes = await permiso.find({id_user:idUser});

        for(const [key,value] of Object.entries(idClientes)){
            
            const clienteBD = await cliente.findById(value.id_empresa) || null;
            const permisos = await permiso.findOne({id_user:idUser,id_empresa:value.id_empresa});
            const representante = await users.findById(clienteBD.id_representante).select('nombre');
            clientes[contadorClientes] = {
                "representante": representante.nombre,
                "id":clienteBD._id.toString(),
                "nombre":clienteBD.nombre,
                "nit":clienteBD.nit,
                "fecha_asociacion":permisos.createdAt.toISOString().split('T')[0],
            }

            user[value.id_empresa] = {
                "role": permisos.role
            }
             
            contadorClientes++;
        };

        return res.status(200).json({user,clientes});

    }catch(err){
        console.log(err);
        return res.status(500).json({mensaje:err})
    }
}