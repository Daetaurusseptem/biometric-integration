import mongoose, { Schema } from 'mongoose';

const asistenciaSchema = new Schema({
  empleado: { type: Schema.Types.ObjectId, ref: 'Empleado', required: true },
  fechaHora: { type: Date, required: true },
  tipo: { type: String, enum: ['asistencia', 'falta', 'vacaciones', 'permiso'], required: true },
  detalles: { type: String }
});

export const Asistencia = mongoose.model('Asistencia', asistenciaSchema);
