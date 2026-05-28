const nodemailer = require("nodemailer"); //transporte del mensaje 

//en esta parter se crea el medio de trasporte para enviar el mensaje 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // correo
    pass: process.env.EMAIL_PASSWORD    // contraseña
  }
});

//esta funcion permite crear el mensaje destinario, asunto mensaje y lo envia por un medio de trasporte 
//en este caso por gmail 
exports.enviarCorreo = async function enviarCorreo(destinatario, asunto, mensaje) {
  
    //crea el correo
    const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    text: mensaje
  };

  try {
    //envia el correo
    const info = await transporter.sendMail(mailOptions);
   return info.response;
  } catch (error) {
    return "Error al enviar el correo" + error;
  }
}
