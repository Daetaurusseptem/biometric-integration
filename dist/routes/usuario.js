"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Usuarios_1 = require("../controllers/Usuarios");
const router = express_1.default.Router();
router.post('/', Usuarios_1.UsuarioController.crearUsuario);
router.get('/', Usuarios_1.UsuarioController.obtenerUsuarios);
router.get('/company/all/:empresaId', Usuarios_1.UsuarioController.obtenerUsuariosEmpresa);
router.get('/company/admins', Usuarios_1.UsuarioController.obtenerAdmins);
router.get('/:id', Usuarios_1.UsuarioController.obtenerUsuarioPorId);
router.put('/:id', Usuarios_1.UsuarioController.actualizarUsuario);
router.delete('/:id', Usuarios_1.UsuarioController.eliminarUsuario);
exports.default = router;
