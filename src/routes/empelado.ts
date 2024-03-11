import express from 'express';
import * as empleadoController from '../controllers/Empleados';

const router = express.Router();

router.post('/', empleadoController.crearEmpleado);
<<<<<<< HEAD
router.get('/empleado/:empresaId/:empleadoId', empleadoController.obtenerEmpleado);
=======
>>>>>>> 97797fca8e8ec0a100b4c30265d2f3c1d6e06a89
router.get('/', empleadoController.obtenerEmpleados);
router.get('/:id', empleadoController.obtenerEmpleadoPorId);
router.put('/:id', empleadoController.actualizarEmpleado);
router.delete('/:id', empleadoController.eliminarEmpleado);
router.get('/by-department/:departmentId', empleadoController.getEmployeesByDepartmentId);
<<<<<<< HEAD
router.get('/company/all/:empresaId', empleadoController.getEmployeesCompany);
=======
>>>>>>> 97797fca8e8ec0a100b4c30265d2f3c1d6e06a89


export default router;
