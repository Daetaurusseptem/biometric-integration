import express from 'express';
import {UsuarioController} from '../controllers/Usuarios';

const router = express.Router();

router.post('/', UsuarioController.crearUsuario);
router.get('/', UsuarioController.obtenerUsuarios);
router.get('/company/all/:empresaId', UsuarioController.obtenerUsuariosEmpresa);
router.get('/company/admins', UsuarioController.obtenerAdmins);
router.get('/:id', UsuarioController.obtenerUsuarioPorId);
router.put('/:id', UsuarioController.actualizarUsuario);
router.delete('/:id', UsuarioController.eliminarUsuario);
 
export default router;
 
 
 
