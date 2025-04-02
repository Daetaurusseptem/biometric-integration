import { Request, Response } from 'express';
import { Empleado } from '../models/empleado';
import { Horario } from '../models/horarios';
import { Asistencia } from '../models/asistencias';
import { Departamento } from '../models/departamentos';

export const crearEmpleado = async (req: Request, res: Response) => {
  try {

    const {nombre, departamento, empresa} = req.body;
    
    //validaciones de momento no disponibles para datos rellenables ya que los empleados son creados obteniendolos de el biometrico al sync script y de ahi aqui (API)
    // const departamentoDb = await Departamento.find({empresa, _id:departamento});
    // if(departamento!=='' ||undefined||null ){
    //   if(!departamentoDb){
    //   res.status(404).json({
    //     ok:false,
    //     msg:'El departamento no existe'
    //   })
    //   }
    // }
   
    
     if(nombre == ''||undefined||null){
       req.body.nombre = 'no definido'
     }
    

    
    const nuevoEmpleado = new Empleado(req.body);
     
    const empleadoGuardado = await nuevoEmpleado.save();
    res.status(201).json({
  
        empleado:empleadoGuardado
        
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getAsistenciasPaginadas = async (req:Request, res:Response) => {
  // Conversión explícita a String para evitar problemas de tipos
  const empresaId = req.params.empresaId!.toString();
  const departamentoId = req.query.departamentoId ? req.query.departamentoId.toString() : null;
  const terminoBusqueda = req.query.terminoBusqueda ? req.query.terminoBusqueda.toString() : '';
  const numeroRegistros = parseInt(req.query.numeroRegistros as string) || 5;
  const pagina = parseInt(req.query.pagina as string) || 1;
  const skip = (pagina - 1) * numeroRegistros;

  try {
      // Buscar empleados que pertenezcan a la empresa (y opcionalmente al departamento)
      let filtroEmpleados:any = { empresa: empresaId };
      if (departamentoId) filtroEmpleados.departamento = departamentoId;
      if (terminoBusqueda) filtroEmpleados.$text = { $search: terminoBusqueda };
      console.log(filtroEmpleados);

      const empleados = await Empleado.find(filtroEmpleados).select('_id');
      const empleadoIds = empleados.map(empleado => empleado._id);

      // Filtro para asistencias que pertenecen a los empleados encontrados
      const filtroAsistencias = { empleado: { $in: empleadoIds } };
      const asistencias = await Asistencia.find(filtroAsistencias)
          .populate('empleado', 'nombre apellido1 apellido2')
          .skip(skip)
          .limit(numeroRegistros);

      const totalAsistencias = await Asistencia.countDocuments(filtroAsistencias);

      res.json({
          pagina,
          paginas: Math.ceil(totalAsistencias / numeroRegistros),
          totalAsistencias,
          asistencias
      });
  } catch (error) {
      res.status(500).send({ message: "Error al obtener las asistencias", error });
  }
};

export const obtenerEmpleado = async (req: Request, res: Response) => {
  try {
    console.log('empleado chavon');
    const {empleadoId, empresaId}=req.params
    const empleado = await Empleado.findOne({uidBiometrico:empleadoId, empresa:empresaId}).populate('empresa departamento');
    res.status(200).json({ok:true, empleado});
  } catch (error) {
    res.status(500).json(error);
  }
};
export const obtenerEmpleados = async (req: Request, res: Response) => {
  console.log('empleados chavones');
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
export const getEmployeesCompany = async (req: Request, res: Response) => {
  try {
      const empresaId = req.params.empresaId;
      const employees = await Empleado.find({ empresa: empresaId });
      res.status(200).json({ok:true, empleados:employees});
  } catch (error) {
      res.status(500).json(error);
  }
};

export const obtenerEmpleadoPorId = async (req: Request, res: Response) => {
  try {
    const empleado = await Empleado.findById(req.params.id).populate('empresa departamento');
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.status(200).json({ok:true, empleado});
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const actualizarEmpleado = async (req: Request, res: Response) => {
  try {
    console.log('update empleado');
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