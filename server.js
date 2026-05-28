require('dotenv').config(); //configura las variables fuera del proyecto 
const app = require('./src/app');

const PORT = process.env.PORT || 3000; //puerto del servidor

//servidor
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})