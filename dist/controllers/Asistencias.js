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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsistenciasMes = exports.registrarAsistenciasOLD = exports.getEmpleadosEmpresaConAsistencias = exports.registrarAsistencias = exports.eliminarAsistencia = exports.actualizarAsistencia = exports.obtenerAsistenciasEmpleado = exports.obtenerAsistencias = exports.registrarAsistencia = void 0;
const asistencias_1 = require("../models/asistencias");
const empleado_1 = require("../models/empleado");
const horarios_1 = require("../models/horarios");
const dayjs_1 = __importDefault(require("dayjs"));
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
//MEJORADO
const registrarAsistencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { asistencias } = req.body;
    const empresaId = req.params.empresaId;
    // Agrupar asistencias por deviceUserId y luego por día
    const asistenciasAgrupadas = asistencias.reduce((acc, asistencia) => {
        const { deviceUserId, tiempoRegistro } = asistencia;
        const fecha = (0, dayjs_1.default)(tiempoRegistro).format('YYYY-MM-DD');
        if (!acc[deviceUserId])
            acc[deviceUserId] = {};
        if (!acc[deviceUserId][fecha])
            acc[deviceUserId][fecha] = [];
        acc[deviceUserId][fecha].push(new Date(tiempoRegistro));
        return acc;
    }, {});
    const resultados = [];
    for (const deviceUserId in asistenciasAgrupadas) {
        const empleado = yield empleado_1.Empleado.findOne({ empresa: empresaId, uidBiometrico: deviceUserId });
        if (!empleado) {
            resultados.push({ deviceUserId, resultado: 'Empleado no registrado en la empresa' });
            continue;
        }
        // Obtener el horario del departamento si existe
        let horario;
        if (empleado.departamento) {
            horario = yield horarios_1.Horario.findOne({ departamento: empleado.departamento });
        }
        for (const fecha in asistenciasAgrupadas[deviceUserId]) {
            const tiempos = asistenciasAgrupadas[deviceUserId][fecha].sort((a, b) => a.getTime() - b.getTime());
            const entrada = tiempos[0];
            const salida = tiempos[tiempos.length - 1];
            let tipo = 'asistencia'; // Default tipo
            if (horario) {
                // Comparar horarios con los límites establecidos en el horario del departamento
                const horaEntrada = entrada.getHours() + entrada.getMinutes() / 60;
                const horaSalida = salida.getHours() + salida.getMinutes() / 60;
                if (horaEntrada > horario.limiteInicio || horaSalida < horario.limiteSalida) {
                    tipo = 'inconsistencia';
                }
            }
            else if (tiempos.length === 1) {
                tipo = 'inconsistencia'; // Considerar una única asistencia como inconsistencia
            }
            try {
                const asistencia = yield asistencias_1.Asistencia.create({
                    empleado: empleado._id,
                    entrada,
                    salida,
                    tipo,
                    detalles: tiempos.length > 1 ? '' : 'Solo una marca de tiempo registrada'
                });
                resultados.push({ deviceUserId, fecha, resultado: 'Registrado', asistenciaId: asistencia._id });
            }
            catch (error) {
                resultados.push({ deviceUserId, fecha, resultado: 'Error al registrar asistencia', error });
            }
        }
    }
    return res.json(resultados);
});
exports.registrarAsistencias = registrarAsistencias;
//
const getEmpleadosEmpresaConAsistencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const empresaId = req.params.empresaId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { year, month } = req.query;
    // Valor del mes '01', '02', etc.
    console.log(req.query);
    // Valor del año '2024', '2025', etc.
    const skip = (page - 1) * limit;
    // Construir las fechas de inicio y fin del mes
    try {
        console.log(year);
        console.log(month);
        const startOfMonth = (0, dayjs_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const endOfMonth = (0, dayjs_1.default)(`${year}-${month}-01`).endOf('month').toDate();
        // Paso 1: Obtener empleados de la empresa y paginar
        console.log(startOfMonth, endOfMonth);
        const empleados = yield empleado_1.Empleado.find({ empresa: empresaId })
            .skip(skip)
            .limit(limit);
        // Paso 2: Para cada empleado, obtener sus asistencias dentro del rango del mes proporcionado
        const empleadosConAsistencias = yield Promise.all(empleados.map((empleado) => __awaiter(void 0, void 0, void 0, function* () {
            const asistencias = yield asistencias_1.Asistencia.find({
                empleado: empleado._id,
                entrada: { $gte: startOfMonth, $lte: endOfMonth }
            });
            return Object.assign(Object.assign({}, empleado.toObject()), { // Utiliza toObject para evitar problemas con _doc
                asistencias });
        })));
        const totalEmpleados = yield empleado_1.Empleado.countDocuments({ empresa: empresaId });
        res.status(200).json({
            ok: true,
            empleados: empleadosConAsistencias,
            totalEmpleados
        });
    }
    catch (error) {
        console.error("Error al obtener empleados con asistencias", error);
        res.status(500).json({ message: "Error al obtener empleados con asistencias", error });
    }
});
exports.getEmpleadosEmpresaConAsistencias = getEmpleadosEmpresaConAsistencias;
//ANTERIOR
const registrarAsistenciasOLD = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.registrarAsistenciasOLD = registrarAsistenciasOLD;
const getAsistenciasMes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { empresaId } = req.params;
    const { month, year, departamentoId } = req.query; // Recibir mes y año como query params
    if (!month || !year) {
        return res.status(400).json({ message: 'Mes y año son requeridos' });
    }
    // Convertir mes y año a fechas de inicio y fin del mes
    const inicioMes = (0, dayjs_1.default)(`${year}-${month}-01`).startOf('month');
    const finMes = (0, dayjs_1.default)(inicioMes).endOf('month');
    console.log(inicioMes, finMes);
    try {
        let filtroEmpleados = { empresa: empresaId };
        // Agregar filtro por departamento si se proporciona
        if (departamentoId) {
            filtroEmpleados.departamento = departamentoId;
        }
        // Obtener los IDs de empleados que cumplen con el filtro
        const empleados = yield empleado_1.Empleado.find(filtroEmpleados, '_id');
        // Mapear a un arreglo de IDs
        const empleadosIds = empleados.map(empleado => empleado._id);
        // Obtener asistencias de los empleados en el rango de fechas
        const asistencias = yield asistencias_1.Asistencia.find({
            empleado: { $in: empleadosIds },
            entrada: { $gte: inicioMes.toDate(), $lte: finMes.toDate() }
        }).populate('empleado');
        res.json(asistencias);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las asistencias', error });
    }
});
exports.getAsistenciasMes = getAsistenciasMes;
