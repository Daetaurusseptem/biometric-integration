import express from 'express';
import {UsuarioController} from '../controllers/Usuarios';
import { validarSysAdmin } from '../middleware/jwt';

const router = express.Router();

router.post('/', UsuarioController.crearUsuario);
router.get('/', UsuarioController.obtenerUsuarios);
router.get('/company/all/:empresaId', UsuarioController.obtenerUsuariosEmpresa);
router.get('/company/admins/all', UsuarioController.obtenerAdmins);
router.get('/company/admins/available', UsuarioController.obtenerAdminsDisponibles);
router.get('/:id', UsuarioController.obtenerUsuarioPorId);
router.put('/:id', UsuarioController.actualizarUsuario);
router.delete('/:id', UsuarioController.eliminarUsuario);
 
export default router;

 
 
 
