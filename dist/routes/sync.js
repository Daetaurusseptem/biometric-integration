"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Sincronizacion_1 = require("../controllers/Sincronizacion");
const router = express_1.default.Router();
router.post('/sincronizar-todos/:empresaId', 
// [validarAdminCompany], 
Sincronizacion_1.sincronizarDatosBiometricos);
router.post('/sincronizar-asistencias/:empresaId', 
// [validarAdminCompany],  
Sincronizacion_1.sincronizarAsistenciasTotales);
router.post('/sincronizar-asistencia/:empresaId', 
// [validarAdminCompany],  
Sincronizacion_1.agregarAsistenciaIndividual);
exports.default = router;
