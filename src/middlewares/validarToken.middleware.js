const jwt = require('jsonwebtoken');

exports.validarToken = (req,res,next) => {
      
    const authHeader = req.headers.authorization;

    // Verifica que venga el header Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; // Extrae solo el token

  try {
    // Verifica el token, si no es lanza un error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next(); // continúa a la siguiente función
        
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

}