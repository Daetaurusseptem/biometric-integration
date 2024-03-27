import { Request, Response } from "express";
import { Empleado } from "../models/empleado";
import { Asistencia } from "../models/asistencias";

// Importaciones necesarias
const ZKJUBAER = require("zk-jubaer");


// Controlador para sincronizar todos los empleados desde el dispositivo biométrico
export const sincronizarDatosBiometricos = async (req: Request, res: Response) => {
    const { deviceIp } = req.body; // Recibir la IP del dispositivo biométrico como parte de la solicitud
    const { empresaId } = req.params; // Recibir el id de la empresa
    console.log(deviceIp);
    let zk = new ZKJUBAER(deviceIp, 4370, 5200, 5000);

    try {

        await zk.createSocket();
    } catch (error) {
        console.log(error);
    }



    try {
        // Crear socket para la máquina 

        // Obtener todos los usuarios del dispositivo biométrico
        const users = await zk.getUsers();
        console.log("Usuarios obtenidos del dispositivo biométrico:", users);

        // Procesar cada usuario obtenido del dispositivo biométrico
        for (const user of users.data) {
            const { uid, name, role, deviceUserId } = user;

            let empleado = await Empleado.findOne({ deviceUserId });
            if (!empleado) {
                // Crear un nuevo empleado si no existe
                    empleado = new Empleado({
                    uidBiometrico: deviceUserId,
                    nombre: name,
                    role: role,
                    sincronizadoBiometrico: true,
                    empresa: empresaId

                });
                await empleado.save();
            } else {
                // Actualizar datos del empleado existente
                await Empleado.findByIdAndUpdate(empleado._id, {
                    nombre: name,
                    role: role,
                    userIdBiometrico: deviceUserId,
                    sincronizadoBiometrico: true
                });
            }
        }

        // Desconectar del dispositivo 
        await zk.disconnect();
        res.status(200).json({ message: 'Sincronización de empleados completa' });
    } catch (error) {
        console.error("Error al sincronizar datos con el dispositivo biométrico:", error);
        await zk.disconnect();
        res.status(500).json({ error: "Error en la sincronización de datos" });
    }
};



export const sincronizarAsistenciasTotales = async (req: Request, res: Response) => {
    const { deviceIp } = req.body; // Recibir la IP del dispositivo biométrico como parte de la solicitud
    const { empresaId } = req.params    ; // Recibir el id de la empresa
    console.log(deviceIp);
    let zk = new ZKJUBAER(deviceIp, 4370, 5200, 5000);
    
    try {

        try {

            await zk.createSocket();
        } catch (error) {
            console.log(error);
        }
        const info= await zk.getInfo()
        if(info.logCounts>0){
            const logs = await zk.getAttendances()
            console.log(logs)
          }else{
            await zk.disconnect()
            return res.status(200).json({
                ok:true,
                msg:`No hay asistencias registradas en el dispositivo ${deviceIp}`
            })
          }
       
        const att = await zk.getAttendances()
        const asistenciasBiometrico = att.data
       
        // Transformar asistencias a objetos de fecha para poder manejarlos
        asistenciasBiometrico.forEach((asistencia: { recordTime: string | number | Date; }) => {
            asistencia.recordTime = new Date(asistencia.recordTime);
        });

        for (const asistencia of asistenciasBiometrico) {
            const deviceUserId = asistencia.deviceUserId;

            // Encuentra al empleado basado en el deviceUserId y empresaId
            const empleado = await Empleado.findOne({ uidBiometrico: deviceUserId, empresa: empresaId });
            if (!empleado) {
                console.log(`Empleado con UID ${deviceUserId} no encontrado o no pertenece a la empresa ${empresaId}.`);
                continue; // Saltar al siguiente registro si el empleado no existe o no pertenece a la empresa
            }

            // Crear y guardar la asistencia
            const nuevaAsistencia = new Asistencia({
                empleado: empleado._id,
                fechaHora: asistencia.recordTime,
                tipo: 'asistencia', // Considerar todos los registros como asistencias
                detalles: 'Registro biométrico' // Detalle genérico para cada asistencia
            });
            await zk.clearAttendanceLog(); 
            await nuevaAsistencia.save(); 
        }
        
        await zk.disconnect()
        res.status(200).json({ message: 'Todas las asistencias han sido sincronizadas correctamente.' });
    } catch (error) {
        await zk.disconnect();
        console.error('Error al sincronizar asistencias:', error);
        return res.status(500).json({ error: 'Error al procesar las asistencias.' });
        
    }
};

export const agregarAsistenciaIndividual = async (req: Request, res: Response) => {
    try {
        console.log('individual');
      const { empleado, fechaHora, tipo, detalles } = req.body;
      
  
      // Verificar si el empleado existe
      const empleadoExiste = await Empleado.findOne({uidBiometrico:empleado});
      if (!empleadoExiste) {
        return res.status(404).json({ message: "Empleado no encontrado." });
      }
  
      // Crear la asistencia
      const nuevaAsistencia = new Asistencia({
        empleado:empleadoExiste.id,
        fechaHora,
        tipo,
        detalles
      });
  
      // Guardar la asistencia en la base de datos
      await nuevaAsistencia.save();
  
      res.status(201).json({ message: "Asistencia agregada con éxito.", asistencia: nuevaAsistencia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al agregar la asistencia.", error });
    }
  };