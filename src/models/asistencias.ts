import mongoose, { Schema } from 'mongoose';
import { Empleado } from './empleado';

const asistenciaSchema = new Schema({
  empleado: { type: Schema.Types.ObjectId, ref: 'Empleado', required: true}||Empleado,
  entrada: { type: Date, required: true },
  salida: { type: Date, required: true },
  tipo: { type: String, enum: ['asistencia','inconsistencia', 'falta', 'vacaciones', 'permiso'], required: true },
  detalles: { type: String }

  
});

export const Asistencia = mongoose.model('Asistencia', asistenciaSchema);
 