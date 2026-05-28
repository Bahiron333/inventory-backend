const User = require('../../models/user.modelo'); //tenemos el esquema de la base de datos 
const bcrypt = require("bcrypt"); //encriptar la contraseña

exports.registro = async (req, res) => {

    try{
        const { nombre, correo, direccion, telefono, password} = req.body;

        let passwordHash = null; //guardamos la contraseña
        //hashear contraseña ingresada por el usuario y la guarda
        bcrypt.hash(password,10, async (error, hash)=>{
            if(error) {
                console.log("error al hashear contraseña");
                return
            } 

            passwordHash = hash;
            const newUser = new User({correo,nombre,telefono,direccion,passwordHash});
            const result = await newUser.save();

            //obtenemos el id del usuario 
            req.idUsuario = result._id;

            //enviamos el usuario creado
            res.status(201).json({
                message: "Usuario registrado exitosamente",
                user: newUser
            })
        });

    }catch(error){
        console.log("Error en la creacion de un nuevo usuario");
        res.status(500).json(error);
    }
}