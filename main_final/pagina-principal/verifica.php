<?php
require_once "Conexion_BD.php";
session_start();
$nombre = $_POST["nombre"];
$contrasenia = $_POST["contrasenia"];
$bd = new Conexion_BD();
if ($bd->getIni() == 1) {
    if ($bd->inicio($bd->getConexion(), $bd->getNombre(), md5($bd->getContrasenia()))) {
        $_SESSION['usuario'] = $nombre;
        $bd->cerrarConexion();
        header("Location: Inicio.php");
        exit();
    } else {
        echo '<script type="text/javascript">
        window.location.href = "login.php";
        alert("Nombre o contrasenia incorrectos.");
        </script>';
        $bd->cerrarConexion();
        exit();
    }
} else {
    if ($bd->nombreUsado($bd->getConexion(), $nombre)) {
        $bd->cerrarConexion();
        echo "hola"; 
        echo '<script type="text/javascript">
        window.location.href = "login.php";
        alert("El usuario ya existe."); 
        </script>';
        exit();
    } else {
        $bd->registro($bd->getConexion(), $nombre, $contrasenia);
        $bd->cerrarConexion();
        $_SESSION['usuario'] = $nombre;
        header("Location: Inicio.php");
        exit();
    }
}