<?php
// mosqueta.php — Control de sesión y protección de la página
session_start();
require '../pagina-principal/db.php';

$user = $_SESSION['usuario'] ?? null;
if (!$user) {
    header("Location: ../pagina-principal/login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mosqueta - Zentryx</title>

        <link rel="icon" href="../navbar/imagenes/logo.jpg" type="image/jpeg" />
        <!-- Bootstrap -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="mosqueta.css" />
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

        <!-- HEADER -->
        <header>
            <div class="title-box">
                <h1 tabindex="0">Mosqueta</h1>
                <div class="game-desc">
                    <h3>Un juego de habilidad y concentración donde debes seguir en qué vaso se esconde la pelota.</h3>
                </div>
            </div>
            <div class="scoreboard">
                <span id="attempts" class="score-item">Intentos: 0</span>
                <span id="wins" class="score-item">Ganados: 0</span>
                <span id="streak" class="score-item">Racha: 0</span>

                <div class="difficulty-wrapper">
                    <button id="difficultyBtn" aria-expanded="false">Dificultad: Normal ▾</button>
                    <ul id="difficultyMenu" class="hidden" role="menu">
                        <li data-level="easy" role="menuitem">Fácil</li>
                        <li data-level="normal" role="menuitem" class="active">Normal</li>
                        <li data-level="hard" role="menuitem">Difícil</li>
                        <li data-level="impossible" role="menuitem">Imposible</li>
                    </ul>
                </div>
            </div>
        </header>
        <!-- FIN HEADER -->

        <!-- ÁREA DE JUEGO -->
        <main class="game-board">
            <!-- Las posiciones reales se cambian en JS -->
            <div class="cup" data-pos="0">
                <img src="imagenes/cup-neon2.svg" alt="Vaso 1" />
                <div class="ball"></div>
            </div>
            <div class="cup" data-pos="1">
                <img src="imagenes/cup-neon2.svg" alt="Vaso 2" />
                <div class="ball"></div>
            </div>
            <div class="cup" data-pos="2">
                <img src="imagenes/cup-neon2.svg" alt="Vaso 3" />
                <div class="ball"></div>
            </div>
        </main>
        <!-- FIN ÁREA DE JUEGO -->

        <!-- BANNERS -->
        <div id="resultBanner" class="result hidden"></div>
        <div id="feedbackBanner" class="feedback hidden"></div>
        <div id="nextBanner" class="next-banner hidden">SIGUIENTE JUEGO</div>

        <!-- Scripts -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
        <script src="mosqueta.js"></script>
        <script src="../navbar/script.js"></script>
    </body>
</html>