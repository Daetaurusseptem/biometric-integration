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
exports.obtenerHorarioDepartamento = exports.actualizarHorarioDepartamento = exports.crearHorarioDepartamento = void 0;
const horarios_1 = require("../models/horarios");
const departamentos_1 = require("../models/departamentos");
const crearHorarioDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { departamentoId, dias, horaInicio, horaFin } = req.body;
        const departamento = yield departamentos_1.Departamento.findById(departamentoId);
        if (!departamento) {
            return res.status(404).json({ message: 'Departamento no encontrado' });
        }
        const nuevoHorario = new horarios_1.Horario({ departamento: departamentoId, dias, horaInicio, horaFin });
        yield nuevoHorario.save();
        res.status(201).json(nuevoHorario);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.crearHorarioDepartamento = crearHorarioDepartamento;
const actualizarHorarioDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { departamentoId, dias, horaInicio, horaFin } = req.body;
        const horarioActualizado = yield horarios_1.Horario.findOneAndUpdate({ departamento: departamentoId }, { dias, horaInicio, horaFin }, { new: true });
        if (!horarioActualizado) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }
        res.json(horarioActualizado);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.actualizarHorarioDepartamento = actualizarHorarioDepartamento;
const obtenerHorarioDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { departamentoId } = req.params;
        const horario = yield horarios_1.Horario.findOne({ departamento: departamentoId });
        if (!horario) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }
        res.json(horario);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerHorarioDepartamento = obtenerHorarioDepartamento;
