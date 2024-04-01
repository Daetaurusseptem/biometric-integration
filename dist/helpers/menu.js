"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuFrontEnd = void 0;
const getMenuFrontEnd = (rol = 'admin') => {
    const menu = [
        {
            id: '',
            title: '',
            icon: 'mdi mdi-gauge',
            submenu: []
        }
    ];
    if (rol === 'admin') {
        menu[0].title = 'Admin';
        menu[0].id = 'dashboard';
        menu[0].icon = 'bi bi-cone-striped';
        menu[0].submenu.unshift({ title: 'dashboard', url: '/dashboard', icon: 'bi bi-building-fill' }, { title: 'Usuarios', url: 'admin/users', icon: 'bi bi-people-fill' }, { title: 'Empleados', url: 'admin/employees', icon: 'bi bi-people-fill' }, { title: 'Asistencias', url: 'admin/employees/attendances', icon: 'bi bi-people-fill' });
    }
    if (rol === 'sysadmin') {
        menu[0].title = 'SYSADMIN TOOLS';
        menu[0].id = 'users';
        menu[0].icon = 'bi bi-people-fillS';
        menu[0].submenu.unshift({ title: 'Empresas', url: 'sysadmin/companies', icon: 'bi bi-building-fill' }, { title: 'Usuarios', url: 'sysadmin/users', icon: 'bi bi-people-fill' });
    }
    return menu;
};
exports.getMenuFrontEnd = getMenuFrontEnd;
