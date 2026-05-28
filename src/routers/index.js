const express = require('express');
const routers = express.Router();

//middleware 
const validacionDatos = require("../middlewares/registro.middleware"); //valida los datos antes de ingresar
const validarToken = require("../middlewares/validarToken.middleware");
const fotoUploand = require("../middlewares/foto.middleware");
const guardarFoto = require("../middlewares/guardarFoto.middleware");

//usar los controladores 
const RegistroController = require('../controllers/registro/registro.controller');
const CodigoRegistro = require('../controllers/registro/codigo.controller');
const login = require("../controllers/login/login.controller")
const cliente = require("../controllers/cliente/cliente.controller");
const unirseCliente = require("../controllers/cliente/unirse.controller");
const mostraClientes = require("../controllers/cliente/mostrarClientes.controller");
const fotoEvio = require("../controllers/foto.controller");
const eliminarUsuarioCliente = require("../controllers/cliente/eliminarMiembroCliente");
const informacionCliente = require("../controllers/cliente/informacion.controller");
const inf_user = require("../controllers/usuario/usuario.inf");
const {verMiembros,informacionMiembros, updateMiembros, permisosMiembro} = require("../controllers/cliente/miembros/miembros.controller");
const {crearInventario, mostrarActivos, mostrarCategoria, getCampo, crearActivo, eliminarActivo, verActivo, verActivos} = require("../controllers/cliente/inventario/inventario.controller");
const {crearUsuario, verUsuarios, verUsuario, updateUser, verActivosUser, deleteUser, deleteActivoUser, getUserActivo} = require("../controllers/cliente/users/users");

//end point de registro 
routers.post('/auth/register',[fotoUploand.single('foto'),validacionDatos.validacionDatos,guardarFoto.guardarFoto],RegistroController.registro);
routers.post('/auth/register/codigo',CodigoRegistro.codigo);
routers.post('/auth/register/codigo/verificar',CodigoRegistro.verificarCodigo);

//End-Point de login
routers.post('/auth/login',login.login);

//obtener informacion basica usuario
routers.get('/user/informacion/:id',validarToken.validarToken,inf_user.infUsuario);

//End-Points para el cliente 
//Dashboard
routers.post('/clientes/create/:id',[validarToken.validarToken, fotoUploand.single('foto'),guardarFoto.guardarFoto], cliente.agregarCliente)
routers.put('/clientes/unirse/:id',validarToken.validarToken,unirseCliente.unirseCliente);
routers.get('/clientes/:id',validarToken.validarToken,mostraClientes.mostrarCliente);
routers.delete('/clientes/:id',validarToken.validarToken,eliminarUsuarioCliente.eliminarUsuarioCliente);

//cliente
routers.get('/user/:id/cliente/:idCliente/informacion',validarToken.validarToken,informacionCliente.informacion);
routers.get('/user/:id/cliente/:idcliente/miembros',validarToken.validarToken,verMiembros);
routers.get('/cliente/:idCliente/miembro/:idMiembro',validarToken.validarToken,informacionMiembros);
routers.put('/cliente/:idCliente/miembro',validarToken.validarToken,updateMiembros);
routers.get('/cliente/:idCliente/miembros/:idMiembro/permisos',permisosMiembro);

//inventario
routers.post('/cliente/:idCliente/inventario/crearInventario',validarToken.validarToken,crearInventario);
routers.get('/cliente/:idCliente/inventario/activos',validarToken.validarToken,mostrarCategoria);
routers.get('/cliente/:idCliente/inventario/:categoria',validarToken.validarToken,mostrarActivos);
routers.get('/inventario/:categoria/camposAdicionales',validarToken.validarToken,getCampo);
routers.post('/:idCliente/inventario/:idInventario/crear_activo',validarToken.validarToken,crearActivo);
routers.delete('/:idCliente/activo/:id',validarToken.validarToken, eliminarActivo);
routers.get('/:idCliente/activo/:id',validarToken.validarToken, verActivo);
routers.get('/:idCliente/activos/:tipo', validarToken.validarToken, verActivos);

//Usuarios 
routers.post('/cliente/:idCliente/user/crear', validarToken.validarToken,crearUsuario);
routers.get('/user/:id/cliente/:idCliente/users', validarToken.validarToken,verUsuarios);
routers.get('/cliente/:idCliente/:id/user/ver', validarToken.validarToken,verUsuario);
routers.put('/cliente/:idCliente/user/update', validarToken.validarToken, updateUser);
routers.delete('/:id/user/delete', validarToken.validarToken, deleteUser);
routers.delete('/:id/user/:idActivo/activo', validarToken.validarToken, deleteActivoUser);
routers.get('/user/:id/activos', validarToken.validarToken, verActivosUser);
routers.get('/activo/:id/users',validarToken.validarToken, getUserActivo);

//End-point para el envio de la fotos
routers.get('/foto/:id',fotoEvio.foto, crearUsuario);

module.exports = routers;