const cliente = require("../../models/cliente.modelo");
const contador = require("../../models/contadorCodigo.model");
const permiso = require("../../models/permisos.modelo");

exports.agregarCliente = async (req,res)=> {
    try{
    
        //obtenemos los datos principales
        const {nombre, descripcion,nit,correo,numero} = req.body;
        const id_usuario = req.params.id;
        let codigo = "";

        //el contador se usa para crear un codigo unico para cada empresa
        //por cada empresa nueva que llegue se crea un nuevo codigo incrementado en uno 
        const contadorCodigo = await contador.findOne({nombre:'cliente'}) || false;
        if(contadorCodigo){
            let newValorContador = contadorCodigo.contador;
            newValorContador++;
            codigo = "CE"+newValorContador;
            const result = await contador.updateOne(
                {nombre:"cliente"}, //filtra por nombre
                {$set:{contador:newValorContador}}
            );
        }else{
            const primerCodigoContador = new contador({nombre:'cliente',contador:1000000});
            codigo = "CE" + primerCodigoContador.contador;
            primerCodigoContador.save();
        }

        //creamos el cliente
        const clienteBD = new cliente({
            nombre:nombre,
            descripcion:descripcion,
            nit:nit,
            correo:correo,
            numero:numero,
            id_representante:id_usuario,
            codigo:codigo

        });

        clienteBD.save();

        //asociamos los permisos de los clientes con el usuario
        const permisoRepresentante = new permiso({
            id_user: id_usuario,
            id_empresa: clienteBD._id,
            role:"administrador",
            estado:"activo",
            area:"",
            suspendido:false,
            usuarios:{
                ver: true,
                modificar: true,
                eliminar:true
            },
            inventario:{
                ver: true,
                modificar: true,
                eliminar:true
            },
            miembros:{
                ver: true,
                modificar: true,
                eliminar:true
            }
                
        });
        req.idUsuario =  clienteBD._id;
        permisoRepresentante.save();

        return res.status(200).json({menssage:"Los datos fueron recibidos exitosamente"});

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Ahi un error en el procesameinto de los datos"})
    }
}