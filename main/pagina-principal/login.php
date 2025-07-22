
<?php
session_start();       // Inicia o continúa la sesión, necesario para recordar al usuario
require 'db.php';      // Incluye el archivo que conecta a la base de datos MySQL

$alert = '';          // Variable para almacenar mensajes de error o éxito
$username = '';       // Guarda temporalmente el nombre de usuario ingresado

// Si se envió el formulario (por método POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $username = trim($_POST['username'] ?? '');  // Obtiene el usuario, eliminando espacios
    $password = $_POST['password'] ?? '';        // Obtiene la contraseña
    $action   = $_POST['action'] ?? '';          // Obtiene la acción: 'login' o 'register'

    // Validación: campos vacíos
    if (!$username || !$password) {
        $alert = '<div class="alert alert-danger">Por favor, completa ambos campos.</div>';
    } else {
        
        // Si el usuario quiere iniciar sesión
        if ($action === 'login') {
            
            // Prepara la consulta para buscar al usuario por su nombre
            $stmt = $mysqli->prepare("SELECT passwd FROM usuarios WHERE nom_usuario = ?");
            $stmt->bind_param('s', $username);  // Vincula el parámetro a la consulta
            $stmt->execute();
            $stmt->bind_result($storedPass);    // Recupera la contraseña almacenada

            // Si el usuario existe y la contraseña coincide
            if ($stmt->fetch() && $storedPass === $password) {
                $_SESSION['usuario'] = $username;           // Guarda el nombre de usuario en la sesión
                header("Location: inicio.php#inicio");      // Redirige al inicio
                exit;                                       // Termina la ejecución
            } else {
                // Error en usuario o contraseña
                $alert = '<div class="alert alert-danger">Nombre de usuario o contraseña incorrectos.</div>';
            }
            $stmt->close(); // Cierra la consulta
            
        // Si el usuario quiere registrarse
        } elseif ($action === 'register') {
            
            // Verifica si ya existe un usuario con ese nombre
            $stmt = $mysqli->prepare("SELECT COUNT(*) FROM usuarios WHERE nom_usuario = ?");
            $stmt->bind_param('s', $username);
            $stmt->execute();
            $stmt->bind_result($count); // Obtiene la cantidad de usuarios con ese nombre
            $stmt->fetch();
            $stmt->close();

            if ($count > 0) {
                // El nombre ya está en uso
                $alert = '<div class="alert alert-danger">El nombre de usuario ya está registrado.</div>';
            } else {
                // Registra al nuevo usuario
                $stmt = $mysqli->prepare("INSERT INTO usuarios (nom_usuario, passwd) VALUES (?, ?)");
                $stmt->bind_param('ss', $username, $password);
                
                if ($stmt->execute()) {
                    $_SESSION['usuario'] = $username;       // Inicia sesión automáticamente
                    header("Location: inicio.php#inicio");  // Redirige al inicio
                    exit;
                } else {
                    $alert = '<div class="alert alert-danger">Error al registrar. Intenta de nuevo.</div>';
                }
                $stmt->close();
            }
        }
    }
}

// Si el usuario ya está logueado, se muestra su nombre en el navbar
$user = $_SESSION['usuario'] ?? null;
?>


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión - Zentryx</title>

    <!-- Ícono de la pestaña -->
    <link rel="icon" href="imagenes/logo.jpg" type="image/jpeg">
    
    <!-- Bootstrap 5.3 para estilos rápidos -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Fuente Orbitron -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap" rel="stylesheet">
    
    <!-- css -->
    <link rel="stylesheet" href="estilo.css">
</head>
<body>

<!-- Preloader (pantalla de carga inicial con logo) -->
<div id="preloader">
    <img src="../navbar/imagenes/logo.jpg" alt="Logo Zentryx" id="preloader-logo">
</div>

<!-- NAVBAR -->
<nav class="navbar navbar-expand-lg shadow-sm py-3" style="background-color: rgb(20,20,20);">
    <div class="container-fluid">
        
        <!-- Logo y nombre de Zentryx -->
        <a class="navbar-brand fw-bold fs-4 text-white" href="login.php">
            <img src="../navbar/imagenes/logo.jpg" width="30" height="30" class="d-inline-block align-text-top">
            &nbsp;Zentryx
        </a>

        <!-- Botón de hamburguesa en móviles -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" color="white">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Menú de navegación -->
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <li class="nav-item"><a class="nav-link text-white" href="inicio.php#inicio">Inicio</a></li>
                
                <li class="nav-item"><a class="nav-link text-white" href="inicio.php#juegos">Juegos</a></li>
            </ul>

            <!-- Ícono de usuario y dropdown -->
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a href="#" class="nav-link dropdown-toggle d-flex align-items-center text-white" id="userDropdown" role="button" data-bs-toggle="dropdown">
                        <img src="../navbar/imagenes/usuario2.jpg" class="user-avatar shadow-sm">
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end fade-menu">
                        <!-- Si hay usuario logueado, muestra su perfil -->
                        <?php if ($user): ?>
                            <li><a class="dropdown-item" href="#">Perfil (<?php echo htmlspecialchars($user); ?>)</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="logout.php">Cerrar sesión</a></li>
                        <?php else: ?>
                            <!-- Si no hay sesión, muestra login/registro -->
                            <li><a class="dropdown-item" href="login.php">Iniciar sesión / Registrarse</a></li>
                        <?php endif; ?>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- Formulario de inicio de sesión / registro -->
<div class="container mt-5" id="loginForm">
    <h5 class="card-title text-center">Iniciar sesión / Registrarse</h5>
    
    <?php echo $alert; ?> <!-- Muestra alertas de error o éxito -->

    <form method="POST" novalidate>
        <div class="mb-3">
            <!-- Campo para el nombre de usuario -->
            <input type="text" name="username" class="form-control" placeholder="Nombre de usuario" required value="<?php echo htmlspecialchars($username); ?>">
        </div>
        
        <div class="mb-3">
            <!-- Campo para la contraseña -->
            <input type="password" name="password" class="form-control" placeholder="Contraseña" required>
        </div>
        
        <!-- Botones de acción -->
        <div class="d-grid gap-2">
            <button name="action" value="login" class="btn btn-primary">Iniciar sesión</button>
            <button name="action" value="register" class="btn btn-secondary">Registrarse</button>
        </div>
    </form>
</div>

<!-- Bootstrap JS (funcionamiento del navbar y componentes) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>

<!-- Script para ocultar el preloader al cargar la página -->
<script>
window.addEventListener("load", () => {
    const pre = document.getElementById("preloader");
    pre.style.opacity = "0";
    pre.style.visibility = "hidden";
    pre.style.pointerEvents = "none";
});
</script>

</body>
</html>
