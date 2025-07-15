<?php
class conexion_BD
{
    private $servidor;
    private $usuario;
    private $pass;
    private $base;
    private $conexion;
    private $nombre;
    private $contrasenia;
    private $ini;

    public function __construct()
    {
        $this->servidor = "localhost";
        $this->usuario = "root";
        $this->pass = "";
        $this->base = "zentryx";
        $this->nombre = $_POST["nombre"];
        $this->contrasenia = $_POST["contrasenia"];
        $this->ini = $_POST["ini"];
        $this->conexion = $this->conectar($this->servidor, $this->usuario, $this->pass, $this->base);
    }

    public function conectar($servidor, $usuario, $pass, $base)
    {
        $conexion = new mysqli($servidor, $usuario, $pass, $base);
        if ($conexion->connect_error) {
            die("No se pudo conectar a la base: " . $conexion->connect_error);
        }
        return $conexion;
    }

    public function cerrarConexion()
    {
        if ($this->conexion) {
            $this->conexion->close();
        }
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    public function setContrasenia($contrasenia)
    {
        $this->contrasenia = $contrasenia;
    }

    public function getConexion()
    {
        return $this->conexion;
    }

    public function getServidor()
    {
        return $this->servidor;
    }

    public function getUsuario()
    {
        return $this->usuario;
    }

    public function getPass()
    {
        return $this->pass;
    }


    public function getBase()
    {
        return $this->base;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getContrasenia()
    {
        return $this->contrasenia;
    }

    public function getIni()
    {
        return $this->ini;
    }

    public function inicio($conexion, $nombre, $contrasenia)
    {
        $consulta = mysqli_query($conexion, "SELECT * FROM usuarios WHERE nom_usuario='{$nombre}' AND passwd='{$contrasenia}'");
        return mysqli_num_rows($consulta) > 0;
    }
    public function registro($conexion, $nombre, $contrasenia)
    {
        /* IMPLEMENTAR HASH PARA LAS CONTRASENIAS */
        $passwd = md5($contrasenia);
        $consulta = mysqli_query($conexion, "INSERT INTO `usuarios` (`nom_usuario`, `passwd`) VALUES ('{$nombre}', '{$passwd}')");
    }

    public function nombreUsado($conexion, $nombre){
        $consulta = mysqli_query($conexion, "SELECT * FROM usuarios WHERE nom_usuario='{$nombre}'");
        return mysqli_num_rows($consulta) > 0;
    }
}
