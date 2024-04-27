import express from 'express';
import { generarReporteAsistenciaPorMes, getResumenAsistencias } from '../controllers/Reportes';


const router = express.Router();

router.get('/:empresaId', generarReporteAsistenciaPorMes);
router.get('/mes/:empresaId', getResumenAsistencias);

export default router;