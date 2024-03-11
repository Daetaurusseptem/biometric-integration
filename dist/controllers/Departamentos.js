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
exports.eliminarDepartamento = exports.actualizarDepartamento = exports.obtenerDepartamentoPorId = exports.obtenerDepartamentosEmpresa = exports.obtenerDepartamentos = exports.crearDepartamento = void 0;
const departamentos_1 = require("../models/departamentos");
const crearDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Crear departamento');
        const nuevoDepartamento = new departamentos_1.Departamento(req.body);
        const departamentoGuardado = yield nuevoDepartamento.save();
        res.status(201).json(departamentoGuardado);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.crearDepartamento = crearDepartamento;
const obtenerDepartamentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departamentos = yield departamentos_1.Departamento.find();
        res.status(200).json({ ok: true, departamentos });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerDepartamentos = obtenerDepartamentos;
const obtenerDepartamentosEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empresaId } = req.params;
        const departamentos = yield departamentos_1.Departamento.find({ empresa: empresaId });
        res.status(200).json({ ok: true, departamentos });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerDepartamentosEmpresa = obtenerDepartamentosEmpresa;
const obtenerDepartamentoPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departamento = yield departamentos_1.Departamento.findById(req.params.id);
        if (!departamento)
            return res.status(404).json({ message: 'Departamento no encontrado' });
        res.status(200).json({ departamento });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerDepartamentoPorId = obtenerDepartamentoPorId;
const actualizarDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departamentoActualizado = yield departamentos_1.Departamento.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!departamentoActualizado)
            return res.status(404).json({ message: 'Departamento no encontrado' });
        res.json(departamentoActualizado);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.actualizarDepartamento = actualizarDepartamento;
const eliminarDepartamento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departamentoEliminado = yield departamentos_1.Departamento.findByIdAndDelete(req.params.id);
        if (!departamentoEliminado)
            return res.status(404).json({ message: 'Departamento no encontrado' });
        res.status(200).json({ message: 'Departamento eliminado' });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.eliminarDepartamento = eliminarDepartamento;
