"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getResumenAsistencias = exports.generarReporteAsistenciaPorMes = void 0;
const empleado_1 = require("../models/empleado");
const asistencias_1 = require("../models/asistencias");
const mongoose_1 = __importStar(require("mongoose"));
const dayjs_1 = __importDefault(require("dayjs"));
const generarReporteAsistenciaPorMes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const empresaId = req.params.empresaId;
    const departamentoId = req.query.departamentoId;
    const mes = req.query.mes;
    const year = req.query.year;
    // Valida que el mes está presente
    if (!mes || !year) {
        return res.status(400).json({ message: 'El mes y año son requeridos' });
    }
    // Determina el rango de fechas para el mes y año dados
    const fechaInicio = (0, dayjs_1.default)(`${year}-${mes}-01`).startOf('month').toDate();
    const fechaFin = (0, dayjs_1.default)(fechaInicio).endOf('month').toDate();
    console.log(fechaInicio);
    console.log(fechaFin);
    try {
        // Filtro base para empleados pertenecientes a la empresa
        const filtroEmpleados = { empresa: new mongoose_1.Types.ObjectId(empresaId) };
        // Si se especifica departamentoId, agregamos el filtro por departamento
        if (departamentoId) {
            filtroEmpleados['departamento'] = new mongoose_1.Types.ObjectId(departamentoId);
        }
        // Buscar empleados de la empresa (y departamento si se proporciona)
        const empleados = yield empleado_1.Empleado.find(filtroEmpleados);
        // Extraer los IDs de los empleados para buscar sus asistencias
        const empleadosIds = empleados.map(emp => emp._id);
        // Obtener asistencias de los empleados en el rango del mes dado
        const asistencias = yield asistencias_1.Asistencia.find({
            empleado: { $in: empleadosIds },
            entrada: { $gte: fechaInicio, $lte: fechaFin },
        }).populate('empleado');
        // Formatear datos para el reporte
        const reporte = asistencias.map((asistencia) => ({
            empleadoNombre: asistencia.empleado.nombre,
            empleadoApellido: `${asistencia.empleado.apellido1} ${asistencia.empleado.apellido2}`,
            fechaEntrada: asistencia.entrada,
            fechaSalida: asistencia.salida,
            tipo: asistencia.tipo,
            detalles: asistencia.detalles
        }));
        // Envío de la respuesta con el reporte
        res.json(reporte);
    }
    catch (error) {
        res.status(500).json({ message: `Error al generar el reporte de asistencia por mes: ${error}` });
    }
});
exports.generarReporteAsistenciaPorMes = generarReporteAsistenciaPorMes;
const getResumenAsistencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Asumiendo que recibes empresaId como parámetro
        const empresaId = req.params.empresaId;
        const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const finMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        // Obtener todos los empleados de la empresa
        const empleados = yield empleado_1.Empleado.find({ empresa: new mongoose_1.default.Types.ObjectId(empresaId) });
        // Mapear los empleados a sus respectivos ID's para la consulta
        const empleadosIds = empleados.map(emp => emp._id);
        // Obtener las asistencias del mes actual
        const asistenciasMes = yield asistencias_1.Asistencia.aggregate([
            { $match: {
                    empleado: { $in: empleadosIds },
                    entrada: { $gte: inicioMes, $lte: finMes }
                } },
            { $group: {
                    _id: {
                        day: { $dayOfMonth: "$entrada" },
                        tipo: "$tipo"
                    },
                    count: { $sum: 1 }
                } },
            { $sort: { "_id.day": 1 } }
        ]);
        // Organizar los datos para el frontend
        const resumen = asistenciasMes.reduce((acc, asistencia) => {
            const day = asistencia._id.day;
            const tipo = asistencia._id.tipo;
            if (!acc[day]) {
                acc[day] = { asistencias: 0, inconsistencias: 0, faltas: 0 };
            }
            if (tipo === 'asistencia') {
                acc[day].asistencias += asistencia.count;
            }
            else if (tipo === 'inconsistencia') {
                acc[day].inconsistencias += asistencia.count;
            }
            else if (tipo === 'falta') {
                acc[day].faltas += asistencia.count;
            }
            return acc;
        }, {});
        res.json({ resumen });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el resumen de asistencias');
    }
});
exports.getResumenAsistencias = getResumenAsistencias;
