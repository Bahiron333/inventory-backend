const foto = require("../models/foto.modelo");

exports.foto = async (req, res) => {
  try {
    const idCliente = req.params.id;
    const fotoBD = await foto.findOne({ idCliente });

    if (!fotoBD) {
      return res.status(404).json({ message: "Foto no encontrada" });
    }

    res.contentType(fotoBD.imagen.contentType);
    res.send(fotoBD.imagen.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el envío de la foto" });
  }
};