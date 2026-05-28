const user = require("../../../models/usuarioEmpresa");
const mongoose = require('mongoose');
const activoDB = require("../../../models/activos");
const inventario = require("../../../models/inventario");

let crearUsuario = async (req,res)=>{
   try{
        const {infUsuario, activosAgregados} = req.body;
        const {idCliente} = req.params;

        const usuarioAgregado = new user({
            nombre:infUsuario.nombre,
            direccion:infUsuario.direccion,
            departamento:infUsuario.area,
            estado:infUsuario.estado,
            correo:infUsuario.correo,
            id_empresa: idCliente
        });

        await usuarioAgregado.save();

        await guardarUsuarioActivo(activosAgregados,usuarioAgregado._id)

        return res.status(200).json("El usuario se creo exitosamente");   
    }catch(err){
        console.log("error en guardar el usuario");
        console.log(err)
        return res.status(500).json({menssage:"error en crear usuario"});
    }
}

let guardarUsuarioActivo = async (activos,id) =>{
    //guarda el id del usuario a cada activo que este fue asigando
    for(const activoId of activos) {
        try {
            await activoDB.findOneAndUpdate(
                { '_id': new mongoose.Types.ObjectId(activoId) },
                { $addToSet: { id_usuarios: id } }, // evita duplicados
                { new: true }
                );
        } catch (err) {
             console.error(`Error actualizando activo con ID ${activoId}:`, err.message);
        }
    }
}

let verUsuarios = async (req,res)=>{
    
    try{
        const {idCliente} = req.params;

        const usuarios = await user.find({ id_empresa: idCliente }).select("_id nombre departamento estado createdAt");

        const resultado = await Promise.all(
            usuarios.map(async (u) => {
                
                const cantidadActivos = await activoDB.find({'id_usuarios':u._id}).select('_id');
                return {
                    id: u._id,
                    nombre: u.nombre?.trim().replace(/,$/, ""),         // limpia comas y espacios
                    departamento: u.departamento?.trim().replace(/,$/, ""),
                    estado: u.estado,
                    fecha: u.createdAt.toISOString().split("T")[0], 
                    activos: (cantidadActivos.length == 0) ? "sin activos" : cantidadActivos.length
            }})
        );
        
        if(!usuarios) return res.status(404).json("no hay usuarios")

        return res.status(200).json({users:resultado});
      
    }catch(err){
        console.log("error en");
        return res.status(500).json({menssage:"error en mostrar usuario"});
    }
}


let verUsuario = async (req,res)=>{
   try{
        const {idCliente, id} = req.params;
        const usuario = await user.findOne({_id:id,id_empresa:idCliente}).select("_id nombre correo departamento direccion estado createdAt");

        const result = usuario.toObject();
        result['fecha'] = result.createdAt.toISOString().split("T")[0];
        
        if(!usuario) return res.status(404).json("no hay usuario")

        return res.status(200).json({user:result});
      
    }catch(err){
        console.log("error en: "+err);
        return res.status(500).json({menssage:"error en mostrar usuario"});
    }
}

let updateUser = async(req,res)=>{
       try{
        const {idCliente} = req.params;
        const {userInf} = req.body;
        const usuario = await user.findOneAndUpdate({_id:userInf._id,id_empresa:idCliente},
            {
                $set:{
                    nombre: userInf.nombre,
                    direccion: userInf.direccion,
                    departamento: userInf.departamento,
                    correo: userInf.correo,
                    estado: userInf.estado
                }

            },{new:true}
        );

        if(!usuario) return res.status(404).json("no hay usuario")

        return res.status(200).json("El usuario fue modificado exitosamente");
      
    }catch(err){
        console.log("error en: "+err);
        return res.status(500).json({menssage:"error en modificar usuario"});
    }
}

let verActivosUser = async (req,res) =>{
     try{
         const { id } = req.params;

        const activos = await activoDB
        .find({ id_usuarios: new mongoose.Types.ObjectId(id) })
        .select("nombre _id estado id_categoria");

        if (!activos.length) {
            return res.status(404).json({ mensaje: "El usuario no tiene activos asignados." });
        }

        const idsCategorias = [...new Set(activos.map(a => a.id_categoria.toString()))];

        const categorias = await inventario
        .find({ _id: { $in: idsCategorias } })
        .select("nombre tipo");

        const resultado = activos.map(activo => {
        const categoria = categorias.find(c => c._id.toString() === activo.id_categoria.toString());
        return {
            _id: activo._id,
            nombre: activo.nombre,
            estado: activo.estado,
            categoria: categoria ? categoria.nombre : "Sin categoría",
            tipo: categoria ? categoria.tipo : null
        };
    });

    return res.status(200).json({ activos: resultado });

    }catch(err){
        console.log("error en: "+err);
        return res.status(500).json({menssage:"error en ver activos del usuario"});
    }
}

let deleteUser = async (req,res) =>{
    try{
        const { id } = req.params;
        const objectId = new mongoose.Types.ObjectId(id);

        const usuarioEliminado = await user.findByIdAndDelete(objectId);
        if (!usuarioEliminado) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        await activoDB.updateMany(
        { id_usuarios: objectId },
        { $pull: { id_usuarios: objectId } } 
        );

        res.status(200).json("Usuario y sus referencias eliminados correctamente");
    }catch(err){
        console.log("error en: "+err);
        return res.status(500).json({menssage:"error en ver activos del usuario"});
    }
}   

let deleteActivoUser = async (req,res) =>{
    try{
        const { id, idActivo } = req.params;
        const objectId = new mongoose.Types.ObjectId(id);

        await activoDB.updateMany(
        { _id:idActivo },
        { $pull: { id_usuarios: objectId } } 
        );

        res.status(200).json({ mensaje: "El usuario se elimino del activo correctamente" });
    }catch(err){
        console.log("error en: "+err);
        return res.status(500).json({menssage:"error en ver activos del usuario"});
    }
}  

//muestra los usuarios de un activo en especifico, session de inventario 
let getUserActivo = async (req,res)=>{
    try{
       const { id } = req.params; // ID del activo

        const activo = await activoDB.findById(id).select('nombre id_usuarios');
        if (!activo) {
        return res.status(404).json({ mensaje: "Activo no encontrado" });
        }

        const idsUsuarios = activo.id_usuarios;
        if (!idsUsuarios || idsUsuarios.length === 0) {
        return res.status(200).json({ mensaje: "El activo no tiene usuarios asignados" });
        }

        const usuarios = await user.find({ _id: { $in: idsUsuarios } })
        .select('nombre correo estado _id');

        return res.status(200).json({
            cantidad_usuarios: usuarios.length,
            usuarios
        });

    }catch(err){
        console.log("error en: "+err);
        return res.status(500).json({menssage:"error en ver activos del usuario"});
    } 
}

module.exports = {
    crearUsuario,
    verUsuarios,
    verUsuario,
    updateUser,
    verActivosUser,
    deleteUser,
    deleteActivoUser,
    getUserActivo
}