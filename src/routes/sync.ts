import express from 'express';
import {  agregarAsistenciaIndividual, sincronizarAsistenciasTotales, sincronizarDatosBiometricos } from '../controllers/Sincronizacion';
import { validarAdminCompany, verifyToken } from '../middleware/jwt';
import { registrarAsistencias } from '../controllers/Asistencias';

const router = express.Router();


router.post('/sincronizar-todos/:empresaId', 
// [validarAdminCompany], 
sincronizarDatosBiometricos );

router.post('/sincronizar-asistencias/:empresaId',
verifyToken,
validarAdminCompany,  
registrarAsistencias );

router.post('/sincronizar-asistencia/:empresaId',
// [validarAdminCompany],  
agregarAsistenciaIndividual );



export default router;
 