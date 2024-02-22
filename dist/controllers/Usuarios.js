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
exports.UsuarioController = void 0;
const usuario_1 = require("../models/usuario");
class UsuarioController {
    static crearUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nuevoUsuario = new usuario_1.Usuario(req.body);
                yield nuevoUsuario.save();
                res.status(201).json(nuevoUsuario);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });
    }
    static obtenerUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarios = yield usuario_1.Usuario.find();
                res.json(usuarios);
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
    static obtenerUsuariosEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { empresaId } = req.body;
                const usuarios = yield usuario_1.Usuario.find({ empresa: empresaId });
                res.json(usuarios);
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
    static obtenerAdmins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarios = yield usuario_1.Usuario.find({ rol: 'admin' });
                res.status(200).json({ ok: true, usuarios });
            }
            catch (error) {
                res.status(500).send({ message: 'Error al obtener los usuarios admin' });
            }
        });
    }
    ;
    static obtenerUsuarioPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuario = yield usuario_1.Usuario.findById(req.params.id);
                if (!usuario)
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                res.json({
                    ok: true,
                    usuario
                });
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
    static actualizarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioActualizado = yield usuario_1.Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
                if (!usuarioActualizado)
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                res.json(usuarioActualizado);
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
    static eliminarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioEliminado = yield usuario_1.Usuario.findByIdAndDelete(req.params.id);
                if (!usuarioEliminado)
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                res.status(200).json({ message: 'Usuario eliminado' });
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
}
exports.UsuarioController = UsuarioController;
