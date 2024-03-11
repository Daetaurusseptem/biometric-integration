import { Request, Response } from 'express';
import { Departamento } from '../models/departamentos';
import { Empleado } from '../models/empleado';

export const crearDepartamento = async (req: Request, res: Response) => {
  try {
    console.log('Crear departamento');
    const nuevoDepartamento = new Departamento(req.body);
    const departamentoGuardado = await nuevoDepartamento.save();
    res.status(201).json(departamentoGuardado);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const obtenerDepartamentos = async (req: Request, res: Response) => {
  try {
    const departamentos = await Departamento.find();
    res.status(200).json({ok:true, departamentos});
  } catch (error) {
    res.status(500).json(error);
  }
};

export const obtenerDepartamentosEmpresa = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params
    const departamentos = await Departamento.find({empresa:empresaId});
    res.status(200).json({ok:true, departamentos});
  } catch (error) {
    res.status(500).json(error);
  }
};

export const obtenerDepartamentoPorId = async (req: Request, res: Response) => {
  try {
    const departamento = await Departamento.findById(req.params.id)
    if (!departamento) return res.status(404).json({ message: 'Departamento no encontrado' });
    res.status(200).json({departamento});
  } catch (error) {
    res.status(500).json(error);
  }
};

export const actualizarDepartamento = async (req: Request, res: Response) => {
  try {
    const departamentoActualizado = await Departamento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!departamentoActualizado) return res.status(404).json({ message: 'Departamento no encontrado' });
    res.json(departamentoActualizado);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const eliminarDepartamento = async (req: Request, res: Response) => {
  try {
    const departamentoEliminado = await Departamento.findByIdAndDelete(req.params.id);
    if (!departamentoEliminado) return res.status(404).json({ message: 'Departamento no encontrado' });
    res.status(200).json({ message: 'Departamento eliminado' });
  } catch (error) {
    res.status(500).json(error);
  }
};
 