import express from 'express';
import * as asistenciaController from '../controllers/Asistencias';
import { verifyToken } from '../middleware/jwt';

const router = express.Router();

router.post('/:idEmpleado', verifyToken, asistenciaController.registrarAsistencia);
router.get('/', verifyToken,asistenciaController.obtenerAsistencias);
router.get('/mensuales/:empresaId', asistenciaController.getEmpleadosEmpresaConAsistencias);
router.get('/empleado/:empleadoId', verifyToken, asistenciaController.obtenerAsistenciasEmpleado);
router.put('/:id', verifyToken, asistenciaController.actualizarAsistencia);
router.delete('/:id', verifyToken, asistenciaController.eliminarAsistencia);

export default router;