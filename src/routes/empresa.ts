import express from 'express';
import * as empresaController from '../controllers/Empresas';

const router = express.Router();

router.post('/', empresaController.crearEmpresa);
router.get('/', empresaController.obtenerEmpresas);
router.get('/:id', empresaController.obtenerEmpresaPorId);
router.put('/:id', empresaController.actualizarEmpresa);
router.delete('/:id', empresaController.eliminarEmpresa);

export default router;
 