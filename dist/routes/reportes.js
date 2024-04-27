"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Reportes_1 = require("../controllers/Reportes");
const router = express_1.default.Router();
router.get('/:empresaId', Reportes_1.generarReporteAsistenciaPorMes);
router.get('/mes/:empresaId', Reportes_1.getResumenAsistencias);
exports.default = router;
