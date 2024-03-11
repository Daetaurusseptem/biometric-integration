import express from 'express';
import * as vacacionesController from '../controllers/Vacaciones';

const router = express.Router();

router.post('/', vacacionesController.solicitarVacaciones);
router.put('/aprobar', vacacionesController.aprobarRechazarVacaciones);
router.get('/empleado/:empleadoId', vacacionesController.obtenerVacaciones);

export default router;
