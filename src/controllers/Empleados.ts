import { Request, Response } from 'express';
import { Empleado } from '../models/empleado';
import { Horario } from '../models/horarios';
import { Asistencia } from '../models/asistencias';

export const crearEmpleado = async (req: Request, res: Response) => {
  try {
    const nuevoEmpleado = new Empleado(req.body);
    const empleadoGuardado = await nuevoEmpleado.save();
    res.status(201).json({


        empleado:empleadoGuardado
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const obtenerEmpleados = async (req: Request, res: Response) => {
  try {
    const empleados = await Empleado.find().populate('empresa departamento');
    res.json(empleados);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getEmployeesByDepartmentId = async (req: Request, res: Response) => {
  try {
      const departmentId = req.params.departmentId;
      const employees = await Empleado.find({ departamento: departmentId });
      res.status(200).json({empleado:employees});
  } catch (error) {
      res.status(500).json(error);
  }
};

export const obtenerEmpleadoPorId = async (req: Request, res: Response) => {
  try {
    const empleado = await Empleado.findById(req.params.id).populate('empresa departamento');
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const actualizarEmpleado = async (req: Request, res: Response) => {
  try {
    const empleadoActualizado = await Empleado.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('empresa departamento');
    if (!empleadoActualizado) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.json(empleadoActualizado);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const eliminarEmpleado = async (
req: Request, res: Response) => {
try {
const empleadoEliminado = await Empleado.findByIdAndDelete(req.params.id);
if (!empleadoEliminado) return res.status(404).json({ message: 'Empleado no encontrado' });
res.status(200).json({ message: 'Empleado eliminado' });
} catch (error) {
res.status(500).json(error);
}
};

export const asignarHorarioEmpleado = async (req: Request, res: Response) => {
try {
const { empleadoId, horario } = req.body;
const empleado = await Empleado.findById(empleadoId);
if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });

const horarioAsignado = new Horario({ ...horario, empleado: empleadoId });
await horarioAsignado.save();
res.json(horarioAsignado);
} catch (error) {
res.status(500).json(error);
}
};

export const registrarAsistencia = async (req: Request, res: Response) => {
try {
const nuevaAsistencia = new Asistencia({
empleado: req.body.empleado,
fechaHora: new Date(req.body.fechaHora),
tipo: req.body.tipo
});
await nuevaAsistencia.save();
res.status(201).json(nuevaAsistencia);
} catch (error) {
res.status(500).json(error);
}
};