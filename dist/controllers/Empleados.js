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
exports.registrarAsistencia = exports.asignarHorarioEmpleado = exports.eliminarEmpleado = exports.actualizarEmpleado = exports.obtenerEmpleadoPorId = exports.getEmployeesCompany = exports.getEmployeesByDepartmentId = exports.obtenerEmpleados = exports.obtenerEmpleado = exports.getAsistenciasPaginadas = exports.crearEmpleado = void 0;
const empleado_1 = require("../models/empleado");
const horarios_1 = require("../models/horarios");
const asistencias_1 = require("../models/asistencias");
const crearEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, departamento, empresa } = req.body;
        //validaciones de momento no disponibles para datos rellenables ya que los empleados son creados obteniendolos de el biometrico al sync script y de ahi aqui (API)
        // const departamentoDb = await Departamento.find({empresa, _id:departamento});
        // if(departamento!=='' ||undefined||null ){
        //   if(!departamentoDb){
        //   res.status(404).json({
        //     ok:false,
        //     msg:'El departamento no existe'
        //   })
        //   }
        // }
        if (nombre == '' || undefined || null) {
            req.body.nombre = 'no definido';
        }
        const nuevoEmpleado = new empleado_1.Empleado(req.body);
        const empleadoGuardado = yield nuevoEmpleado.save();
        res.status(201).json({
            empleado: empleadoGuardado
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.crearEmpleado = crearEmpleado;
const getAsistenciasPaginadas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Conversión explícita a String para evitar problemas de tipos
    const empresaId = req.params.empresaId.toString();
    const departamentoId = req.query.departamentoId ? req.query.departamentoId.toString() : null;
    const terminoBusqueda = req.query.terminoBusqueda ? req.query.terminoBusqueda.toString() : '';
    const numeroRegistros = parseInt(req.query.numeroRegistros) || 5;
    const pagina = parseInt(req.query.pagina) || 1;
    const skip = (pagina - 1) * numeroRegistros;
    try {
        // Buscar empleados que pertenezcan a la empresa (y opcionalmente al departamento)
        let filtroEmpleados = { empresa: empresaId };
        if (departamentoId)
            filtroEmpleados.departamento = departamentoId;
        if (terminoBusqueda)
            filtroEmpleados.$text = { $search: terminoBusqueda };
        console.log(filtroEmpleados);
        const empleados = yield empleado_1.Empleado.find(filtroEmpleados).select('_id');
        const empleadoIds = empleados.map(empleado => empleado._id);
        // Filtro para asistencias que pertenecen a los empleados encontrados
        const filtroAsistencias = { empleado: { $in: empleadoIds } };
        const asistencias = yield asistencias_1.Asistencia.find(filtroAsistencias)
            .populate('empleado', 'nombre apellido1 apellido2')
            .skip(skip)
            .limit(numeroRegistros);
        const totalAsistencias = yield asistencias_1.Asistencia.countDocuments(filtroAsistencias);
        res.json({
            pagina,
            paginas: Math.ceil(totalAsistencias / numeroRegistros),
            totalAsistencias,
            asistencias
        });
    }
    catch (error) {
        res.status(500).send({ message: "Error al obtener las asistencias", error });
    }
});
exports.getAsistenciasPaginadas = getAsistenciasPaginadas;
const obtenerEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('empleado chavon');
        const { empleadoId, empresaId } = req.params;
        const empleado = yield empleado_1.Empleado.findOne({ uidBiometrico: empleadoId, empresa: empresaId }).populate('empresa departamento');
        res.status(200).json({ ok: true, empleado });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerEmpleado = obtenerEmpleado;
const obtenerEmpleados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('empleados chavones');
    try {
        const empleados = yield empleado_1.Empleado.find().populate('empresa departamento');
        res.json(empleados);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerEmpleados = obtenerEmpleados;
const getEmployeesByDepartmentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departmentId = req.params.departmentId;
        const employees = yield empleado_1.Empleado.find({ departamento: departmentId });
        res.status(200).json({ empleado: employees });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getEmployeesByDepartmentId = getEmployeesByDepartmentId;
const getEmployeesCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresaId = req.params.empresaId;
        const employees = yield empleado_1.Empleado.find({ empresa: empresaId });
        res.status(200).json({ ok: true, empleados: employees });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getEmployeesCompany = getEmployeesCompany;
const obtenerEmpleadoPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        const empleado = yield empleado_1.Empleado.findById(req.params.id).populate('empresa departamento');
        if (!empleado)
            return res.status(404).json({ message: 'Empleado no encontrado' });
        res.status(200).json({ ok: true, empleado });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.obtenerEmpleadoPorId = obtenerEmpleadoPorId;
const actualizarEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('update empleado');
        const empleadoActualizado = yield empleado_1.Empleado.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('empresa departamento');
        if (!empleadoActualizado)
            return res.status(404).json({ message: 'Empleado no encontrado' });
        res.json(empleadoActualizado);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.actualizarEmpleado = actualizarEmpleado;
const eliminarEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empleadoEliminado = yield empleado_1.Empleado.findByIdAndDelete(req.params.id);
        if (!empleadoEliminado)
            return res.status(404).json({ message: 'Empleado no encontrado' });
        res.status(200).json({ message: 'Empleado eliminado' });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.eliminarEmpleado = eliminarEmpleado;
const asignarHorarioEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empleadoId, horario } = req.body;
        const empleado = yield empleado_1.Empleado.findById(empleadoId);
        if (!empleado)
            return res.status(404).json({ message: 'Empleado no encontrado' });
        const horarioAsignado = new horarios_1.Horario(Object.assign(Object.assign({}, horario), { empleado: empleadoId }));
        yield horarioAsignado.save();
        res.json(horarioAsignado);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.asignarHorarioEmpleado = asignarHorarioEmpleado;
const registrarAsistencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nuevaAsistencia = new asistencias_1.Asistencia({
            empleado: req.body.empleado,
            fechaHora: new Date(req.body.fechaHora),
            tipo: req.body.tipo
        });
        yield nuevaAsistencia.save();
        res.status(201).json(nuevaAsistencia);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.registrarAsistencia = registrarAsistencia;
