import { Request, Response } from 'express';
import { Asistencia } from '../models/asistencias';
import { Empleado } from '../models/empleado';
import { Horario } from '../models/horarios';
import mongoose from 'mongoose';
import moment from 'moment';
import dayjs from 'dayjs';

interface AsistenciaData {
  deviceUserId: string;
  tiempoRegistro: Date | string;
}


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


//MEJORADO
export const registrarAsistencias = async (req: Request, res: Response): Promise<Response> => {
  const { asistencias } = req.body;
  const empresaId = req.params.empresaId;

  // Agrupar asistencias por deviceUserId y luego por día
  const asistenciasAgrupadas: Record<string, Record<string, Date[]>> = asistencias.reduce((acc: any, asistencia: AsistenciaData) => {
    const { deviceUserId, tiempoRegistro } = asistencia;
    const fecha = dayjs(tiempoRegistro).format('YYYY-MM-DD');
    if (!acc[deviceUserId]) acc[deviceUserId] = {};
    if (!acc[deviceUserId][fecha]) acc[deviceUserId][fecha] = [];
    acc[deviceUserId][fecha].push(new Date(tiempoRegistro));
    return acc;
  }, {});

  const resultados: any[] = [];

  for (const deviceUserId in asistenciasAgrupadas) {
    const empleado = await Empleado.findOne({ empresa: empresaId, uidBiometrico: deviceUserId });

    if (!empleado) {
      resultados.push({ deviceUserId, resultado: 'Empleado no registrado en la empresa' });
      continue;
    }

    // Obtener el horario del departamento si existe
    let horario;
    if (empleado.departamento) {
      horario = await Horario.findOne({ departamento: empleado.departamento });
    }

    for (const fecha in asistenciasAgrupadas[deviceUserId]) {
      const tiempos = asistenciasAgrupadas[deviceUserId][fecha].sort((a, b) => a.getTime() - b.getTime());
      const entrada = tiempos[0];
      const salida = tiempos[tiempos.length - 1];
      
      let tipo = 'asistencia'; // Default tipo
      if (horario) {
        // Comparar horarios con los límites establecidos en el horario del departamento
        const horaEntrada = entrada.getHours() + entrada.getMinutes() / 60;
        const horaSalida = salida.getHours() + salida.getMinutes() / 60;

        if (horaEntrada > horario.limiteInicio! || horaSalida < horario.limiteSalida!) {
          tipo = 'inconsistencia';
        }
      } else if (tiempos.length === 1) {
        tipo = 'inconsistencia'; // Considerar una única asistencia como inconsistencia
      }

      try {
        const asistencia = await Asistencia.create({
          empleado: empleado._id,
          entrada,
          salida,
          tipo,
          detalles: tiempos.length > 1 ? '' : 'Solo una marca de tiempo registrada'
        });
        resultados.push({ deviceUserId, fecha, resultado: 'Registrado', asistenciaId: asistencia._id });
      } catch (error) {
        resultados.push({ deviceUserId, fecha, resultado: 'Error al registrar asistencia', error});
      }
    }
  }

  return res.json(resultados);
};
//
export const getEmpleadosEmpresaConAsistencias = async (req: Request, res: Response) => {
  const empresaId = req.params.empresaId;
  const page = parseInt(req.query.page as string) || 1;
  const {termino } = req.params;

  const limit = parseInt(req.query.limit as string) || 10;
  const { year, month } = req.query;
  // Valor del mes '01', '02', etc.
  console.log(req.query);
  // Valor del año '2024', '2025', etc.
  const skip = (page - 1) * limit;



  // Construir las fechas de inicio y fin del mes

  try {

    const startOfMonth = dayjs(`${year}-${month}-01`).startOf('month').toDate();
    const endOfMonth = dayjs(`${year}-${month}-01`).endOf('month').toDate();

    



    // Paso 1: Obtener empleados de la empresa y paginar

    console.log(startOfMonth, endOfMonth);
    const empleados = await Empleado.find({ empresa: empresaId })
      .skip(skip)
      .limit(limit);

    // Paso 2: Para cada empleado, obtener sus asistencias dentro del rango del mes proporcionado
    const empleadosConAsistencias = await Promise.all(empleados.map(async empleado => {
      const asistencias = await Asistencia.find({
        empleado: empleado._id,
        entrada: { $gte: startOfMonth, $lte: endOfMonth }
      });
      return {
        ...empleado.toObject(), // Utiliza toObject para evitar problemas con _doc
        asistencias
      };
    }));

    const totalEmpleados = await Empleado.countDocuments({ empresa: empresaId })

    res.status(200).json({
      ok: true,
      empleados: empleadosConAsistencias,
      totalEmpleados
    });
  } catch (error) {
    console.error("Error al obtener empleados con asistencias", error);
    res.status(500).json({ message: "Error al obtener empleados con asistencias", error });
  }
};

//ANTERIOR
export const registrarAsistenciasOLD = async (req: Request, res: Response) => {
  const { asistencias } = req.body;
  const { empresaId } = req.params;



  // Agrupar asistencias por deviceUserId
  const asistenciasPorUsuario: Record<string, Date[]> = asistencias.reduce((acc: Record<string, Date[]>, asistencia: AsistenciaData) => {
    const { deviceUserId, tiempoRegistro } = asistencia;
    if (!acc[deviceUserId]) {
      acc[deviceUserId] = [];
    }
    acc[deviceUserId].push(new Date(tiempoRegistro));
    return acc;
  }, {});


  // Procesar y registrar asistencias
  const resultados: Array<{ deviceUserId: string; resultado: string; asistenciaId?: mongoose.Types.ObjectId; error?: string }> = [];

  for (const deviceUserId of Object.keys(asistenciasPorUsuario)) {
    // Verificar si el usuario existe en la base de datos
    const empleadoExistente = await Empleado.findOne({ empresa: empresaId, uidBiometrico: deviceUserId });
    console.log('usuario:', deviceUserId, empresaId);
    console.log(empleadoExistente);
    if (!empleadoExistente) {
      // Si el empleado no existe, continúa con el siguiente
      resultados.push({ deviceUserId, resultado: 'Empleado no registrado en la empresa' });
      continue;
    }

    const tiempos = asistenciasPorUsuario[deviceUserId];
    console.log(tiempos);
    tiempos.sort((a, b) => a.getTime() - b.getTime());
    const entrada = tiempos[0];
    const salida = tiempos[tiempos.length - 1];

    if (entrada == salida) {
      const asistencia = await Asistencia.create({
        empleado: empleadoExistente._id, // Utiliza el _id del empleado existente
        entrada: entrada,
        salida: salida,
        tipo: 'inconsistencia',
      });
      continue;
    }

    try {
      const asistencia = await Asistencia.create({
        empleado: empleadoExistente._id, // Utiliza el _id del empleado existente
        entrada: entrada,
        salida: salida,
        tipo: 'asistencia',
      });
      resultados.push({ deviceUserId, resultado: 'Registrado', asistenciaId: asistencia._id });
    } catch (error: any) {
      resultados.push({ deviceUserId, resultado: 'Error al registrar asistencia', error: error });
    }
  }

  res.json(resultados);
}


export const getAsistenciasMes = async (req: Request, res: Response) => {
  const { empresaId } = req.params;
  const { month, year, departamentoId } = req.query; // Recibir mes y año como query params

  if (!month || !year) {
    return res.status(400).json({ message: 'Mes y año son requeridos' });
  }

  // Convertir mes y año a fechas de inicio y fin del mes
  const inicioMes = dayjs(`${year}-${month}-01`).startOf('month');
  const finMes = dayjs(inicioMes).endOf('month');
  console.log(inicioMes, finMes);

  try {
    let filtroEmpleados: any = { empresa: empresaId };

    // Agregar filtro por departamento si se proporciona
    if (departamentoId) {
      filtroEmpleados.departamento = departamentoId;
    }

    // Obtener los IDs de empleados que cumplen con el filtro
    const empleados = await Empleado.find(filtroEmpleados, '_id');

    // Mapear a un arreglo de IDs
    const empleadosIds = empleados.map(empleado => empleado._id);

    // Obtener asistencias de los empleados en el rango de fechas
    const asistencias = await Asistencia.find({
      empleado: { $in: empleadosIds },
      entrada: { $gte: inicioMes.toDate(), $lte: finMes.toDate() }
    }).populate('empleado');

    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las asistencias', error });
  }
};