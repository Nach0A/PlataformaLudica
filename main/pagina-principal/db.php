<?php
// Parámetros de conexión a la base de datos
$host = "localhost";    
$user = "root";         // Usuario de MySQL
$password = "";         // Contraseña del usuario
$db = "zentryx";        // Nombre de la base de datos

// Crear la conexión usando MySQLi
$mysqli = new mysqli($host, $user, $password, $db);

// Comprobar si ocurrió un error al conectar
if ($mysqli->connect_errno) {
    // Si hay error, se muestra y se detiene la ejecución
    die("Error al conectar a la base de datos: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
}
?>
