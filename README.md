<h2>How It Works</h2>
<h3>Overview of a Simple Three-Node Implementation</h3>
<ul>
    <li>
        <h4>Biometric Node</h4>
        <p>This node captures all attendance data throughout the day and stores it for processing.</p>
    </li>
    <li>
        <h4>Scripting Nodes</h4>
        <p>These scripts facilitate connectivity through a local network to a web API:</p>
        <ul>
            <li>
                <h5>Attendance Synchronizer</h5>
                <p>This script gathers all attendance records over a specified period, such as 24 hours, sends this data to an API endpoint for processing, and stores it in a database.</p>
            </li>
            <li>
                <h5>New Employee Synchronizer</h5>
                <p>This manual script synchronizes new users by integrating them into the database via the API each time a new user is registered. It must be run manually whenever a new employee is added.</p>
            </li>
        </ul>
    </li>
    <li>
        <h4>API Features</h4>
        <ul>
            <li>
                <h5>Basic CRUD Operations</h5>
                <p>Enables basic actions on established system models, facilitating data management.</p>
            </li>
            <li>
                <h5>Useful Endpoints</h5>
                <p>These endpoints enhance the API's functionality, supporting various integrations and data flows.</p>
            </li>
        </ul>
    </li>
    <li>
        <h4>Web Application</h4>
        <p>A user interface that allows for interaction with and management of the system's functions.</p>
    </li>
</ul>

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>System Architecture</title>
<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .box {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    margin: 10px;
    background-color: #E0BBE4;
    width: 180px;
  }
  .central-box {
    flex: 100%;
    text-align: center;
  }
  h3 {
    font-size: 1em;
    color: #5A1A5B;
  }
  ul {
    padding-left: 20px;
    list-style-type: none;
  }
  li::before {
    content: "• ";
    color: #5A1A5B;
  }
  .arrow {
    margin: 0 20px;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 50px solid #E0BBE4;
  }
</style>
</head>
<body>
<div class="container">
  <div class="box">
    <h3>Computadora</h3>
    <ul>
      <li>Puente Biometrico/Api Web</li>
    </ul>
  </div>
  <div class="box">
    <h3>Script/Daemon</h3>
    <ul>
      <li>Sincronización de usuarios</li>
      <li>Sincronización de asistencias</li>
    </ul>
  </div>
  <div class="box">
    <h3>Biometrico</h3>
    <ul>
      <li>Registro de nuevos usuarios.</li>
      <li>Ponchado de asistencias.</li>
      <li>Control de acceso.</li>
    </ul>
  </div>
  <div class="arrow central-box"></div>
  <div class="box">
    <h3>API</h3>
    <ul>
      <li>Registro de Asistencia</li>
      <li>Servicio de Informacion</li>
      <li>Gestión de Sesión</li>
    </ul>
  </div>
  <div class="arrow central-box"></div>
  <div class="box">
    <h3>Base de Datos</h3>
    <ul>
      <li>Almacenamiento</li>
      <li>Acceso</li>
      <li>Seguridad y redundancia</li>
      <li>Consistencia</li>
    </ul>
  </div>
  <div class="arrow central-box"></div>
  <div class="box">
    <h3>Interfaz web</h3>
    <ul>
      <li>Acceso a la información</li>
      <li>Edición de registros</li>
      <li>Generar Reportes</li>
    </ul>
  </div>
</div>
</body>

