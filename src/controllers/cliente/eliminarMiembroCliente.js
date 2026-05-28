const permiso = require("../../models/permisos.modelo")
exports.eliminarUsuarioCliente = async (req,res) => {

    try{
        const idUsuario = req.params.id;
        const {id_cliente} = req.body;

        let result = await permiso.deleteOne({id_user:idUsuario,id_empresa:id_cliente});

        console.log(result)
        return res.status(200).json({mensaje:"Usuario eliminado exitosamente"});

    }catch(err){
        console.log(err);
        return res.status(200).json({mensaje:"el Usuario no fue eliminado"});
    }
}