const inventario = require("../../../models/inventario");
const camposAdicionales = require("../../../models/atributosInventarioAgregados");
const users = require("../../../models/user.modelo");
const activos = require("../../../models/activos");

let crearInventario = async(req,res)=>{
    try{
        const {activo} = req.body;
        const newActivo = new inventario({  
            nombre: activo.nombre,
            tipo: activo.tipo,
            numero_minimo_stock: parseInt(activo.numero_minimo_stock),
            id_empresa: req.params.idCliente,
            cantidad: activo.cantidad
        });

        newActivo.save()
            .then(activoId =>{            
                for([key,value] of Object.entries(activo.campos_adicionales)){
                    const newCampoAdicional = new camposAdicionales({
                        id_inventario: activoId._id,
                        nombre: value.valorCampo,
                    });
                    newCampoAdicional.save();
                }
            })
            .catch(err =>{
                console.log(err);
            });

        return res.status(200).json({menssage:"El activo se creo correctamente"});
    
    }catch(err){
        console.log(err);
        return res.status(500).json({mensaje:"hubo un error en obtener la informacion"})
    }
}

let getCampo = async (req,res)=>{
    try{
        const categoria = req.params.categoria;
        const idCategoria = await inventario.findOne({nombre:categoria}).select("_id");
        const campos = await camposAdicionales.find({id_inventario:idCategoria._id}).select('nombre');
        return res.status(200).json(campos);
        
    }catch(err){
        console.log(err);
        return res.status(500).json({menssage:"Error en obtener los campos adicionales"});
    }
}

let crearActivo = async (req,res)=>{
    try{
        const {idCliente, idInventario} = req.params;
        const {activo} =  req.body;
        const data = JSON.parse(activo);
       
        let activoDB = new activos({
           nombre:data.nombre,
           estado:data.estado,
           cantidad_usuarios:data.cantidad_usuarios,
           id_empresa:idCliente,
           id_categoria:idInventario,
           campos_adicionales:data.campos_adicionales
         });
         
        await activoDB.save();
         
        let cantidadActivos = await activos.find({id_categoria:idInventario}).select('_id');
        await inventario.findOneAndUpdate({_id:idInventario},{
            $set:{
                cantidad: cantidadActivos.length
            }
        })

        return res.status(200).json({menssage:"el activo se guardo correctamente"})
    }catch(err){
        console.log(err);
        return res.status(500).json({menssage:"Error en obtener los campos el activo"})
    }
}

const mostrarActivos = async (req, res) => {
  try {
    const { categoria, idCliente } = req.params;

    // Buscar activos por categoría y cliente
    const activosBD = await activos.find({
      id_categoria: categoria,
      id_empresa: idCliente
    });

    if (!activosBD || activosBD.length === 0) {
      return res.status(404).json({ message: "No hay activos" });
    }

    // No necesitamos buscar los usuarios, ya que solo contaremos
    // Pero si quieres validar usuarios existentes, puedes mantener la búsqueda

    const activosFormateados = activosBD.map(activo => {
      const idUser = activo.id_user;
      const disponibilidad = activo.cantidad_usuarios - activo.id_usuarios.length;
      return {
        id: activo._id,
        nombre: activo.nombre,
        estado: activo.estado,
        usuarios: activo.id_usuarios.length || "sin usuarios",
        disponibilidad: disponibilidad == 0 ? "Full" : disponibilidad,
        fecha: activo.createdAt
          ? activo.createdAt.toISOString().split("T")[0]
          : "sin fecha"
      };
    });

    return res.status(200).json({ activo: activosFormateados });

  } catch (err) {
    console.error("Error al obtener activos:", err);
    return res.status(500).json({ message: "Error en obtener el activo" });
  }
};


let mostrarCategoria = async (req,res)=>{
  try{
    const idEmpresa = req.params.idCliente;

    let hardware = await inventario.find({tipo:"hardware",id_empresa:idEmpresa}).select("_id nombre cantidad numero_minimo_stock nombre");
    let software = await inventario.find({tipo:"software",id_empresa:idEmpresa}).select("_id nombre cantidad numero_minimo_stock nombre");
    return res.status(200).json({hardware, software});

  }catch(err){
    console.log(err);
    return res.status(500).json({message:"Error en obtener las categorias"});
  }
}

let eliminarActivo = async (req,res)=>{
  try{
    const {id} = req.params;
    await activos.findOneAndDelete(id);
    return res.status(200).json("El activo se elimino correctamente");

  }catch(err){
    console.log(err);
    return res.status(500).json("Error en borrar el activo");
  }
}

let verActivo = async (req,res)=>{
  try{
    const {id} = req.params;
    let activoEnviar = {};
    const activo = await activos.findOne({'_id':id});
    const categoria = await inventario.findOne({'_id':activo.id_categoria}).select("nombre");
     
    //si no hay activos
    if(!activo)
        return res.status(404).json({menssage:"No hay activos"});

    //no hay una categoria relacionada
    if(!categoria)
        return res.status(404).json({menssage:"No hay categoria relacionada"});
 
    activoEnviar = {
        "nombre":activo.nombre,
        "id":activo._id,
        "tipo":categoria.nombre,
        "cantidad_usuarios":activo.cantidad_usuarios,
        "fecha": activo.createdAt != undefined ? activo.createdAt.toISOString().split('T')[0] : "sin fecha",
        "estado":activo.estado,
        "campos_adicionales": activo.campos_adicionales
    }
    return res.status(200).json({activoEnviar});

  }catch(err){
    console.log(err);
    return res.status(500).json("Error en ver el activo");
  }
}

const verActivos = async (req, res) => {
  try {
    const { idCliente, tipo } = req.params; // tipo: 'hardware' o 'software'

    const categorias = await inventario.find({
      id_empresa: idCliente,
      tipo: tipo.toLowerCase(), // asegúrate que viene en minúsculas
    }).select("_id nombre tipo");

    if (!categorias.length) {
      return res.status(404).json({ mensaje: "No hay categorías del tipo solicitado" });
    }

    const idsCategorias = categorias.map(c => c._id);

    const activosEncontrados = await activos.find({
      id_categoria: { $in: idsCategorias },
      estado: "activo", 
    }).select("nombre estado id_categoria id_usuarios cantidad_usuarios");

    if (!activosEncontrados.length) {
      return res.status(404).json({ mensaje: "No hay activos en esas categorías" });
    }

    const mapaCategorias = {};
    categorias.forEach(c => {
      mapaCategorias[c._id.toString()] = {
        nombre: c.nombre,
        tipo: c.tipo
      };
    });

    const activosDisponibles = activosEncontrados.map(a => {
      const total = a.cantidad_usuarios || 0;
      const usados = a.id_usuarios?.length || 0;
      const disponibilidad = total - usados;

      return {
        id: a._id,
        nombre: a.nombre,
        estado: a.estado,
        categoria: mapaCategorias[a.id_categoria.toString()]?.nombre || "Sin categoría",
        tipo: mapaCategorias[a.id_categoria.toString()]?.tipo || "Desconocido",
        disponibilidad
      };
    });
    return res.status(200).json({ activos: activosDisponibles });

  } catch (err) {
    console.error("Error en verActivos:", err);
    return res.status(500).json({ mensaje: "Error al obtener los activos" });
  }
};

module.exports = {
    crearInventario,
    mostrarActivos,
    mostrarCategoria,
    getCampo,
    crearActivo,
    eliminarActivo,
    verActivo,
    verActivos
}