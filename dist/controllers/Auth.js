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
exports.renewToken = exports.login = void 0;
const usuario_1 = require("../models/usuario");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_helper_1 = require("../helpers/jwt-helper");
const menu_1 = require("../helpers/menu");
const empresa_1 = require("../models/empresa");
const login = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('login');
    const { username, password } = req.body;
    console.log(username, password);
    try {
        const usuarioDB = yield usuario_1.Usuario.findOne({ username }).select('+password');
        if (!usuarioDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'Datos no validos'
            });
        }
        const validPassword = bcrypt_1.default.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return resp.status(400).json({
                ok: false,
                msg: 'password invalido'
            });
        }
        console.log(JSON.stringify(usuarioDB._id));
        const token = yield (0, jwt_helper_1.generarJWT)(usuarioDB._id);
        console.log(token);
        return resp.status(200).json({
            ok: true,
            menu: (0, menu_1.getMenuFrontEnd)(usuarioDB.rol),
            token
        });
    }
    catch (error) {
        return resp.status(500).json({
            okay: false,
            msg: 'Porfavor hable con el administrador: '
        });
    }
});
exports.login = login;
const renewToken = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('ENTROO RENEW');
        const uid = req.uid;
        const token = yield (0, jwt_helper_1.generarJWT)(uid);
        //return user
        console.log('aqui' + uid);
        let usuario = yield usuario_1.Usuario.findOne({ _id: uid }).select('+password');
        if (!usuario) {
            return resp.status(404).json({
                ok: false,
                msg: 'No se encontro el usuario'
            });
        }
        let company = yield empresa_1.Empresa.findOne({ admin: uid });
        if (!company) {
            return resp.status(200).json({
                ok: true,
                token,
                uid,
                usuario,
                menu: (0, menu_1.getMenuFrontEnd)(usuario === null || usuario === void 0 ? void 0 : usuario.rol)
            });
        }
        return resp.status(200).json({
            ok: true,
            token,
            uid,
            usuario,
            empresa: company,
            menu: (0, menu_1.getMenuFrontEnd)(usuario === null || usuario === void 0 ? void 0 : usuario.rol)
        });
    }
    catch (error) {
        resp.json('error oh no' + error);
    }
});
exports.renewToken = renewToken;
