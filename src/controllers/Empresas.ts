import { Request, Response } from 'express';
import { Empresa } from '../models/empresa';
import { Usuario } from '../models/usuario';


export const asignarAdmin =  async(req:Request, res:Response)=> {
  const { adminId, empresaId } = req.body;

  try {
    // Verificar si el usuario es admin
    const usuario = await Usuario.findById(adminId);
    if (!usuario || usuario.rol !== 'admin') {
      return res.status(400).send('Usuario no válido o no es administrador.');
    }

    // Verificar si el usuario ya es admin de otra empresa
    const empresaExistente = await Empresa.findOne({ admin: adminId });
    if (empresaExistente) {
      return res.status(400).send('El usuario ya es administrador de otra empresa.');
    }

    // Asignar admin a la empresa
    const empresa = await Empresa.findByIdAndUpdate(empresaId, { admin: adminId }, { new: true });
    if (!empresa) {
      return res.status(404).send('Empresa no encontrada.');
    }

    res.json({empresa});
  } catch (error) {
    res.status(500).json(error);
  }
}


export const crearEmpresa = async (req: Request, res: Response) => {
  try {
    const nuevaEmpresa = new Empresa(req.body);
    
    const empresaGuardada = await nuevaEmpresa.save();

    
    const admin = await Usuario.findByIdAndUpdate(req.body.admin,{empresa:empresaGuardada._id})
    
    res.status(201).json(
      {
        ok:true, 
        administrador: admin,
        empresaGuardada
      }
      );
  } catch (error) {
    res.status(500).json(error);
  }
};

export const obtenerEmpresas = async (req: Request, res: Response) => {
  try {
    const empresas = await Empresa.find();
    res.json({ok:true, empresas});
  } catch (error) {
    res.status(500).json(error);
  }
};

export const obtenerEmpresaPorId = async (req: Request, res: Response) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });
    res.json({
      ok:true,
      empresa
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const actualizarEmpresa = async (req: Request, res: Response) => {
  try {
    const empresaActualizada = await Empresa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!empresaActualizada) return res.status(404).json({ message: 'Empresa no encontrada' });
    res.json(empresaActualizada);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const eliminarEmpresa = async (req: Request, res: Response) => {
  try {

    

    const empresaEliminada = await Empresa.findByIdAndDelete(req.params.id);
    if (!empresaEliminada) return res.status(404).json({ message: 'Empresa no encontrada' });
    const adminEmpresa = await Usuario.findOneAndUpdate({empresa:req.params.id}, { $set: { empresa: null } }, { new: true })
    res.status(200).json({ message: 'Empresa eliminada' });
  } catch (error) {
    res.status(500).json(error);
  }
};
