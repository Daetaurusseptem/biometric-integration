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
exports.registrarAsistencias = exports.eliminarAsistencia = exports.actualizarAsistencia = exports.obtenerAsistenciasEmpleado = exports.obtenerAsistencias = exports.registrarAsistencia = void 0;
const asistencias_1 = require("../models/asistencias");
const empleado_1 = require("../models/empleado");
const registrarAsistencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empleadoId, fechaHora, tipo, detalles } = req.body;
        const empleado = yield empleado_1.Empleado.findById(empleadoId);
        if (!empleado)
            return res.status(404).json({ message: 'Empleado no encontrado' });
        const nuevaAsistencia = new asistencias_1.Asistencia({ empleado: empleadoId, fechaHora, tipo, detalles });
        yield nuevaAsistencia.save();
        res.status(201).json(nuevaAsistencia);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.registrarAsistencia = registrarAsistencia;
const obtenerAsistencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const asistencias = yield asistencias_1.Asistencia.find().populate('empleado');
        res.json(asistencias);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerAsistencias = obtenerAsistencias;
const obtenerAsistenciasEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empleadoId } = req.params;
        const asistencias = yield asistencias_1.Asistencia.find({ empleado: empleadoId });
        res.json(asistencias);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerAsistenciasEmpleado = obtenerAsistenciasEmpleado;
const actualizarAsistencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { asistenciaId, detalles } = req.body;
        const asistenciaActualizada = yield asistencias_1.Asistencia.findByIdAndUpdate(asistenciaId, { detalles }, { new: true });
        if (!asistenciaActualizada)
            return res.status(404).json({ message: 'Asistencia no encontrada' });
        res.json(asistenciaActualizada);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.actualizarAsistencia = actualizarAsistencia;
const eliminarAsistencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const asistenciaEliminada = yield asistencias_1.Asistencia.findByIdAndDelete(req.params.id);
        if (!asistenciaEliminada)
            return res.status(404).json({ message: 'Asistencia no encontrada' });
        res.status(200).json({ message: 'Asistencia eliminada' });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.eliminarAsistencia = eliminarAsistencia;
const registrarAsistencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { asistencias } = req.body;
    const { empresaId } = req.params;
    // Agrupar asistencias por deviceUserId
    const asistenciasPorUsuario = asistencias.reduce((acc, asistencia) => {
        const { deviceUserId, tiempoRegistro } = asistencia;
        if (!acc[deviceUserId]) {
            acc[deviceUserId] = [];
        }
        acc[deviceUserId].push(new Date(tiempoRegistro));
        return acc;
    }, {});
    // Procesar y registrar asistencias
    const resultados = [];
    for (const deviceUserId of Object.keys(asistenciasPorUsuario)) {
        // Verificar si el usuario existe en la base de datos
        const empleadoExistente = yield empleado_1.Empleado.findOne({ empresa: empresaId, uidBiometrico: deviceUserId });
        console.log('usuario:', deviceUserId, empresaId);
        console.log(empleadoExistente);
        if (!empleadoExistente) {
            // Si el empleado no existe, continúa con el siguiente
            resultados.push({ deviceUserId, resultado: 'Empleado no registrado en la empresa' });
            continue;
        }
        const tiempos = asistenciasPorUsuario[deviceUserId];
        console.log(tiempos);
        tiempos.sort((a, b) => a.getTime() - b.getTime());
        const entrada = tiempos[0];
        const salida = tiempos[tiempos.length - 1];
        if (entrada == salida) {
            const asistencia = yield asistencias_1.Asistencia.create({
                empleado: empleadoExistente._id, // Utiliza el _id del empleado existente
                entrada: entrada,
                salida: salida,
                tipo: 'inconsistencia',
            });
            continue;
        }
        try {
            const asistencia = yield asistencias_1.Asistencia.create({
                empleado: empleadoExistente._id, // Utiliza el _id del empleado existente
                entrada: entrada,
                salida: salida,
                tipo: 'asistencia',
            });
            resultados.push({ deviceUserId, resultado: 'Registrado', asistenciaId: asistencia._id });
        }
        catch (error) {
            resultados.push({ deviceUserId, resultado: 'Error al registrar asistencia', error: error });
        }
    }
    res.json(resultados);
});
exports.registrarAsistencias = registrarAsistencias;
