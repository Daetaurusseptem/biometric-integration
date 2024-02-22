import express from 'express';
import {  agregarAsistenciaIndividual, sincronizarAsistenciasTotales, sincronizarDatosBiometricos } from '../controllers/Sincronizacion';
import { validarAdminCompany } from '../middleware/jwt';

const router = express.Router();


router.post('/sincronizar-todos/:empresaId', 
// [validarAdminCompany], 
sincronizarDatosBiometricos );
router.post('/sincronizar-asistencias/:empresaId',
// [validarAdminCompany],  
sincronizarAsistenciasTotales );
router.post('/sincronizar-asistencia/:empresaId',
// [validarAdminCompany],  
agregarAsistenciaIndividual );

export default router;
 