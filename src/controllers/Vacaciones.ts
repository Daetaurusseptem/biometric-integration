import { Request, Response } from 'express';
import { Vacaciones } from '../models/vacaciones';
import { Empleado } from '../models/empleado';

export const solicitarVacaciones = async (req: Request, res: Response) => {
  try {
    const { empleadoId, fechaInicio, fechaFin } = req.body;
    const empleado = await Empleado.findById(empleadoId);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });

    const nuevaSolicitud = new Vacaciones({
      empleado: empleadoId,
      fechaInicio,
      fechaFin,
      aprobado: false // Por defecto no está aprobado
    });
    await nuevaSolicitud.save();
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const aprobarRechazarVacaciones = async (req: Request, res: Response) => {
  try {
    const { vacacionesId, aprobado } = req.body; // 'aprobado' es un booleano
    const vacaciones = await Vacaciones.findById(vacacionesId);
    if (!vacaciones) return res.status(404).json({ message: 'Solicitud de vacaciones no encontrada' });

    vacaciones.aprobado = aprobado;
    await vacaciones.save();
    res.json(vacaciones);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const obtenerVacaciones = async (req: Request, res: Response) => {
  try {
    const { empleadoId } = req.params;
    const vacaciones = await Vacaciones.find({ empleado: empleadoId });
    res.json(vacaciones);
  } catch (error) {
    res.status(500).json(error);
  }
};
