<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit;
}
$user = $_SESSION['usuario'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Buscaminas - Zentryx</title>

    <!-- Estilos del buscaminas -->
    <link rel="stylesheet" href="buscaminas.css" />
    <!-- Estilos del navbar -->
    <link rel="stylesheet" href="../navbar/navbar.css" />
    <!-- Bootstrap CSS para dropdown -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
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

    <!-- Buscaminas -->
    <header>
        <h1>Buscaminas</h1>
        <div id="header-original-scoreboard">
            <span id="mine-count">000</span>
            <button id="reset-button">Reiniciar</button>
            <span id="timer">000</span>
        </div>
    </header>

    <main id="game-container">
        <div class="difficulty-selector">
            <button id="easy-btn" class="active">Fácil</button>
            <button id="medium-btn">Medio</button>
            <button id="hard-btn">Difícil</button>
        </div>
        <div id="board"></div>
    </main>

    <div id="win-modal" class="modal hidden">
        <div class="modal-content">
            <h2 id="modal-title"></h2>
            <p>Tiempo: <span id="final-time"></span> segundos</p>
            <p>Minas: <span id="modal-mines"></span></p>
            <button id="play-again-button">Jugar de Nuevo</button>
        </div>
    </div>

    <!-- Scripts -->
    <script src="buscaminas.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Ocultar preloader al cargar
        window.addEventListener("load", () => {
            const pre = document.getElementById("preloader");
            pre.style.opacity = "0";
            pre.style.visibility = "hidden";
            pre.style.pointerEvents = "none";
        });
    </script>
</body>
</html>
