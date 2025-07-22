// Obtengo referencias a los elementos del DOM necesarios para el menú y las secciones
const userMenu = document.getElementById("userMenu");
const mainContent = document.getElementById("mainContent");
const juegosContent = document.getElementById("juegosContent");

// Renderiza el menú del usuario según si hay sesión iniciada o no
function renderMenu() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    // Oculta ambas secciones antes de mostrar la correspondiente
    mainContent.style.display = "none";
    juegosContent.style.display = "none";

    if (loggedInUser) {
        // Si hay usuario logueado, muestra opciones de perfil y cerrar sesión
        userMenu.innerHTML = `
            <li><a class="dropdown-item" href="#">Perfil (${loggedInUser})</a></li>
            <li><a class="dropdown-item" href="#">Configuración</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" onclick="logout()">Cerrar sesión</a></li>
        `;
        // Por defecto, muestra la sección de inicio
        mostrarInicio();
    } else {
        // Si no hay usuario logueado, muestra solo la opción de iniciar sesión/registrarse
        userMenu.innerHTML = `
            <li><a class="dropdown-item" href="../navbar/login.html">Iniciar sesión / Registrarse</a></li>
        `;
        // Por defecto, muestra la sección de inicio
        mostrarInicio();
    }
}

// Muestra la sección de inicio y oculta la de juegos
function mostrarInicio() {
    mainContent.classList.add("fade-in");
    mainContent.style.display = "block";
    juegosContent.style.display = "none";
    // Actualiza el hash de la URL
    if (location.hash !== "#inicio") {
        history.replaceState(null, "", "#inicio");
    }
}

// Muestra la sección de juegos y oculta la de inicio
function mostrarJuegos() {
    juegosContent.classList.add("fade-in");
    juegosContent.style.display = "block";
    mainContent.style.display = "none";
    // Actualiza el hash de la URL
    if (location.hash !== "#juegos") {
        history.replaceState(null, "", "#juegos");
    }
}



// Cierra la sesión del usuario y vuelve a renderizar el menú
function logout() {
    localStorage.removeItem("loggedInUser");
    renderMenu();
}

// Al cargar la página, oculta el preloader y renderiza el menú y la sección correspondiente
window.addEventListener("load", () => {
    // Oculta el preloader visualmente
    const preloader = document.getElementById("preloader");
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
    preloader.style.pointerEvents = "none";

    // Renderiza el menú del usuario
    renderMenu();

    // Muestra la sección según el hash de la URL
    const hash = location.hash;
    if (hash === "#juegos") {
        mostrarJuegos();
    } else {
        // Por defecto, muestra inicio
        mostrarInicio();
    }
});
