"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerVacaciones = exports.aprobarRechazarVacaciones = exports.solicitarVacaciones = void 0;
const vacaciones_1 = require("../models/vacaciones");
const empleado_1 = require("../models/empleado");
const solicitarVacaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empleadoId, fechaInicio, fechaFin } = req.body;
        const empleado = yield empleado_1.Empleado.findById(empleadoId);
        if (!empleado)
            return res.status(404).json({ message: 'Empleado no encontrado' });
        const nuevaSolicitud = new vacaciones_1.Vacaciones({
            empleado: empleadoId,
            fechaInicio,
            fechaFin,
            aprobado: false // Por defecto no está aprobado
        });
        yield nuevaSolicitud.save();
        res.status(201).json(nuevaSolicitud);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.solicitarVacaciones = solicitarVacaciones;
const aprobarRechazarVacaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vacacionesId, aprobado } = req.body; // 'aprobado' es un booleano
        const vacaciones = yield vacaciones_1.Vacaciones.findById(vacacionesId);
        if (!vacaciones)
            return res.status(404).json({ message: 'Solicitud de vacaciones no encontrada' });
        vacaciones.aprobado = aprobado;
        yield vacaciones.save();
        res.json(vacaciones);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.aprobarRechazarVacaciones = aprobarRechazarVacaciones;
const obtenerVacaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empleadoId } = req.params;
        const vacaciones = yield vacaciones_1.Vacaciones.find({ empleado: empleadoId });
        res.json(vacaciones);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerVacaciones = obtenerVacaciones;
