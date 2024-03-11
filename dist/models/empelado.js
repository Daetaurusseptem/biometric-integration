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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empleado = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const empleadoSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    apellido1: { type: String, required: true },
    apellido2: { type: String },
    direccion: { type: String },
    telefono: { type: String, required: true },
    email: { type: String, unique: true },
    empresa: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Empresa', required: true },
    departamento: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Departamento', required: true },
    fechaIngreso: { type: Date },
    numeroEmpleado: { type: String, unique: true, required: true },
    posicion: { type: String }
});
exports.Empleado = mongoose_1.default.model('Empleado', empleadoSchema);
