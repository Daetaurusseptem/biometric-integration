import express from 'express';
import * as empleadoController from '../controllers/Empleados';

const router = express.Router();

router.post('/', empleadoController.crearEmpleado);
router.get('/', empleadoController.obtenerEmpleados);
router.get('/:id', empleadoController.obtenerEmpleadoPorId);
router.put('/:id', empleadoController.actualizarEmpleado);
router.delete('/:id', empleadoController.eliminarEmpleado);
router.get('/by-department/:departmentId', empleadoController.getEmployeesByDepartmentId);


export default router;
