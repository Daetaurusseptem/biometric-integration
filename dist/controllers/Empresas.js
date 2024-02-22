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
exports.eliminarEmpresa = exports.actualizarEmpresa = exports.obtenerEmpresaPorId = exports.obtenerEmpresas = exports.crearEmpresa = exports.asignarAdmin = void 0;
const empresa_1 = require("../models/empresa");
const usuario_1 = require("../models/usuario");
const asignarAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminId, empresaId } = req.body;
    try {
        // Verificar si el usuario es admin
        const usuario = yield usuario_1.Usuario.findById(adminId);
        if (!usuario || usuario.rol !== 'admin') {
            return res.status(400).send('Usuario no válido o no es administrador.');
        }
        // Verificar si el usuario ya es admin de otra empresa
        const empresaExistente = yield empresa_1.Empresa.findOne({ admin: adminId });
        if (empresaExistente) {
            return res.status(400).send('El usuario ya es administrador de otra empresa.');
        }
        // Asignar admin a la empresa
        const empresa = yield empresa_1.Empresa.findByIdAndUpdate(empresaId, { admin: adminId }, { new: true });
        if (!empresa) {
            return res.status(404).send('Empresa no encontrada.');
        }
        res.json({ empresa });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.asignarAdmin = asignarAdmin;
const crearEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nuevaEmpresa = new empresa_1.Empresa(req.body);
        const empresaGuardada = yield nuevaEmpresa.save();
        const admin = yield usuario_1.Usuario.findByIdAndUpdate(req.body.admin, { empresa: empresaGuardada._id });
        res.status(201).json({
            ok: true,
            administrador: admin,
            empresaGuardada
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.crearEmpresa = crearEmpresa;
const obtenerEmpresas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresas = yield empresa_1.Empresa.find();
        res.json({ ok: true, empresas });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerEmpresas = obtenerEmpresas;
const obtenerEmpresaPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresa = yield empresa_1.Empresa.findById(req.params.id);
        if (!empresa)
            return res.status(404).json({ message: 'Empresa no encontrada' });
        res.json({
            ok: true,
            empresa
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.obtenerEmpresaPorId = obtenerEmpresaPorId;
const actualizarEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresaActualizada = yield empresa_1.Empresa.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!empresaActualizada)
            return res.status(404).json({ message: 'Empresa no encontrada' });
        res.json(empresaActualizada);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.actualizarEmpresa = actualizarEmpresa;
const eliminarEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresaEliminada = yield empresa_1.Empresa.findByIdAndDelete(req.params.id);
        if (!empresaEliminada)
            return res.status(404).json({ message: 'Empresa no encontrada' });
        const adminEmpresa = yield usuario_1.Usuario.findOneAndUpdate({ empresa: req.params.id }, { $set: { empresa: null } }, { new: true });
        res.status(200).json({ message: 'Empresa eliminada' });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.eliminarEmpresa = eliminarEmpresa;
