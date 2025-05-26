<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Plataforma Lúdica</title>
  <style>
    body { font-family: Arial; background: #f4f4f4; padding: 20px; }
    h1 { text-align: center; }
    form, table { margin: 20px auto; width: 90%; max-width: 600px; }
    table { border-collapse: collapse; background: #fff; }
    td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
    .btn { padding: 6px 12px; background: #007BFF; color: white; border: none; cursor: pointer; }
    .btn-danger { background: #dc3545; }
  </style>
</head>
<body>

<h1>Plataforma Lúdica</h1>

<!-- FORMULARIO PARA AGREGAR USUARIO -->
<form method="POST" action="usuarios.php">
  <h3>Agregar Usuario</h3>
  <input type="text" name="nombre" placeholder="Nombre del usuario" required />
  <input type="number" name="grupo_id" placeholder="ID del grupo (opcional)" />
  <button class="btn" type="submit" name="agregar_usuario">Agregar</button>
</form>

<!-- FORMULARIO PARA AGREGAR GRUPO -->
<form method="POST" action="grupos.php">
  <h3>Agregar Grupo</h3>
  <input type="text" name="nombre" placeholder="Nombre del grupo" required />
  <button class="btn" type="submit" name="agregar_grupo">Agregar</button>
</form>

<!-- TABLA DE USUARIOS -->
<h2>Usuarios</h2>
<table>
  <tr><th>ID</th><th>Nombre</th><th>Grupo</th><th>Puntos</th><th>Acciones</th></tr>
  <?php
  $conn = new mysqli("localhost", "root", "", "juego");

  $res = $conn->query("SELECT usuarios.*, grupos.nombre AS grupo FROM usuarios LEFT JOIN grupos ON usuarios.grupo_id = grupos.id");
  while($row = $res->fetch_assoc()) {
    echo "<tr>
      <td>{$row['id']}</td>
      <td>{$row['nombre']}</td>
      <td>{$row['grupo']}</td>
      <td>{$row['puntos']}</td>
      <td>
        <form method='POST' action='usuarios.php' style='display:inline'>
          <input type='hidden' name='id' value='{$row['id']}' />
          <button class='btn' name='sumar_punto'>+1</button>
        </form>
        <form method='POST' action='usuarios.php' style='display:inline'>
          <input type='hidden' name='id' value='{$row['id']}' />
          <button class='btn-danger' name='eliminar_usuario'>Borrar</button>
        </form>
      </td>
    </tr>";
  }
  ?>
</table>

<!-- TABLA DE GRUPOS -->
<h2>Grupos</h2>
<table>
  <tr><th>ID</th><th>Nombre</th><th>Puntos</th><th>Acciones</th></tr>
  <?php
  $res = $conn->query("SELECT * FROM grupos");
  while($row = $res->fetch_assoc()) {
    echo "<tr>
      <td>{$row['id']}</td>
      <td>{$row['nombre']}</td>
      <td>{$row['puntos']}</td>
      <td>
        <form method='POST' action='grupos.php' style='display:inline'>
          <input type='hidden' name='id' value='{$row['id']}' />
          <button class='btn' name='sumar_punto'>+1</button>
        </form>
        <form method='POST' action='grupos.php' style='display:inline'>
          <input type='hidden' name='id' value='{$row['id']}' />
          <button class='btn-danger' name='eliminar_grupo'>Borrar</button>
        </form>
      </td>
    </tr>";
  }
  $conn->close();
  ?>
</table>

</body>
</html>