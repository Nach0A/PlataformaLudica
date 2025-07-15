script
/****************************************************
 * Variables Globales del Juego y Estadísticas
 ****************************************************/
var prizeDoor = null;              // La puerta que contiene el premio (0, 1 o 2)
var playerInitialChoice = null;    // Puerta seleccionada inicialmente por el jugador
var playerFinalChoice = null;      // Puerta final tras decidir cambiar o mantener
var hostOpenedDoor = null;         // Puerta que abre el anfitrión
var gameInProgress = false;        // Indica si hay un juego en curso

// Imágenes para representar los distintos estados de las puertas
var closedDoorImg = "./imagenes/juego monti/Flux_Dev_A_minimalist_image_of_a_simple_house_door_predominant_2.jpg";
var prizeDoorImg = "./imagenes/juego monti/descarga.jpg";
var emptyDoorImg = "./imagenes/juego monti/Flux_Dev_A_minimaliststyle_image_of_an_open_black_and_white_do_2.jpg";

// Array para almacenar el historial de juegos (estadísticas)
var games = []; // Cada elemento tendrá: {initialDoor, finalDoor, switched, win}

/****************************************************
 * Referencias al DOM
 ****************************************************/
var startButton = document.getElementById("startButton");
var messageDiv = document.getElementById("message");
var doorsDiv = document.getElementById("doors");
var switchContainer = document.getElementById("switchContainer");
var switchButton = document.getElementById("switchButton");
var stayButton = document.getElementById("stayButton");

/****************************************************
 * Función: Iniciar un Nuevo Juego
 * Reinicia las variables, selecciona aleatoriamente
 * la puerta ganadora y configura la interfaz.
 ****************************************************/
function startGame() {
    console.log("Iniciando juego...");
    gameInProgress = true;
    playerInitialChoice = null;
    playerFinalChoice = null;
    hostOpenedDoor = null;

    // Se elige aleatoriamente la puerta que tendrá el premio
    prizeDoor = Math.floor(Math.random() * 3);
    console.log("La puerta con premio es: " + (prizeDoor + 1));

    // Reiniciar la imagen de las puertas a "cerrada"
    for (let i = 0; i < 3; i++) {
        document.getElementById("door" + i).src = closedDoorImg;
    }

    messageDiv.innerHTML = "Selecciona una puerta.";
    doorsDiv.style.display = "flex";
    switchContainer.style.display = "none";

    // Habilitar la interacción con las puertas
    enableDoors();
}

/****************************************************
 * Función: Procesa el clic en una puerta
 * Registra la elección inicial y simula la acción del
 * anfitrión abriendo una de las puertas sin premio.
 ****************************************************/
function doorClicked(event) {
    if (!gameInProgress) return;
    if (playerInitialChoice !== null) return; // Evita múltiples clics durante la misma partida

    playerInitialChoice = parseInt(event.target.getAttribute("data-door"));
    messageDiv.innerHTML = "Has seleccionado la puerta " + (playerInitialChoice + 1) + ".<br>El anfitrión está abriendo una puerta sin premio...";

    // Deshabilita la interacción con las puertas
    disableDoors();

    // Pausa de 1 segundo para simular la acción del anfitrión
    setTimeout(function () {
        hostOpensDoor();
        // Mostrar las opciones para cambiar o mantener la elección
        switchContainer.style.display = "block";
    }, 1000);
}

/****************************************************
 * Funciones para habilitar y deshabilitar la interacción
 * sobre las puertas.
 ****************************************************/
function disableDoors() {
    var doorElements = document.getElementsByClassName("door");
    for (let i = 0; i < doorElements.length; i++) {
        doorElements[i].style.pointerEvents = "none";
    }
}
function enableDoors() {
    var doorElements = document.getElementsByClassName("door");
    for (let i = 0; i < doorElements.length; i++) {
        doorElements[i].style.pointerEvents = "auto";
    }
}

/****************************************************
 * Función: Acción del Anfitrión
 * Abre la primera puerta que no sea la seleccionada por
 * el jugador ni la que contiene el premio.
 ****************************************************/
function hostOpensDoor() {
    for (let i = 0; i < 3; i++) {
        if (i !== playerInitialChoice && i !== prizeDoor) {
            hostOpenedDoor = i;
            break;
        }
    }
    document.getElementById("door" + hostOpenedDoor).src = emptyDoorImg;
    messageDiv.innerHTML += "<br>El anfitrión abrió la puerta " + (hostOpenedDoor + 1) + " (sin premio).";
}

/****************************************************
 * Función: Procesar la Decisión del Jugador
 * (Cambiar o Mantener la elección)
 ****************************************************/
function playerChoosesSwitch(switchDecision) {
    if (!gameInProgress) return;

    if (switchDecision) {
        // Si se cambia la elección, se selecciona la única puerta sin abrir
        for (let i = 0; i < 3; i++) {
            if (i !== playerInitialChoice && i !== hostOpenedDoor) {
                playerFinalChoice = i;
                break;
            }
        }
    } else {
        // Si se mantiene, la puerta final es la elegida inicialmente
        playerFinalChoice = playerInitialChoice;
    }

    // Revela el contenido de todas las puertas
    revealDoors();

    // Determina si el jugador ganó o perdió
    let win = (playerFinalChoice === prizeDoor) ? 1 : 0;
    if (win) {
        messageDiv.innerHTML += "<br>¡Felicidades! Ganaste, la puerta " + (playerFinalChoice + 1) + " contiene el premio.";
    } else {
        messageDiv.innerHTML += "<br>Lo siento, perdiste. El premio estaba en la puerta " + (prizeDoor + 1) + ".";
    }

    // Guarda el resultado del juego en el historial
    games.push({
        initialDoor: playerInitialChoice,
        finalDoor: playerFinalChoice,
        switched: switchDecision ? 1 : 0,
        win: win
    });

    // Actualiza las estadísticas en tiempo real
    updateStats();

    // Finaliza la partida actual  
    gameInProgress = false;
    switchContainer.style.display = "none";
}

/****************************************************
 * Función: Revelar Todas las Puertas
 * Muestra la imagen del premio en la puerta ganadora y
 * la imagen "Sin premio" en las demás.
 ****************************************************/
function revealDoors() {
    for (let i = 0; i < 3; i++) {
        if (i === prizeDoor) {
            document.getElementById("door" + i).src = prizeDoorImg;
        } else {
            document.getElementById("door" + i).src = emptyDoorImg;
        }
    }
}

/****************************************************
 * Función: Actualizar y Mostrar Estadísticas
 * Se calculan y muestran:
 *   - Total de juegos jugados.
 *   - Total de victorias.
 *   - Máxima racha consecutiva de victorias.
 *   - Estadísticas por puerta: veces elegida y racha máxima.
 ****************************************************/
function updateStats() {
    let totalGames = games.length;
    let totalWins = games.filter(game => game.win === 1).length;

    // Calcular racha de victorias
    let currentWinStreak = 0, maxWinStreak = 0;
    games.forEach(game => {
        if (game.win === 1) {
            currentWinStreak++;
            if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
        } else {
            currentWinStreak = 0;
        }
    });

    // Estadísticas por puerta (conteo y racha en elecciones iniciales)
    let doorStats = {
        0: { count: 0, currentStreak: 0, maxStreak: 0 },
        1: { count: 0, currentStreak: 0, maxStreak: 0 },
        2: { count: 0, currentStreak: 0, maxStreak: 0 }
    };
    let lastDoor = null;
    games.forEach(game => {
        let door = game.initialDoor;
        doorStats[door].count++;
        if (lastDoor === door) {
            doorStats[door].currentStreak++;
        } else {
            doorStats[door].currentStreak = 1;
        }
        if (doorStats[door].currentStreak > doorStats[door].maxStreak)
            doorStats[door].maxStreak = doorStats[door].currentStreak;
        lastDoor = door;
    });

    let statsHTML = "<p><strong>Total de juegos:</strong> " + totalGames + "</p>";
    statsHTML += "<p><strong>Total de victorias:</strong> " + totalWins + "</p>";
    statsHTML += "<p><strong>Máxima racha de victorias:</strong> " + maxWinStreak + "</p>";

    for (let door = 0; door < 3; door++) {
        statsHTML += "<h4>Estadísticas para la Puerta " + (door + 1) + ":</h4>";
        statsHTML += "<p>Veces elegida: " + doorStats[door].count + "</p>";
        statsHTML += "<p>Racha máxima consecutiva: " + doorStats[door].maxStreak + "</p>";
    }

    document.getElementById("stats").innerHTML = statsHTML;
}

/****************************************************
 * Asignación de Eventos
 ****************************************************/
// Asigna el evento de clic en cada puerta
let doorElements = document.getElementsByClassName("door");
for (let i = 0; i < doorElements.length; i++) {
    doorElements[i].addEventListener("click", doorClicked);
}
// Eventos para los botones "Cambiar" y "Mantener"
switchButton.addEventListener("click", function () { playerChoosesSwitch(true); });
stayButton.addEventListener("click", function () { playerChoosesSwitch(false); });
// Evento para iniciar el juego
startButton.addEventListener("click", startGame);

// Inicializar estadísticas al cargar la página
updateStats();
