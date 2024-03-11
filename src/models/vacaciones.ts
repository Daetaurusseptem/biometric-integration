import mongoose, { Schema } from 'mongoose';

const vacacionesSchema = new Schema({
  empleado: { type: Schema.Types.ObjectId, ref: 'Empleado' },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  aprobado: { type: Boolean, default: false }
});

export const Vacaciones = mongoose.model('Vacaciones', vacacionesSchema);
