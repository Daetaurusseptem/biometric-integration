import mongoose, { Schema } from 'mongoose';

const empleadoSchema = new Schema({
  uidBiometrico:{ type: String, required: true, default:'' },
  nombre: { type: String, required: true },
  apellido1: { type: String, default:'' }, 
  apellido2: { type: String,default:'' },
  direccion: { type: String, default:'' },
  telefono: { type: String, default:'' },
  email: { type: String, default:'' },
  empresa: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
  departamento: { type: Schema.Types.ObjectId, ref: 'Departamento' },
  fechaIngreso: { type: Date },
  posicion: { type: String },
  sincronizadoBiometrico: { type: Boolean, default: false }
});

export const Empleado = mongoose.model('Empleado', empleadoSchema);
  