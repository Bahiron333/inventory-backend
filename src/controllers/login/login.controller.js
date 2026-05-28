const user = require("../../models/user.modelo");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.login = async (req,res) =>{

    try{
        const {correo, password}= req.body;

        const passwordBD = await user.findOne({correo:correo});

        //verifica que el usuario exista 
        const usuario = await user.findOne({ correo });
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        //hashear contraseña ingresada por el usuario y la guarda
        const comparacion = await bcrypt.compare(password,passwordBD?.passwordHash);

        //envia una respuesta por la comparacion
        if(comparacion){

            // Crear payload del token
            const payload = {
            sub: usuario?._id.toString(),
            email: usuario?.correo
            };

            // Firmar token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '299h'
            });

            //envio de la respuesta 
            return res.status(200).json({
                token:token,
                message:"login exitoso",
                user:{
                    user_id: usuario?._id,
                    user_email:usuario?.email
                }
            });

        }else{
            return res.status(301).json({message:"Acceso denegado"});
        }
    }catch(err){
        console.log(err);
        return res.status(301).json({menssge:"error en el incio de sesion",error:err})
    }

   
}