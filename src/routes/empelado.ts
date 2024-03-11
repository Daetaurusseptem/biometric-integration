import express from 'express';
import * as empleadoController from '../controllers/Empleados';

const router = express.Router();

router.post('/', empleadoController.crearEmpleado);

router.get('/empleado/:empresaId/:empleadoId', empleadoController.obtenerEmpleado);


router.get('/', empleadoController.obtenerEmpleados);
router.get('/:id', empleadoController.obtenerEmpleadoPorId);
router.put('/:id', empleadoController.actualizarEmpleado);
router.delete('/:id', empleadoController.eliminarEmpleado);
router.get('/by-department/:departmentId', empleadoController.getEmployeesByDepartmentId);

router.get('/company/all/:empresaId', empleadoController.getEmployeesCompany);




export default router;
