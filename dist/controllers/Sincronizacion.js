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
exports.agregarAsistenciaIndividual = exports.sincronizarAsistenciasTotales = exports.sincronizarDatosBiometricos = void 0;
const empleado_1 = require("../models/empleado");
const asistencias_1 = require("../models/asistencias");
// Importaciones necesarias
const ZKJUBAER = require("zk-jubaer");
// Controlador para sincronizar todos los empleados desde el dispositivo biométrico
const sincronizarDatosBiometricos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deviceIp } = req.body; // Recibir la IP del dispositivo biométrico como parte de la solicitud
    const { empresaId } = req.params; // Recibir el id de la empresa
    console.log(deviceIp);
    let zk = new ZKJUBAER(deviceIp, 4370, 5200, 5000);
    try {
        yield zk.createSocket();
    }
    catch (error) {
        console.log(error);
    }
    try {
        // Crear socket para la máquina 
        // Obtener todos los usuarios del dispositivo biométrico
        const users = yield zk.getUsers();
        console.log("Usuarios obtenidos del dispositivo biométrico:", users);
        // Procesar cada usuario obtenido del dispositivo biométrico
        for (const user of users.data) {
            const { uid, name, role, userId } = user;
            let empleado = yield empleado_1.Empleado.findOne({ userId });
            if (!empleado) {
                // Crear un nuevo empleado si no existe
                empleado = new empleado_1.Empleado({
                    uidBiometrico: userId,
                    nombre: name,
                    role: role,
                    sincronizadoBiometrico: true,
                    empresa: empresaId
                });
                yield empleado.save();
            }
            else {
                // Actualizar datos del empleado existente
                yield empleado_1.Empleado.findByIdAndUpdate(empleado._id, {
                    nombre: name,
                    role: role,
                    userIdBiometrico: userId,
                    sincronizadoBiometrico: true
                });
            }
        }
        // Desconectar del dispositivo 
        yield zk.disconnect();
        res.status(200).json({ message: 'Sincronización de empleados completa' });
    }
    catch (error) {
        console.error("Error al sincronizar datos con el dispositivo biométrico:", error);
        yield zk.disconnect();
        res.status(500).json({ error: "Error en la sincronización de datos" });
    }
});
exports.sincronizarDatosBiometricos = sincronizarDatosBiometricos;
const sincronizarAsistenciasTotales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deviceIp } = req.body; // Recibir la IP del dispositivo biométrico como parte de la solicitud
    const { empresaId } = req.params; // Recibir el id de la empresa
    console.log(deviceIp);
    let zk = new ZKJUBAER(deviceIp, 4370, 5200, 5000);
    try {
        try {
            yield zk.createSocket();
        }
        catch (error) {
            console.log(error);
        }
        const info = yield zk.getInfo();
        if (info.logCounts > 0) {
            const logs = yield zk.getAttendances();
            console.log(logs);
        }
        else {
            yield zk.disconnect();
            return res.status(200).json({
                ok: true,
                msg: `No hay asistencias registradas en el dispositivo ${deviceIp}`
            });
        }
        const att = yield zk.getAttendances();
        const asistenciasBiometrico = att.data;
        // Transformar asistencias a objetos de fecha para poder manejarlos
        asistenciasBiometrico.forEach((asistencia) => {
            asistencia.recordTime = new Date(asistencia.recordTime);
        });
        for (const asistencia of asistenciasBiometrico) {
            const deviceUserId = asistencia.deviceUserId;
            // Encuentra al empleado basado en el deviceUserId y empresaId
            const empleado = yield empleado_1.Empleado.findOne({ uidBiometrico: deviceUserId, empresa: empresaId });
            if (!empleado) {
                console.log(`Empleado con UID ${deviceUserId} no encontrado o no pertenece a la empresa ${empresaId}.`);
                continue; // Saltar al siguiente registro si el empleado no existe o no pertenece a la empresa
            }
            // Crear y guardar la asistencia
            const nuevaAsistencia = new asistencias_1.Asistencia({
                empleado: empleado._id,
                fechaHora: asistencia.recordTime,
                tipo: 'asistencia', // Considerar todos los registros como asistencias
                detalles: 'Registro biométrico' // Detalle genérico para cada asistencia
            });
            yield zk.clearAttendanceLog();
            yield nuevaAsistencia.save();
        }
        yield zk.disconnect();
        res.status(200).json({ message: 'Todas las asistencias han sido sincronizadas correctamente.' });
    }
    catch (error) {
        yield zk.disconnect();
        console.error('Error al sincronizar asistencias:', error);
        return res.status(500).json({ error: 'Error al procesar las asistencias.' });
    }
});
exports.sincronizarAsistenciasTotales = sincronizarAsistenciasTotales;
const agregarAsistenciaIndividual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('individual');
        const { empleado, fechaHora, tipo, detalles } = req.body;
        // Verificar si el empleado existe
        const empleadoExiste = yield empleado_1.Empleado.findOne({ uidBiometrico: empleado });
        if (!empleadoExiste) {
            return res.status(404).json({ message: "Empleado no encontrado." });
        }
        // Crear la asistencia
        const nuevaAsistencia = new asistencias_1.Asistencia({
            empleado: empleadoExiste.id,
            fechaHora,
            tipo,
            detalles
        });
        // Guardar la asistencia en la base de datos
        yield nuevaAsistencia.save();
        res.status(201).json({ message: "Asistencia agregada con éxito.", asistencia: nuevaAsistencia });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar la asistencia.", error });
    }
});
exports.agregarAsistenciaIndividual = agregarAsistenciaIndividual;
