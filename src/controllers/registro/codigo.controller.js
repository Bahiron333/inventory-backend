//Este archivo tiene el controlador que permite revisir el codigo de verificacion 
//con el cual verifica el correo y termina de iniciar sesion
const servicioCorreo = require("../../services/ConfigSendEmail");
const baseDatosCodigo = require("../../models/codigo.modelo");

exports.codigo = async(req,res)=>{

    const correo = req.body.correo;

    //codigo Aleatorio 100 a 1000
    const codigo = Math.floor(Math.random() * (10000 - 100 + 1)) + 100;
    //guardamos en la base de datos
    
    await baseDatosCodigo.deleteMany({correo:correo});
    const codigoBD = new baseDatosCodigo({codigo,correo});
    codigoBD.save();

    //enviamos el codigo al correo
    const mensaje = await servicioCorreo.enviarCorreo(
        correo,
        "envio del codigo para confirmacion de registro",
        "El codigo es " + codigo);

    res.json(mensaje);

}

exports.verificarCodigo = async (req,res)=>{

    //obteniendo la informacion de la solicitud
    const correo = req.body.correo;
    const codigoInput = req.body.codigo;
    //obteniendo la informacion en la base de datos
    const codigoBD = await baseDatosCodigo.findOne({correo:correo},{codigo:1,_id:0});

    //para continuar con el registro
    if(codigoBD["codigo"] == codigoInput){
        return res.status(200).json({permiso:true})
    }else{
        return res.status(500).json({permiso:false})
    }

}