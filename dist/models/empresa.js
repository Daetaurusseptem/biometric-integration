"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empresa = void 0;
const mongoose = require('mongoose');
const { Schema } = mongoose;
const empresaSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    direccion: { type: String, required: true },
    email: { type: String, required: true },
    descripcion: { type: String, required: true },
    tel: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});
exports.Empresa = mongoose.model('empresas-biometricos', empresaSchema);
