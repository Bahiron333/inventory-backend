const user = require("../../models/user.modelo");

exports.infUsuario = async (req,res) =>{
    try{
        const idUser = req.params.id;
        const inf_user = await user.findById(idUser);

        const envio_user = {
            "nombre":inf_user.nombre,
            "correo":inf_user.correo,
        }
    
        return res.status(200).json({envio_user});
    
    }catch(err){
        console.log(err);
        return res.status(500).json({mensaje:"hubo un error en obtener la informacion"})
    }
}