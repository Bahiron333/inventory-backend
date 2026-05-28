const User = require('../models/user.modelo'); //tenemos el esquema de la base de datos 

exports.validacionDatos = async (req,res,next) =>{
  
    try{
        //datos a evaluar
         const { correo, telefono, password} = req.body;

        //verifica que el correo del usuario ya esta registrado 
        const checkEmailUserRegister = await User.findOne({correo});
        if(checkEmailUserRegister) return res.status(402).json("El correo electronico del usuario ya exite");
    
        //verifica que el usuario ya esta registrado 
        const checkNumberUserRegister = await User.findOne({telefono});
       if(checkNumberUserRegister) return res.status(402).json("El numero del usuario ya exite");
        
        //si la contraseña esta vacia
        if(!password) return res.status(402).json("la contraseña no es valida del usuario");

        next();
    }catch(err){
        console.log("erro en la validacion de los datos");
        console.log(err)
        res.status(500).json({menssage:"Error en la validacion de los datos"});
   }
}
