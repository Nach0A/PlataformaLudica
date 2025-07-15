<?php
session_start();

// Si no hay usuario en sesión, va al login
$user = $_SESSION['usuario'] ?? null;
if (!$user) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inicio - Zentryx</title>
    <link rel="icon" href="imagenes/logo.jpg" type="image/jpeg">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="estilo.css">
</head>

<body>
    <!-- PRELOADER -->
    <div id="preloader">
        <img src="../navbar/imagenes/logo.jpg" alt="Logo Zentryx" id="preloader-logo">
    </div>

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg shadow-sm py-3" style="background-color: rgb(20,20,20);">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold fs-4 text-white" href="#inicio" id="linkLogo">
                <img src="../navbar/imagenes/logo.jpg" width="30" height="30" class="d-inline-block align-text-top">
                &nbsp;Zentryx
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <!-- Botones Inicio / Juegos -->
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link text-white" href="#" id="linkInicio">Inicio</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link text-white" href="#" id="linkJuegos">Juegos</a>
                    </li>
                </ul>

                <!-- Dropdown perfil -->
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle d-flex align-items-center text-white"
                            id="userDropdown" role="button" data-bs-toggle="dropdown">
                            <img src="../navbar/imagenes/usuario2.jpg" class="user-avatar shadow-sm">
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end fade-menu">
                            <li>
                                <a class="dropdown-item" href="#">Perfil (<?php echo htmlspecialchars($user); ?>)</a>
                            </li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li>
                                <a class="dropdown-item" href="logout.php">Cerrar sesión</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- CONTENIDO GENERAL -->
    <div class="Contenido" id="Contenido">
        <!-- SECCIÓN INICIO: saludo al usuario -->
        <div id="mainContent" class="container mt-5" style="display: none;">
            <h1 class="text-center">Bienvenido, <?php echo htmlspecialchars($user); ?>, a Zentryx</h1>
            <p class="text-center">(Página de inicio)</p>
        </div>

        <!-- SECCIÓN JUEGOS: lista de juegos -->
        <div class="container-fluid juegos-wrapper" id="juegosContent" style="display: none;">
            <h1 class="titulo-juegos text-center">Juegos Disponibles</h1>

            <div class="grid-juegos">
                <div class="tarjeta-juego">
                    <h2>Memory</h2>
                    <p>Pon a prueba tu memoria encontrando pares en el menor tiempo posible.</p>
                    <button class="play-btn" onclick="location.href='../memory/memory.php'">Jugar</button>
                </div>

                <div class="tarjeta-juego">
                    <h2>Buscaminas</h2>
                    <p>Intenta identificar el lugar de todas las minas lo más rapido posible.<br>
                        Cuenta con 3 niveles de dificultad: fácil, medio y difícil.</p>
                    <button class="play-btn" onclick="location.href='../buscaminas/buscaminas.php'">Jugar</button>
                </div>

                <div class="tarjeta-juego">
                    <h2>Mosqueta</h2>
                    <p>Intenta seguir el ritmo de los vasos sin perder de vista la pelota</p>
                    <button class="play-btn" onclick="location.href='../mosqueta/mosqueta.php'">Jugar</button>
                </div>

                <div class="tarjeta-juego">
                    <h2>Juego de Monti</h2>
                    <p>Pon a prueba tu suerte y astusia para encontrar el premio</p>
                    <button class="play-btn" onclick="location.href='../juego-de-monti/juego-de-monti.php'">Jugar</button>
                </div>


                <!-- aca ponemos más tarjetas para el futuro -->
            </div>

        </div>
    </div>

    <!-- SCRIPTS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Referencias
        const mainContent = document.getElementById("mainContent");
        const juegosContent = document.getElementById("juegosContent");
        const linkInicio = document.getElementById("linkInicio");
        const linkJuegos = document.getElementById("linkJuegos");
        const linkLogo = document.getElementById("linkLogo");

        // Función que muestra la sección de Inicio y oculta Juegos
        function mostrarInicio() {
            mainContent.classList.add("fade-in");
            mainContent.style.display = "block";
            juegosContent.style.display = "none";
            history.replaceState(null, "", "#inicio");
        }

        // Función que muestra Juegos y oculta Inicio
        function mostrarJuegos() {
            juegosContent.classList.add("fade-in");
            juegosContent.style.display = "block";
            mainContent.style.display = "none";
            history.replaceState(null, "", "#juegos");
        }

        // Eventos para los links
        linkInicio.addEventListener("click", e => {
            e.preventDefault();
            mostrarInicio();
        });
        linkJuegos.addEventListener("click", e => {
            e.preventDefault();
            mostrarJuegos();
        });
        linkLogo.addEventListener("click", e => {
            e.preventDefault();
            // Agrega la animación
    linkLogo.classList.add("animate-click");

    // La quita después de que termina, para que pueda repetirse
    setTimeout(() => {
        linkLogo.classList.remove("animate-click");
    }, 600); // Duración de la animación
            mostrarInicio();
        });

        // Al cargar la página: ocultar preloader y mostrar sección según hash
        window.addEventListener("load", () => {
    const pre = document.getElementById("preloader");
    pre.style.opacity = "0";
    pre.style.visibility = "hidden";
    pre.style.pointerEvents = "none";

    if (location.hash === "#juegos") {
        mostrarJuegos();
    } else {
        mostrarInicio();

        // Si viene de otra página con animación
        if (location.hash === "#inicioAnimado") {
            linkLogo.classList.add("animate-click");
            setTimeout(() => {
                linkLogo.classList.remove("animate-click");
            }, 400); // Tiempo igual al de la animación
        }
    }
});
</script>
<script src="../navbar/script.js"></script>
</body>

</html>