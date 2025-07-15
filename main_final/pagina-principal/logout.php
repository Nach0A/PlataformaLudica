<?php
// Inicia o continúa la sesión actual
session_start();

// Elimina todas las variables de sesión
session_unset();

// Destruye completamente la sesión
session_destroy();

// Redirige al usuario a la página de login
header("Location: login.php");

// Finaliza la ejecución del script para asegurarse de que no se ejecute más código
exit;
?>
