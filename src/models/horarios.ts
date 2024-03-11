import mongoose, { Schema } from 'mongoose';

const horarioSchema = new Schema({
  departamento: { type: Schema.Types.ObjectId, ref: 'Departamento', required: true },
  dias: [{ type: String, enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] }],
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  limiteInicio:{type:Number},
  limiteSalida:{type:Number}
});

export const Horario = mongoose.model('Horario', horarioSchema);
  