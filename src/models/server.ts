import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


import usuarioRoutes from '../routes/usuario';
import empleadoRoutes from '../routes/empelado';
import empresaRoutes from '../routes/empresa';
import departamentoRoutes from '../routes/departamentos';
import asistenciaRoutes from '../routes/asistencias';
import horarioRoutes from '../routes/horarios';
import vacacionesRoutes from '../routes/vacaciones';
import authRoutes from '../routes/auth';
import syncRoutes from '../routes/sync';

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
    const mongoUri = 'mongodb+srv://jaimeson1305:Deusexvolta1305@cluster0.rew7wcv.mongodb.net/?retryWrites=true&w=majority'; 
    mongoose.connect(mongoUri)
      .then(() => console.log('Conexión a MongoDB establecida'))
      .catch(err => console.error(err));
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
