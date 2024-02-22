import { Request, Response } from 'express';
import { Asistencia } from '../models/asistencias';
import { Empleado } from '../models/empleado';

export const registrarAsistencia = async (req: Request, res: Response) => {
  try {
    const { empleadoId, fechaHora, tipo, detalles } = req.body;
    const empleado = await Empleado.findById(empleadoId);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });

    const nuevaAsistencia = new Asistencia({ empleado: empleadoId, fechaHora, tipo, detalles });
    await nuevaAsistencia.save();
    res.status(201).json(nuevaAsistencia);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const obtenerAsistencias = async (req: Request, res: Response) => {
  try {
    const asistencias = await Asistencia.find().populate('empleado');
    res.json(asistencias);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const obtenerAsistenciasEmpleado = async (req: Request, res: Response) => {
  try {
    const { empleadoId } = req.params;
    const asistencias = await Asistencia.find({ empleado: empleadoId });
    res.json(asistencias);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const actualizarAsistencia = async (req: Request, res: Response) => {
  try {
    const { asistenciaId, detalles } = req.body;
    const asistenciaActualizada = await Asistencia.findByIdAndUpdate(asistenciaId, { detalles }, { new: true });
    if (!asistenciaActualizada) return res.status(404).json({ message: 'Asistencia no encontrada' });
    res.json(asistenciaActualizada);
  } catch (error) { 
    res.status(500).json(error);
  }
};

export const eliminarAsistencia = async (req: Request, res: Response) => {
  try {
    const asistenciaEliminada = await Asistencia.findByIdAndDelete(req.params.id);
    if (!asistenciaEliminada) return res.status(404).json({ message: 'Asistencia no encontrada' });
    res.status(200).json({ message: 'Asistencia eliminada' });
  } catch (error) {
    res.status(500).json(error);
  }
};
