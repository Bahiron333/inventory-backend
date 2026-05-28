const clienteModel = require("../../../models/cliente.modelo");
const permiso = require("../../../models/permisos.modelo");
const user = require("../../../models/user.modelo");

let verMiembros = async (req,res) => {

    try{
        const idCliente = req.params.idcliente;
        let contador = 0;
        console.log(idCliente)
        const idMiembrosAsociados = await permiso.find({id_empresa:idCliente}).select('id_user');
        let miembros = [];
        for(const [key,value] of Object.entries(idMiembrosAsociados)){
            let usuario = await user.findById(value.id_user);
            let permisos = await permiso.findOne({id_empresa:idCliente,id_user:value.id_user});
            miembros[contador] = {
                "id": usuario._id,
                "nombre":usuario.nombre,
                "estado":permisos.estado,
                "area":permisos.area,
                "rol":permisos.role,
                "correo":usuario.correo
            }
            contador++;
        } 
        return res.status(200).json({miembros});            
    }catch(err){
        console.log(err.error);
        return res.status(500).json({menssage:"error en mostrar miembros"});
    }
}

let informacionMiembros = async (req,res)=>{
    try{

      const id = req.params.idMiembro;
      const idCliente = req.params.idCliente;
      const permisosMiembro = await permiso.findOne({id_empresa:idCliente,id_user:id}); //Permisos del miembro
      const infMiembro = await user.findById(id); //informacion del miembro 

      let miembro = {
            id: id,
            nombre: infMiembro.nombre,
            correo: infMiembro.correo,
            estado: permisosMiembro.estado,
            suspendido: permisosMiembro.suspendido,
            rol: permisosMiembro.role,
            area: permisosMiembro.area,
            permisos: [
                usuario = permisosMiembro.usuarios,
                inventario = permisosMiembro.inventario,
                miembros = permisosMiembro.miembros
            ]
      }
      return res.status(200).json({miembro});
      
    }catch(err){
        return res.status(500).json({menssage:"error en mostrar miembros"});
    }
}


let updateMiembros = async (req,res)=>{
    
    try{
      const {miembro} = req.body;
      const idCliente = req.params.idCliente;
      const permisosMiembro = await permiso.findOneAndUpdate({id_empresa:idCliente,id_user:miembro.id},
        {
            $set:{
                suspendido:miembro.suspendido,
                estado: miembro.suspendido ? "suspendido" : "activo",
                role:miembro.rol,
                area:miembro.area,
                usuarios:miembro.permisos[0],
                inventario: miembro.permisos[1],
                miembros: miembro.permisos[2]
            }
        }, 
        {new:true}); //Permisos del miembro

      return res.status(200).json({mensaje:"miembro actualizado exitosamente"});
      
    }catch(err){
        console.log(err.error);
        return res.status(500).json({menssage:"error en mostrar miembros"});
    }
}

let permisosMiembro = async (req,res)=>{

    try{   
        const id = req.params.idMiembro;
        const {idCliente} = req.params;
        const permisosMiembro = await permiso.findOne({"id_empresa":String(idCliente),"id_user":String(id)}); //Permisos del miembro
        let miembro = {
                suspendido: permisosMiembro.suspendido,
                rol: permisosMiembro.role,
                area: permisosMiembro.area,
                permisos: [
                    usuario = permisosMiembro.usuarios,
                    inventario = permisosMiembro.inventario,
                    miembros = permisosMiembro.miembros
                ]
        }

        return res.status(200).json({miembro});
    }catch(err){
        console.log(err);
        return res.status(500).json({menssage:"error en ver permisos miembro"});
    }
}


module.exports = {
    verMiembros,
    informacionMiembros,
    updateMiembros,
    permisosMiembro
}