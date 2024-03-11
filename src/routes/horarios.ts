import express from 'express';
import * as horarioController from '../controllers/Horarios';

const router = express.Router();

router.post('/', horarioController.crearHorarioDepartamento);
router.put('/', horarioController.actualizarHorarioDepartamento);
router.get('/departamento/:departamentoId', horarioController.obtenerHorarioDepartamento);

export default router;