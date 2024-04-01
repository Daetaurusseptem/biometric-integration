export const getMenuFrontEnd = (rol = 'admin') => {
  const menu: any =
    [
      {
        id: '',
        title: '',
        icon: 'mdi mdi-gauge',
        submenu: []
      }
    ];



  if (rol === 'admin') {
    menu[0].title = 'Admin'
    menu[0].id = 'dashboard'
    menu[0].icon = 'bi bi-cone-striped'
    menu[0].submenu.unshift(
       { title: 'dashboard', url: '/dashboard', icon: 'bi bi-building-fill' },
       { title: 'Usuarios', url: 'admin/users', icon: 'bi bi-people-fill' },
       { title: 'Empleados', url: 'admin/employees', icon: 'bi bi-people-fill' },
       { title: 'Asistencias', url: 'admin/employees/attendances', icon: 'bi bi-people-fill' },
      // { title: 'Productos', url: 'admin/products', icon: 'bi bi-bag-fill' },
      // { title: 'Proveedores', url: 'admin/products', icon: 'bi bi-file-earmark-person' },
      // { title: 'Lotes', url: 'admin/products', icon: 'bi bi-box2-fill' },
      // { title: 'Categorias', url: 'admin/categories', icon: 'bi bi-bookmark-fill' },
    


    );  
  }

  if (rol === 'sysadmin') {

    menu[0].title = 'SYSADMIN TOOLS'
    menu[0].id = 'users'
    menu[0].icon = 'bi bi-people-fillS'
    menu[0].submenu.unshift(
      { title: 'Empresas', url: 'sysadmin/companies', icon: 'bi bi-building-fill' },
      { title: 'Usuarios', url: 'sysadmin/users', icon: 'bi bi-people-fill' },

    );
  }


  return menu
}