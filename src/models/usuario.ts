import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
  username: string;
  nombre: string;
  email: string;
  password: string;
  rol: string;
  empresa: mongoose.Schema.Types.ObjectId; // Referencia a la empresa

}

const usuarioSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'user', 'sysadmin'], default:'user' } ,
  empresa: { type: Schema.Types.ObjectId, ref: 'Company', required:false }
});

// Método para encriptar contraseña antes de guardar el usuario
usuarioSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error:any) {
    next(error);
  }
});

export const Usuario = mongoose.model<IUser>('Usuario', usuarioSchema);
