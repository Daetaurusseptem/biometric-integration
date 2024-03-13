import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


import usuarioRoutes from '../routes/usuario.js';
import empleadoRoutes from '../routes/empelado.js';
import empresaRoutes from '../routes/empresa.js';
import departamentoRoutes from '../routes/departamentos.js';
import asistenciaRoutes from '../routes/asistencias.js';
import horarioRoutes from '../routes/horarios.js';
import vacacionesRoutes from '../routes/vacaciones.js';
import authRoutes from '../routes/auth.js';
import syncRoutes from '../routes/sync.js';

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(cors()); 
    this.app.use(express.json());
    this.connectToMongoDB();
  }

  private connectToMongoDB(): void {
    mongoose.connect(process.env.mongoUri!)
      .then(() => console.log('Conexión a MongoDB establecida'))
      .catch((err: any) => console.error(err));
  }

  private routes(): void {
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/usuarios', usuarioRoutes);
    this.app.use('/api/empleados', empleadoRoutes);
    this.app.use('/api/empresas', empresaRoutes);
    this.app.use('/api/departamentos', departamentoRoutes);
    this.app.use('/api/asistencias', asistenciaRoutes);
    this.app.use('/api/horarios', horarioRoutes);
    this.app.use('/api/vacaciones', vacacionesRoutes);
    this.app.use('/api/sync', syncRoutes);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`); 
    });
  }
}

export default new Server();
