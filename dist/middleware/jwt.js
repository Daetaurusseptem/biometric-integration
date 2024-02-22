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
exports.validarAdminCompany = exports.validarAdmin = exports.validarSysAdmin = exports.validarAdminOrSysAdmin = exports.verifyToken = void 0;
const usuario_1 = require("../models/usuario");
const empresa_1 = require("../models/empresa");
const jwt = require('jsonwebtoken');
const verifyToken = (req, resp, next) => {
    const token = req.header('x-token');
    if (!token) {
        return resp.status(401).json({
            ok: false,
            msg: `no hay token en la validacion`
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.JWT);
        req.uid = uid;
        next();
    }
    catch (error) {
        return resp.status(401).json({
            ok: false,
            msg: `token no valido ${error}`
        });
    }
};
exports.verifyToken = verifyToken;
const validarAdminOrSysAdmin = (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.uid;
    try {
        const usuarioDB = yield usuario_1.Usuario.findById(uid);
        if (!usuarioDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        if (usuarioDB.rol == 'user') {
            return resp.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
});
exports.validarAdminOrSysAdmin = validarAdminOrSysAdmin;
const validarSysAdmin = (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.uid;
    try {
        console.log(uid);
        const usuarioDB = yield usuario_1.Usuario.findById(uid);
        if (!usuarioDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        if (usuarioDB.get('rol') !== 'sysadmin') {
            return resp.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }
        next();
    }
    catch (error) {
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
});
exports.validarSysAdmin = validarSysAdmin;
const validarAdmin = (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.uid;
    try {
        console.log(uid);
        const usuarioDB = yield usuario_1.Usuario.findById(uid);
        if (!usuarioDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        if (usuarioDB.get('rol') !== 'admin') {
            return resp.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
});
exports.validarAdmin = validarAdmin;
const validarAdminCompany = (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.uid;
    const { companyId } = req.params;
    try {
        const usuarioDB = yield usuario_1.Usuario.findById(uid);
        if (!usuarioDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        const companyAdminId = yield empresa_1.Empresa.findById(companyId);
        if (usuarioDB.get('rol') !== 'admin') {
            return resp.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }
        if (!(companyAdminId === null || companyAdminId === void 0 ? void 0 : companyAdminId.admins.includes) == uid) {
            return resp.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso en esta empresa',
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
});
exports.validarAdminCompany = validarAdminCompany;
