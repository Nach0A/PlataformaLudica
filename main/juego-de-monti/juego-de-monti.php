<?php
// memory.php — Control de sesión y protección de la página
session_start();
require '../pagina-principal/db.php';

$user = $_SESSION['usuario'] ?? null;
if (!$user) {
    header("Location: ../pagina-principal/login.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Juego Monty Hall</title>
        <link rel="icon" href="../navbar/imagenes/logo.jpg" type="img/jpeg" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="./juego-de-monti.css">
        <link rel="stylesheet" href="../navbar/navbar.css" />
    </head>

    <body>
        <!-- ======== PRELOADER ======== -->
        <div id="preloader">
            <img src="../navbar/imagenes/logo.jpg" alt="Logo Zentryx" id="preloader-logo">
        </div>
        <!-- ======= FIN PRELOADER ===== -->
        
        <!-- ======== NAVBAR ======== -->
        <nav class="navbar navbar-expand-lg shadow-sm py-3">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold fs-4" href="../pagina-principal/Inicio.php#inicio">
                    <img src="../navbar/imagenes/logo.jpg" alt="Logo" width="30" height="30"
                        class="d-inline-block align-text-top">
                    &nbsp;Zentryx
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <!-- Botón “Inicio” -->
                        <li class="nav-item">
                            <a class="nav-link" href="../pagina-principal/Inicio.php#inicio" id="linkInicio">Inicio</a>
                        </li>
                        <!-- Botón “Juegos” -->
                        <li class="nav-item">
                            <a class="nav-link" href="../pagina-principal/Inicio.php#juegos" id="linkJuegos">Juegos</a>
                        </li>
                    </ul>

                    <!-- PERFIL -->
                    <ul class="navbar-nav">
                        <li class="nav-item dropdown">
                            <a href="#" class="nav-link dropdown-toggle d-flex align-items-center" id="userDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="../navbar/imagenes/usuario2.jpg" alt="User" class="user-avatar shadow-sm" />
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end fade-menu">
                                <li>
                                    <a class="dropdown-item" href="#">
                                        Perfil (<?php echo htmlspecialchars($user); ?>)
                                    </a>
                                </li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li>
                                    <a class="dropdown-item" href="../pagina-principal/logout.php">
                                        Cerrar sesión
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <!-- CONTENIDO GENERAL (sin login) -->
            <div class="Contenido" id="Contenido">
                <div id="mainContent" class="container mt-5" style="display: none;"></div>
                <div class="container mt-5 position-relative" id="juegosContent" style="display: none;"></div>
            </div>
        <!-- FIN NAVBAR -->





        <div class="container">
            <h1 class="text-center">Juego Monty Hall</h1>
            <div id="game-container" class="text-center">
                <!-- Botón para iniciar el juego -->
                <button id="startButton" class="btn btn-primary">Iniciar Juego</button>

                <!-- Mensaje para el usuario -->
                <div id="message" style="margin-top:20px;">ñdflgsdklfgaljgslkjdfg</div>

                <!-- Contenedor de las puertas -->
                <div id="doors" style="display: none;">
                    <img data-door="0" id="door0" class="door"
                        src="./img/Flux_Dev_A_minimalist_image_of_a_simple_house_door_predominant_2.jpg"
                        alt="Puerta 1">
                    <img data-door="1" id="door1" class="door"
                        src="./img/Flux_Dev_A_minimalist_image_of_a_simple_house_door_predominant_2.jpg"
                        alt="Puerta 2">
                    <img data-door="2" id="door2" class="door"
                        src="./img/Flux_Dev_A_minimalist_image_of_a_simple_house_door_predominant_2.jpg"
                        alt="Puerta 3">
                </div>

                <!-- Contenedor para la decisión de cambiar o mantener -->
                <div id="switchContainer" style="display: none; margin-top:20px;">
                    <p>¿Deseas cambiar tu elección?</p>
                    <button id="switchButton" class="btn btn-warning">Cambiar</button>
                    <button id="stayButton" class="btn btn-secondary">Mantener</button>
                </div>
            </div>

            <!-- Panel de estadísticas -->
            <div id="stats-container">
                <h2>Estadísticas del Juego</h2>
                <div id="stats">
                    <!-- Se mostrarán estadísticas en tiempo real -->
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
        <script src="./juego-de-monti.js"></script>
        <script src="../navbar/script.js"></script>
    </body>
</html>