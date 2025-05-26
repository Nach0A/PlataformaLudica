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
