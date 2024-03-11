import { Request, Response } from 'express';
import { Horario } from '../models/horarios';
import { Departamento } from '../models/departamentos';

export const crearHorarioDepartamento = async (req: Request, res: Response) => {
  try {
    const { departamentoId, dias, horaInicio, horaFin } = req.body;
    const departamento = await Departamento.findById(departamentoId);
    if (!departamento) {
      return res.status(404).json({ message: 'Departamento no encontrado' });
    }

    const nuevoHorario = new Horario({ departamento: departamentoId, dias, horaInicio, horaFin });
    await nuevoHorario.save();
    res.status(201).json(nuevoHorario);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const actualizarHorarioDepartamento = async (req: Request, res: Response) => {
  try {
    const { departamentoId, dias, horaInicio, horaFin } = req.body;
    const horarioActualizado = await Horario.findOneAndUpdate(
      { departamento: departamentoId },
      { dias, horaInicio, horaFin },
      { new: true }
    );
    if (!horarioActualizado) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }
    res.json(horarioActualizado);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const obtenerHorarioDepartamento = async (req: Request, res: Response) => {
  try {
    const { departamentoId } = req.params;
    const horario = await Horario.findOne({ departamento: departamentoId });
    if (!horario) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }
    res.json(horario);
  } catch (error) {
    res.status(500).json(error);
  }
};
