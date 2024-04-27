import { Request, Response } from 'express';
import { Empleado } from '../models/empleado';
import { Asistencia } from '../models/asistencias';
import mongoose, { Types } from 'mongoose';
import dayjs from 'dayjs';

export const generarReporteAsistenciaPorMes = async (req: Request, res: Response) => {
    const empresaId = req.params.empresaId;
    const departamentoId = req.query.departamentoId as string | undefined;
    const mes = req.query.mes as string;
    const year = req.query.year as string | undefined;

    // Valida que el mes está presente
    if (!mes||!year) {
        return res.status(400).json({ message: 'El mes y año son requeridos' });
    }

    // Determina el rango de fechas para el mes y año dados
    const fechaInicio = dayjs(`${year}-${mes}-01`).startOf('month').toDate();
    const fechaFin = dayjs(fechaInicio).endOf('month').toDate();

    console.log(fechaInicio);
    console.log(fechaFin);

    try {
        // Filtro base para empleados pertenecientes a la empresa
        const filtroEmpleados:any = { empresa: new Types.ObjectId(empresaId) };

        // Si se especifica departamentoId, agregamos el filtro por departamento
        if (departamentoId) {
            filtroEmpleados['departamento'] = new Types.ObjectId(departamentoId);
        }

        // Buscar empleados de la empresa (y departamento si se proporciona)
        const empleados = await Empleado.find(filtroEmpleados);

        // Extraer los IDs de los empleados para buscar sus asistencias
        const empleadosIds = empleados.map(emp => emp._id);

        // Obtener asistencias de los empleados en el rango del mes dado
        const asistencias:any = await Asistencia.find({
            empleado: { $in: empleadosIds },
            entrada: { $gte: fechaInicio, $lte: fechaFin },
        }).populate('empleado');

        // Formatear datos para el reporte
        const reporte = asistencias.map((asistencia:any) => ({
            empleadoNombre: asistencia.empleado.nombre,
            empleadoApellido: `${asistencia.empleado.apellido1} ${asistencia.empleado.apellido2}`,
            fechaEntrada: asistencia.entrada,
            fechaSalida: asistencia.salida,
            tipo: asistencia.tipo,
            detalles: asistencia.detalles
        }));

        // Envío de la respuesta con el reporte
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ message: `Error al generar el reporte de asistencia por mes: ${error}` });
    }
};
export const getResumenAsistencias = async (req: Request, res: Response)=> {
    try {
      // Asumiendo que recibes empresaId como parámetro
      const empresaId = req.params.empresaId;
  
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const finMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  
      // Obtener todos los empleados de la empresa
      const empleados = await Empleado.find({ empresa: new mongoose.Types.ObjectId(empresaId) });
  
      // Mapear los empleados a sus respectivos ID's para la consulta
      const empleadosIds = empleados.map(emp => emp._id);
  
      // Obtener las asistencias del mes actual
      const asistenciasMes = await Asistencia.aggregate([
        { $match: {
            empleado: { $in: empleadosIds },
            entrada: { $gte: inicioMes, $lte: finMes }
        }},
        { $group: {
            _id: { 
              day: { $dayOfMonth: "$entrada" },
              tipo: "$tipo"
            },
            count: { $sum: 1 }
        }},
        { $sort: { "_id.day": 1 } }
      ]);
  
      // Organizar los datos para el frontend
      const resumen = asistenciasMes.reduce((acc, asistencia) => {
        const day = asistencia._id.day;
        const tipo = asistencia._id.tipo;
  
        if (!acc[day]) {
          acc[day] = { asistencias: 0, inconsistencias: 0, faltas: 0 };
        }
  
        if (tipo === 'asistencia') {
          acc[day].asistencias += asistencia.count;
        } else if (tipo === 'inconsistencia') {
          acc[day].inconsistencias += asistencia.count;
        } else if (tipo === 'falta') {
          acc[day].faltas += asistencia.count;
        }
  
        return acc;
      }, {});
  
      res.json({ resumen });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el resumen de asistencias');
    }
  };