const fotoBD = require("../models/foto.modelo");

exports.guardarFoto = async (req,res,next) =>{
    
   //esto se ejecuta despues del controlador
   res.on('finish',async ()=>{
        try{
            const foto = new fotoBD({
                idCliente: req.idUsuario,
                imagen: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                }
            });

            await foto.save();
        }catch(err){
            console.log("error en guardar imagen");
            console.log(err);
        }
   });

   next();
}