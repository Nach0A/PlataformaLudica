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
