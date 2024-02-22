import mongoose, { Schema } from 'mongoose';




const departamentoSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  empresa: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true }
});

export const Departamento = mongoose.model('Departamento', departamentoSchema);
