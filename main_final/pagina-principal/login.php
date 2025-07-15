<?php
session_start();
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
    
    <!-- Fuente tecnológica Orbitron -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap" rel="stylesheet">
    
    <!-- Tu archivo de estilos personalizados -->
    <link rel="stylesheet" href="estilo.css">
</head>
<body>

<!-- Preloader (pantalla de carga inicial con logo) -->
<div id="preloader">
    <img src="../navbar/imagenes/logo.jpg" alt="Logo Zentryx" id="preloader-logo">
</div>

<!-- NAVBAR fijo, igual en todas las páginas -->
<nav class="navbar navbar-expand-lg shadow-sm py-3" style="background-color: rgb(20,20,20);">
    <div class="container-fluid">
        
        <!-- Logo y nombre de Zentryx -->
        <a class="navbar-brand fw-bold fs-4 text-white" href="login.html.php">
            <img src="../navbar/imagenes/logo.jpg" width="30" height="30" class="d-inline-block align-text-top">
            &nbsp;Zentryx
        </a>

        <!-- Botón de hamburguesa en móviles -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Menú de navegación -->
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <li class="nav-item"><a class="nav-link text-white" href="login.html.php">Inicio</a></li>
                <li class="nav-item separator"></li>
                <li class="nav-item"><a class="nav-link text-white" href="login.html.php">Juegos</a></li>
            </ul>

            <!-- Ícono de usuario y dropdown -->
        </div>
    </div>
</nav>

<!-- Formulario de inicio de sesión / registro -->
<div class="container mt-5" id="loginForm">
    <h5 class="card-title text-center">Iniciar sesión / Registrarse</h5>
    <p><?php  ?></p>
    <form action="verifica.php" method="post">
                <input type="text" id="username" class="form-control mb-2" placeholder="Nombre de usuario" name="nombre" required>
                <input type="password" id="password" class="form-control mb-3" placeholder="Contraseña" name="contrasenia" required>
                <div id="loginError" class="text-danger mb-2" style="display: none;"></div>
                <button class="btn btn-primary w-100 mb-2" type="submit" name="ini" value="1">Iniciar sesión</button>
                <button class="btn btn-secondary w-100" type="submit" name="ini" value="0">Registrarse</button>
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
